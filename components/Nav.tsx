"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const anchors = ["about", "experience", "projects", "skills", "contact"] as const;

export function Nav({ lang, nav, name, resume }: { lang: Locale; nav: Dictionary["nav"]; name: string; resume: string }) {
  const pathname = usePathname();
  const otherLang = lang === "en" ? "es" : "en";
  const switchHref = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${otherLang}`);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-5 px-5">
        <Link href={`/${lang}`} className="mr-auto font-display text-xl">
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
