"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const anchors = ["about", "experience", "projects", "skills", "contact"] as const;
const NAV_HEIGHT = 72;
const SPOT_KEY = "lang-switch-spot";
// Structural elements only: inline ones like <strong> differ between translations.
const BLOCKS = "main :is(section, header, div, h1, h2, h3, p, ul, li, figure, dl, form, label)";

/*
 * Switching language keeps your place. Both languages render the same elements,
 * only the text differs (and so do heights), so instead of the raw scroll offset
 * we remember which element of <main> is at the top of the screen and where,
 * and put that same element back there on the other language's page.
 */
function rememberSpot() {
  const all = Array.from(document.querySelectorAll(BLOCKS));
  // The first element starting below the nav: small and specific (a heading, a paragraph), so little can shift around it.
  const index = all.findIndex((el) => el.getBoundingClientRect().top >= NAV_HEIGHT);
  if (index < 0) return;
  const spot = { index, top: all[index].getBoundingClientRect().top, count: all.length };
  try {
    sessionStorage.setItem(SPOT_KEY, JSON.stringify(spot));
  } catch {}
}

function restoreSpot() {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(SPOT_KEY);
    sessionStorage.removeItem(SPOT_KEY);
  } catch {}
  if (!raw) return;
  const spot = JSON.parse(raw) as { index: number; top: number; count: number };
  const all = document.querySelectorAll(BLOCKS);
  // Only trust the match when the page has the same shape as the one we left.
  const el = all.length === spot.count ? all[spot.index] : null;
  if (!el) return;
  scrollTo({ top: scrollY + el.getBoundingClientRect().top - spot.top, behavior: "instant" });
}

export function Nav({ lang, nav, name, resume }: { lang: Locale; nav: Dictionary["nav"]; name: string; resume: string }) {
  const pathname = usePathname();
  const otherLang = lang === "en" ? "es" : "en";
  const switchHref = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${otherLang}`);

  useEffect(() => {
    // After the switch has rendered the other language (the page's layout is in place by the next frame).
    const frame = requestAnimationFrame(restoreSpot);
    return () => cancelAnimationFrame(frame);
  }, [lang]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-5 px-5">
        <Link href={`/${lang}`} className="mr-auto font-display text-xl font-bold tracking-tight">
          {name}
        </Link>
        <ul className="hidden gap-6 text-sm text-muted md:flex">
          {anchors.map((id) => (
            <li key={id}>
              <Link href={`/${lang}#${id}`} className="transition-colors hover:text-scarlet">
                {nav[id]}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={switchHref}
          hrefLang={otherLang}
          lang={otherLang}
          scroll={false}
          onClick={rememberSpot}
          aria-label={nav.switchLabel}
          className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold transition-colors hover:border-ink"
        >
          {nav.switchTo}
        </Link>
        <a
          href={resume}
          download
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-scarlet"
        >
          {nav.resume} ↓
        </a>
      </div>
    </nav>
  );
}
