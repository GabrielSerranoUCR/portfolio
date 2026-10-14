import type { Metadata } from "next";
import { Caveat, Inter, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Birds } from "@/components/Birds";
import { Hollows } from "@/components/Hollows";
import { Nav } from "@/components/Nav";
import { birdFrames } from "@/content/photos";
import { profile } from "@/content/profile";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

// Three families: Montserrat for titles (weight sets the level), Inter for text, Caveat for handwritten notes.
const display = Montserrat({ subsets: ["latin"], variable: "--nf-display" });
const sans = Inter({ subsets: ["latin"], variable: "--nf-sans" });
const hand = Caveat({ subsets: ["latin"], variable: "--nf-hand" });

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://gabrielserranorojas.com"),
    title: { default: `${profile.name} · ${t.meta.title}`, template: `%s · ${profile.name}` },
    description: t.meta.description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", es: "/es" } },
    openGraph: { type: "website", locale: lang, siteName: profile.name, description: t.meta.description },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} ${hand.variable}`}>
      <body className="font-sans antialiased">
        {/* First stop for keyboard and screen-reader users: jump past the nav. */}
        <a
          href="#main"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper focus:translate-y-0"
        >
          {t.nav.skip}
        </a>
        <Nav lang={lang} nav={t.nav} name={profile.name} resume={profile.resume} />
        {children}
        <Hollows />
        {/* In the layout so the macaws persist and fly across page navigations. */}
        <Birds frames={birdFrames} />
      </body>
    </html>
  );
}
