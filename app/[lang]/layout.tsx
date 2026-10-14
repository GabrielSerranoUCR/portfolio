import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Birds } from "@/components/Birds";
import { Nav } from "@/components/Nav";
import { birdFrames } from "@/content/photos";
import { profile } from "@/content/profile";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

const display = Playfair_Display({ subsets: ["latin"], variable: "--nf-display" });
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
        <Nav lang={lang} nav={t.nav} name={profile.name} resume={profile.resume} />
        {children}
        {/* In the layout so the macaws persist and fly across page navigations. */}
        <Birds frames={birdFrames} />
      </body>
    </html>
  );
}
