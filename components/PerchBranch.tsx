import { branch } from "@/content/photos";

// The branch rests over its parent's top-right corner: the landing spot sits a
// little inside the corner, tilted up-left by `branch.angle` around the pivot.
// Offsets are worked out once here, in units of the branch's width.
const aspect = branch.height / branch.width;
const rad = (branch.angle * Math.PI) / 180;
const ox = branch.landing.x - branch.pivot.x; // pivot → landing, unrotated
const oy = (branch.landing.y - branch.pivot.y) * aspect;
const rx = ox * Math.cos(rad) - oy * Math.sin(rad); // …and rotated
const ry = ox * Math.sin(rad) + oy * Math.cos(rad);
const INSET = 0.1; // landing spot's distance in from the corner, in branch widths
const LEFT = -INSET - rx - branch.pivot.x;
const TOP = -ry - branch.pivot.y * aspect;
const origin = `${branch.pivot.x * 100}% ${branch.pivot.y * 100}%`;

/**
 * A branch for the macaw to land on. Put it inside a `position: relative`
 * perch spot. The bird finds `[data-branch-landing]` and sways `[data-branch-sway]`.
 */
export function PerchBranch() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 block select-none"
      style={{
        width: "var(--branch-w)",
        left: `calc(100% + var(--branch-w) * ${LEFT.toFixed(4)})`,
        top: `calc(2px + var(--branch-w) * ${TOP.toFixed(4)})`,
        rotate: `${branch.angle}deg`,
        transformOrigin: origin,
      }}
    >
      <span data-branch-sway className="relative block" style={{ transformOrigin: origin }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative sprite */}
        <img src={branch.src} width={branch.width} height={branch.height} alt="" draggable={false} className="block h-auto w-full" />
        <span
          data-branch-landing
          className="absolute block h-px w-px"
          style={{ left: `${branch.landing.x * 100}%`, top: `${branch.landing.y * 100}%` }}
        />
      </span>
    </span>
  );
}
