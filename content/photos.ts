import type { L } from "@/lib/i18n";

export type Photo = { src: string; width: number; height: number };

/** The toucan next to the contact form. */
export const toucan = {
  src: "/photos/cr/toucan.jpg",
  width: 2000,
  height: 1550,
  location: { en: "Keel-billed toucan", es: "Tucán pico iris" } satisfies L,
  credit: "Zdenek Machacek",
};

/**
 * The macaw's sprites (all face right). `feet` is where the bird touches the
 * branch, as a fraction of the sprite; the flap frames are aligned on the head
 * so swapping them reads as a wing beat.
 */
export const birdFrames = {
  width: 295,
  height: 174,
  up: "/birds/macaw-up.png",
  down: "/birds/macaw-down.png",
  feet: { x: 0.6, y: 0.55 },
  /**
   * Resting pose shown while perched (optional; falls back to `down`).
   * width/height are in the same units as the flight frames, so this sets its size relative to them.
   */
  idle: { src: "/birds/macaw-idle.png", width: 87, height: 232, feet: { x: 0.692, y: 0.368 } } as
    | { src: string; width: number; height: number; feet: { x: number; y: number } }
    | undefined,
};

/**
 * The branch on every perch. `landing` is the spot on the thick limb where the
 * macaw sits, `pivot` where it bends from; `angle` tilts it up-left so the
 * leaves reach away from the content below.
 */
export const branch = {
  src: "/birds/branch.png",
  width: 504,
  height: 305,
  landing: { x: 0.85, y: 0.29 },
  pivot: { x: 0.98, y: 0.3 },
  angle: 18,
};
