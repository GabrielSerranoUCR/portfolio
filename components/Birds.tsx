"use client";

import { useEffect, useRef } from "react";
import type { birdFrames } from "@/content/photos";

/**
 * A macaw that zig-zags between branches as the page scrolls.
 *
 * - `[data-perch-zone]` marks something it can land on; `[data-perch-spot]`
 *   inside it is the exact element (defaults to the zone itself). Each spot
 *   holds a <PerchBranch />, and the bird lands on its `[data-branch-landing]` marker.
 * - The bird stays perched until the branch's landing spot reaches the nav (or
 *   drops off the bottom). Then it flies to the visible branch nearest the
 *   reading line. With none in view it hovers in the margin (on phones, tucked
 *   into the top-right corner under the nav so it stays out of the text).
 * - Landing dips the branch and taking off lets it spring back (`[data-branch-sway]`).
 * - Once `[data-perch-finale]` (a photo with a branch in it) is fully in view, it heads there instead
 *   (to the photo's branch), facing `data-perch-face` and grown to `data-perch-scale`,
 *   and stays put there however you scroll until someone clicks (or taps) it: it
 *   swivels on its feet, then flies off. It won't go back until
 *   the finale's section has been scrolled out of view.
 *   Whatever it's perched on gets `data-perched`, so the page can react to its arrival.
 * - Every flight is traced from its feet as a squiggly dashed guideline that stays on
 *   the page, so the whole route builds up as you scroll. The latest flight is drawn
 *   strongest and each finished one eases down to a faint line. It sits behind the
 *   content, and resets on a new page or a width change, where it would no longer line up.
 *
 * The bird is positioned in document coordinates (not `position: fixed`), so
 * while perched the browser scrolls it together with its branch on the
 * compositor. A fixed overlay driven from JS lags a frame behind on phones,
 * which shows up as the bird dragging behind the page. Only while hovering in
 * place does it switch to `position: fixed`, so it stays put as the page scrolls.
 */

const ZONE = "[data-perch-zone]";
const SPOT = "[data-perch-spot]";
const FINALE = "[data-perch-finale]";
const SWIVEL_MS = 650;
const READING_LINE = 0.42; // fraction of viewport height
const NAV_HEIGHT = 72;
const BOTTOM_LIMIT = 0.88; // branches below this fraction of the viewport are out of reach
const BEAT_MS = 110; // time per flap frame while flying
const PHONE_MAX_WIDTH = 639; // matches Tailwind's `sm` breakpoint
const TRAIL_STEP = 16; // px of travel between trail points; wider spacing rounds the zig-zag into a squiggle
const TRAIL_OPACITY = 0.5; // the flight being drawn
const TRAIL_RESTING_OPACITY = 0.07; // what finished flights fade down to
const TRAIL_FADE_MS = 5000;

type Frames = typeof birdFrames;
type Flight = { fromX: number; fromY: number; start: number; duration: number; zigs: number; amp: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Triangle wave in [-1, 1]: sharp zig-zag turns instead of a smooth sine. */
const triangle = (u: number) => (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * u));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** A smooth path through the points: curves via each point to the next midpoint, rounding the zig-zag corners. */
function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    d += `Q${ax.toFixed(1)} ${ay.toFixed(1)} ${((ax + bx) / 2).toFixed(1)} ${((ay + by) / 2).toFixed(1)}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d}L${lx.toFixed(1)} ${ly.toFixed(1)}`;
}

const spotOf = (zone: Element) =>
  Array.from(zone.querySelectorAll(SPOT)).find((s) => s.closest(ZONE) === zone) ?? zone;

/** The landing point on a perch's branch, in viewport px (falls back to the spot's top-right). */
function landingPoint(zone: Element) {
  const marker = spotOf(zone).querySelector("[data-branch-landing]");
  if (marker) {
    const r = marker.getBoundingClientRect();
    return { x: r.left, y: r.top };
  }
  const r = spotOf(zone).getBoundingClientRect();
  return { x: r.right - 40, y: r.top };
}

