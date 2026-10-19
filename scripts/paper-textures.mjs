// Bakes the paper textures (globals.css) into tiling PNGs at 2x: run `node scripts/paper-textures.mjs`.
// They used to be live SVG feTurbulence backgrounds, but browsers (Safari especially) re-run those
// filters on every nearby repaint, and the macaw's guideline repaints the page each frame it flies.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const noise = (size, frequency, rgb, alpha) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} 0 0 0 ${alpha} 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const textures = {
  // Fine grain on the page, and a lighter one on the floor of each hollow.
  "grain.png": noise(220, 0.9, [0.22, 0.28, 0.36], 0.07),
  "grain-light.png": noise(220, 0.9, [0.22, 0.28, 0.36], 0.05),
  // Soft mottling on the page.
  "mottle.png": noise(600, 0.012, [0.35, 0.45, 0.58], 0.05),
};

mkdirSync("public/paper", { recursive: true });
for (const [name, svg] of Object.entries(textures)) {
  await sharp(Buffer.from(svg), { density: 144 }).png({ palette: true, colours: 64, dither: 0, compressionLevel: 9 }).toFile(`public/paper/${name}`);
}
