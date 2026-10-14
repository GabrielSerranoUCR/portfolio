# gabrielserranorojas.com

A bilingual (EN/ES) portfolio on white paper, with a scarlet macaw that flies from section to section.
It's built with Next.js 16 (App Router), Tailwind CSS 4 and Motion.

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en or /es
```

## Photos and the macaw

| What | Where | Config |
| --- | --- | --- |
| Toucan (contact section) | `public/photos/cr/toucan.jpg` | `toucan` in `content/photos.ts`: caption + Unsplash credit |
| Portrait, About photos | `public/photos/me/` | `profile.portrait` and `profile.photos` in `content/profile.ts` |
| Project cover / screenshots | `public/projects/<slug>/` | `cover` and `gallery` on each project in `content/profile.ts` |
| Macaw flap frames + resting pose | `public/birds/` | `birdFrames` in `content/photos.ts` (must face right; `feet` marks where it grips the branch) |
| Branch | `public/birds/branch.png` | `branch` in `content/photos.ts` (`landing` point on the limb, `angle`) |

The macaw (`components/Birds.tsx`) flies in a zig-zag between branches as the page scrolls:
- Mark an element with `data-perch-zone` to make it a destination.
- Inside it, mark the element to land on with `data-perch-spot` (give it `position: relative`), and put a `<PerchBranch />` inside that spot. The branch stays visible over the spot's top-right corner, and the macaw lands on its marker.
- The macaw stays perched, moving with the page, until the branch reaches the nav. Then it flies to the visible branch closest to the middle of the screen. If no branch is visible, it hovers in the margin.
- It flaps between two flight poses and switches to the resting pose (`birdFrames.idle`) while perched. Landing dips the branch and taking off lets it spring back.
- Size: `--bird-w` in `app/globals.css` and `birdWidth()` in `components/Birds.tsx`, which must match.

All text lives in `content/profile.ts` (resume content) and `lib/dictionaries.ts` (UI strings).
In content strings, `**text**` gets a gold highlighter stroke.

## Deploying to a VPS

```bash
cp .env.example .env    # fill in the SMTP password
docker compose up -d --build
```

Caddy serves the site on `gabrielserranorojas.com` with automatic HTTPS. The DNS A record needs to point at the VPS.
To add other projects, give them their own blocks in the `Caddyfile`.