export function Birds({ frames }: { frames: Frames }) {
  const birdRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = birdRef.current!;
    const trailEl = trailRef.current!;
    const [upImg, downImg, idleImg] = Array.from(el.querySelectorAll("img"));
    const aspect = frames.height / frames.width;
    // Height of the sprite above the feet, in frame units (the idle pose stands taller).
    const headroom = Math.max(frames.feet.y * frames.height, frames.idle ? frames.idle.feet.y * frames.idle.height : 0);

    let perch: Element | null | undefined; // undefined = not decided yet, null = hovering
    let swayEl: HTMLElement | null = null; // the branch currently bouncing
    let sway = 0; // its angle (deg) and velocity: a damped spring
    let swayVelocity = 0;
    let flight: Flight | null = null;
    // Bird position in document coordinates.
    let x = -340;
    let y = scrollY + innerHeight * 0.25;
    let face = 1;
    let faceSmooth = 1;
    let last = performance.now();
    let frame = 0;
    let lastTransform = "";
    let lastPose = "";
    let lastWidth = "";
    let lastPosition = "";
    let landedOn: Element | null = null; // carries data-perched
    let scale = 1; // eases toward the perch's data-perch-scale
    // The flight being traced, at the bird's feet in document coordinates.
    // Finished flights become their own fading paths in front of the active one.
    let trail: [number, number][] = [];
    let routePage = location.pathname;
    let routeWidth = innerWidth;

    // Keep in sync with --bird-w in globals.css.
    const birdWidth = () => clamp(innerWidth * 0.13, 150, 200);

    const reachable = (zone: Element, width: number) => {
      const p = landingPoint(zone);
      const above = headroom * (width / frames.width);
      return p.y - above >= NAV_HEIGHT && p.y <= innerHeight * BOTTOM_LIMIT && p.x > 0 && p.x < innerWidth;
    };

    let finaleLocked = false; // after a release, until the finale's section leaves the screen
    const swivelEl = el.firstElementChild as HTMLElement;
    let releaseTimer = 0;
    // A click (or tap) while it rests on the finale: swivel, then fly off.
    const onClick = () => {
      if (!perch?.matches(FINALE) || releaseTimer) return;
      // On the inner wrapper, which has its own compositor layer: rotating the bird itself
      // would also swing its page-sized translate, and without a layer Safari repaints the
      // sprites' shadows every frame, which made the swivel stutter.
      if (!reduceMotion) {
        swivelEl.animate(
          [
            { transform: "rotate(0deg) translateY(0)" },
            { transform: "rotate(-18deg) translateY(-4%)", offset: 0.2 },
            { transform: "rotate(15deg) translateY(-6%)", offset: 0.45 },
            { transform: "rotate(-9deg) translateY(-2%)", offset: 0.7 },
            { transform: "rotate(0deg) translateY(0)" },
          ],
          { duration: SWIVEL_MS, easing: "ease-in-out" },
        );
      }
      releaseTimer = window.setTimeout(() => {
        finaleLocked = true;
        releaseTimer = 0;
      }, reduceMotion ? 0 : SWIVEL_MS);
    };
    el.addEventListener("click", onClick);

    const pickPerch = (width: number): Element | null => {
      if (finaleLocked) {
        // Released: the finale reopens once its section has been scrolled away.
        const section = document.querySelector(FINALE)?.closest("section");
        const r = section?.getBoundingClientRect();
        if (!r || r.bottom < NAV_HEIGHT || r.top > innerHeight) finaleLocked = false;
      }
      if (perch?.matches(FINALE)) {
        // Settled on the finale: it stays until released, wherever the page scrolls.
        if (!finaleLocked && document.contains(perch)) return perch;
      } else if (!finaleLocked) {
        // The whole finale in view (below the nav): it wins over wherever the bird is sitting.
        const finale = document.querySelector(FINALE);
        const r = finale?.getBoundingClientRect();
        if (finale && r && r.top >= NAV_HEIGHT && r.bottom <= innerHeight) return finale;
      }
      if (perch && !perch.matches(FINALE) && document.contains(perch) && reachable(perch, width)) return perch;
      const line = innerHeight * READING_LINE;
      let best: Element | null = null;
      let bestDistance = Infinity;
      for (const zone of document.querySelectorAll(ZONE)) {
        if (!reachable(zone, width)) continue;
        const d = Math.abs(landingPoint(zone).y - line);
        if (d < bestDistance) {
          best = zone;
          bestDistance = d;
        }
      }
      return best;
    };

    /** Top-left of the bird sprite box in document coordinates: feet on the branch, or a hover spot. */
    const target = (width: number) => {
      const height = width * aspect;
      if (!perch) {
        // Phones have no side margin, so hover in the top-right corner, just under the nav.
        const phone = innerWidth <= PHONE_MAX_WIDTH;
        // It hovers facing left, mirrored around its feet, which shifts the drawn bird right.
        const mirrorShift = (2 * frames.feet.x - 1) * width;
        return {
          x: scrollX + innerWidth - width * (phone ? 1 : 1.15) - (phone ? 4 : 12) - mirrorShift,
          y: scrollY + (phone ? NAV_HEIGHT + 4 : innerHeight * 0.3),
        };
      }
      const p = landingPoint(perch);
      return { x: scrollX + p.x - width * frames.feet.x, y: scrollY + p.y - height * frames.feet.y };
    };

    const kickBranch = (zone: Element | null | undefined, impulse: number) => {
      const next = zone ? spotOf(zone).querySelector<HTMLElement>("[data-branch-sway]") : null;
      if (!next) return;
      if (swayEl && swayEl !== next) swayEl.style.rotate = "";
      if (swayEl !== next) sway = 0;
      swayEl = next;
      swayVelocity += impulse;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const base = birdWidth();

      // ---- Reads first (layout is clean here), writes at the end of the frame ----
      const next = pickPerch(base);
      // Grow or shrink toward the perch's size (the finale asks for a bigger bird) over the flight there.
      const goal = Number(next instanceof HTMLElement ? next.dataset.perchScale : undefined) || 1;
      scale = reduceMotion ? goal : scale + (goal - scale) * Math.min(1, dt / 260);
      if (Math.abs(goal - scale) < 0.002) scale = goal;
      const width = base * scale;
      if (next !== perch) {
        // Taking off lets the old branch spring up.
        if (perch && !flight && !reduceMotion) kickBranch(perch, 0.05);
        perch = next;
        const t = target(width);
        const dist = Math.hypot(t.x - x, t.y - y);
        flight = reduceMotion
          ? null
          : {
              fromX: x,
              fromY: y,
              start: now,
              duration: clamp(500 + dist * 1.1, 900, 2200),
              zigs: Math.max(2, Math.round(dist / 240)),
              amp: clamp(dist * 0.16, 36, 110),
            };
      }

      const t = target(width);
      let nx = t.x;
      let ny = t.y;
      if (flight) {
        const progress = (now - flight.start) / flight.duration;
        if (progress < 1) {
          const dx = t.x - flight.fromX;
          const dy = t.y - flight.fromY;
          const len = Math.hypot(dx, dy) || 1;
          // Offset perpendicular to the straight path, fading in and out at the ends.
          const zig = triangle(progress * flight.zigs) * flight.amp * Math.sin(Math.PI * progress);
          const e = easeInOut(progress);
          nx = flight.fromX + dx * e + (-dy / len) * zig;
          ny = flight.fromY + dy * e + (dx / len) * zig;
        } else {
          flight = null;
          if (perch) kickBranch(perch, -0.09); // the landing dips the branch
        }
      }
      const flying = flight !== null;
      const hovering = !perch;
      const perched = !flying && !hovering;
      if (perched && Math.abs(nx - x) < 1 && Math.abs(ny - y) < 1) {
        // Ignore sub-pixel noise from fractional scroll offsets mid-gesture, so a
        // perched bird isn't rewritten every frame and stays on the compositor.
        nx = x;
        ny = y;
      }

      const vx = nx - x;
      const vy = ny - y;
      if (flying && Math.abs(vx) > 0.4) face = vx > 0 ? 1 : -1;
      if (hovering && !flying) face = -1; // look back toward the content
      const facing = perched && perch instanceof HTMLElement ? perch.dataset.perchFace : undefined;
      if (facing) face = facing === "left" ? -1 : 1;
      const landed = perched ? perch! : null;
      if (landed !== landedOn) {
        landedOn?.removeAttribute("data-perched");
        landed?.setAttribute("data-perched", "");
        landedOn = landed;
        // Only pokeable while resting on the finale; elsewhere clicks pass through to the page.
        const pokeable = !!landed?.matches(FINALE);
        el.style.pointerEvents = pokeable ? "auto" : "";
        el.style.cursor = pokeable ? "pointer" : "";
        el.style.touchAction = pokeable ? "manipulation" : "";
      }
      faceSmooth += (face - faceSmooth) * 0.18;
      if (Math.abs(face - faceSmooth) < 0.002) faceSmooth = face;
      x = nx;
      y = ny;

      let pose: "up" | "down" | "idle";
      if (perched && frames.idle) pose = "idle";
      else if (reduceMotion) pose = "down";
      else if (flying || hovering) pose = Math.floor(now / BEAT_MS) % 2 === 0 ? "up" : "down";
      else {
        // No idle sprite: rest wings-down with a couple of balancing flaps now and then.
        const cycle = now % 2600;
        pose = cycle < 4 * BEAT_MS && Math.floor(cycle / BEAT_MS) % 2 === 0 ? "up" : "down";
      }

      const tilt = flying ? clamp((Math.atan2(vy, Math.abs(vx) + 0.01) * 180) / Math.PI, -28, 28) * 0.6 : 0;
      const bob = reduceMotion ? 0 : hovering ? Math.sin(now / 280) * (innerWidth <= PHONE_MAX_WIDTH ? 3 : 6) : 0;

      // ---- Writes ----
      if (swayEl) {
        swayVelocity += (-0.004 * sway - 0.012 * swayVelocity) * dt;
        sway += swayVelocity * dt * 0.06;
        if (Math.abs(sway) < 0.005 && Math.abs(swayVelocity) < 0.0005) {
          // Settled: clear the inline rotation so the branch stops repainting.
          swayEl.style.rotate = "";
          swayEl = null;
          sway = swayVelocity = 0;
        } else {
          swayEl.style.rotate = `${sway.toFixed(3)}deg`;
        }
      }

      if (location.pathname !== routePage || innerWidth !== routeWidth) {
        routePage = location.pathname;
        routeWidth = innerWidth;
        trail = [];
        trailEl.removeAttribute("d");
        for (const old of trailEl.parentElement!.querySelectorAll("[data-flown]")) old.remove();
      }
      const feet: [number, number] = [x + width * frames.feet.x, y + width * aspect * frames.feet.y];
      if (flying) {
        const prev = trail[trail.length - 1];
        if (!prev || Math.hypot(feet[0] - prev[0], feet[1] - prev[1]) >= TRAIL_STEP) trail.push(feet);
        // Draw up to the bird itself so the line never lags behind it.
        trailEl.setAttribute("d", smoothPath([...trail, feet]));
      } else if (trail.length) {
        // Landed: end this flight's line on the branch, keep it, and let it fade back.
        const flown = trailEl.cloneNode() as SVGPathElement;
        flown.setAttribute("d", smoothPath([...trail, feet]));
        flown.dataset.flown = "";
        trailEl.before(flown);
        flown.animate([{ strokeOpacity: TRAIL_OPACITY }, { strokeOpacity: TRAIL_RESTING_OPACITY }], {
          duration: TRAIL_FADE_MS,
          easing: "cubic-bezier(0.3, 0, 0.2, 1)",
          fill: "forwards",
        });
        trail = [];
        trailEl.removeAttribute("d");
      }

      // Only touch the DOM when something changed; a perched bird is left
      // alone so the compositor scrolls it with the page.
      // Hovering in place is pinned to the viewport so it doesn't trail the scroll.
      const pinned = hovering && !flying;
      const position = pinned ? "fixed" : "absolute";
      if (position !== lastPosition) {
        el.style.position = position;
        lastPosition = position;
      }
      const px = pinned ? x - scrollX : x;
      const py = (pinned ? y - scrollY : y) + bob;
      const transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${(tilt * Math.sign(faceSmooth)).toFixed(2)}deg) scaleX(${faceSmooth.toFixed(3)})`;
      if (transform !== lastTransform) {
        el.style.transform = transform;
        lastTransform = transform;
      }
      const widthPx = `${width}px`;
      if (widthPx !== lastWidth) {
        el.style.width = widthPx;
        el.style.opacity = "1";
        lastWidth = widthPx;
      }
      if (pose !== lastPose) {
        upImg.style.opacity = pose === "up" ? "1" : "0";
        downImg.style.opacity = pose === "down" ? "1" : "0";
        if (idleImg) idleImg.style.opacity = pose === "idle" ? "1" : "0";
        lastPose = pose;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("click", onClick);
      clearTimeout(releaseTimer);
      landedOn?.removeAttribute("data-perched");
      if (swayEl) swayEl.style.rotate = "";
    };
  }, [frames]);

  const idle = frames.idle;
  // Each pose is its own composited layer with its own shadow, so swapping
  // poses is a cheap opacity change instead of a repaint of the whole bird.
  const sprite = "absolute block h-auto drop-shadow-[0_10px_8px_rgb(0_0_0/0.18)] will-change-[opacity]";
  return (
    <>
      {/* The guideline: below everything in the page, so cards and text always cover it.
          Its own layer, so redrawing it every frame of a flight doesn't repaint the page too. */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-0 -z-10 h-0 w-full overflow-x-clip">
        <svg className="absolute top-0 left-0 overflow-visible will-change-transform" width="1" height="1">
          <g className="fill-none stroke-scarlet" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 9">
            <path ref={trailRef} strokeOpacity={TRAIL_OPACITY} />
          </g>
        </svg>
      </div>
      {/* Document-sized layer at the top of the page; clips sideways so the bird never widens the page. */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-0 z-40 h-0 w-full overflow-x-clip">
        <div
          ref={birdRef}
          className="absolute top-0 left-0 opacity-0 will-change-transform"
          // Flip and tilt around the feet so the bird stays on the branch whichever way it faces.
          style={{
            aspectRatio: `${frames.width} / ${frames.height}`,
            transformOrigin: `${frames.feet.x * 100}% ${frames.feet.y * 100}%`,
          }}
        >
          {/* Swivels around the feet when poked off the finale. */}
          <div className="absolute inset-0 will-change-transform" style={{ transformOrigin: `${frames.feet.x * 100}% ${frames.feet.y * 100}%` }}>
            {/* eslint-disable @next/next/no-img-element -- sprite frames swapped every few frames */}
            <img src={frames.up} width={frames.width} height={frames.height} alt="" draggable={false} className={`${sprite} top-0 left-0 w-full`} />
            <img src={frames.down} width={frames.width} height={frames.height} alt="" draggable={false} className={`${sprite} top-0 left-0 w-full opacity-0`} />
            {idle && (
              <img
                src={idle.src}
                width={idle.width}
                height={idle.height}
                alt=""
                draggable={false}
                className={`${sprite} max-w-none opacity-0`}
                // Size the resting pose relative to the flight frames and line its feet up with theirs.
                style={{
                  width: `${(idle.width / frames.width) * 100}%`,
                  left: `${((frames.feet.x * frames.width - idle.feet.x * idle.width) / frames.width) * 100}%`,
                  top: `${((frames.feet.y * frames.height - idle.feet.y * idle.height) / frames.height) * 100}%`,
                }}
              />
            )}
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </div>
      </div>
    </>
  );
}
