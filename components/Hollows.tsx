"use client";

import { useEffect } from "react";

/**
 * Paints each `.sheet` as a hollow carved into the page with rugged, cliff-like
 * edges (see globals.css). The hollow is an SVG filter (noise bites the edges,
 * then a shadow from the top lip and light along the bottom rim), rendered once
 * per card size into a PNG that the card's ::before shows.
 *
 * It's baked into a bitmap rather than a live CSS `filter: url(#…)` because
 * Safari re-runs live SVG filters on every repaint nearby (each frame the
 * macaw's guideline grows), which made the macaw stutter, and it renders a
 * size-less SVG background small and stretches it, which turns the edges blocky.
 * (WebKit also mangles feMorphology, hence the inset floor instead of an erode.)
 */

const SEEDS = [11, 47, 83]; // neighbouring cards get different edges
const BLEED = 10; // px the image reaches past the card, room for the rim's outward bites (matches globals.css)

function hollowSvg(width: number, height: number, seed: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <filter id="h" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" seed="${seed}" result="rock"/>
    <feDisplacementMap in="SourceGraphic" in2="rock" scale="14" xChannelSelector="R" yChannelSelector="G" result="floor"/>
    <feFlood flood-color="#281e0a" flood-opacity="0.42"/>
    <feComposite in2="floor" operator="out"/>
    <feOffset dy="5"/>
    <feGaussianBlur stdDeviation="6"/>
    <feComposite in2="floor" operator="in" result="shade"/>
    <feFlood flood-color="#281e0a" flood-opacity="0.3"/>
    <feComposite in2="floor" operator="out"/>
    <feGaussianBlur stdDeviation="1.2"/>
    <feComposite in2="floor" operator="in" result="lip"/>
    <feFlood flood-color="#ffffff" flood-opacity="0.8"/>
    <feComposite in2="floor" operator="out"/>
    <feOffset dy="-2"/>
    <feGaussianBlur stdDeviation="1"/>
    <feComposite in2="floor" operator="in" result="glow"/>
    <feMerge><feMergeNode in="floor"/><feMergeNode in="shade"/><feMergeNode in="lip"/><feMergeNode in="glow"/></feMerge>
  </filter>
  <rect x="${BLEED}" y="${BLEED}" width="${width - 2 * BLEED}" height="${height - 2 * BLEED}" rx="12" fill="#f1ede3" filter="url(#h)"/>
</svg>`;
}

/** Renders the hollow to a PNG object URL at device resolution. */
async function bake(width: number, height: number, seed: number) {
  const scale = Math.min(2, devicePixelRatio || 1);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(hollowSvg(width, height, seed))}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
  return blob ? URL.createObjectURL(blob) : null;
}

export function Hollows() {
  useEffect(() => {
    const baked = new WeakMap<HTMLElement, { size: string; url: string }>();
    const seeds = new WeakMap<HTMLElement, number>();
    let next = 0;

    const paint = async (el: HTMLElement) => {
      // Layout size, ignoring transforms like the portrait's tilt.
      const width = el.offsetWidth + 2 * BLEED;
      const height = el.offsetHeight + 2 * BLEED;
      const size = `${width}x${height}`;
      if (!el.isConnected || width <= 2 * BLEED || baked.get(el)?.size === size) return;
      if (!seeds.has(el)) seeds.set(el, SEEDS[next++ % SEEDS.length]);
      const url = await bake(width, height, seeds.get(el)!);
      if (!url) return;
      const old = baked.get(el);
      baked.set(el, { size, url });
      el.style.setProperty("--hollow", `url("${url}")`);
      if (old) URL.revokeObjectURL(old.url);
    };

    const resizes = new ResizeObserver((entries) => {
      for (const entry of entries) paint(entry.target as HTMLElement);
    });
    // Cards come and go with client-side navigation.
    const watch = () => document.querySelectorAll<HTMLElement>(".sheet").forEach((el) => resizes.observe(el));
    const mutations = new MutationObserver(watch);
    watch();
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      resizes.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
