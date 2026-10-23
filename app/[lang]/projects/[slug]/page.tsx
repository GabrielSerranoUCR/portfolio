import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PerchBranch } from "@/components/PerchBranch";
import { Gallery } from "@/components/Gallery";
import { Chip, Rich } from "@/components/ui";
import { projects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || !hasLocale(lang)) return {};
  return {
    title: project.title,
    description: project.summary[lang],
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages: { en: `/en/projects/${slug}`, es: `/es/projects/${slug}` },
    },
  };
}

const bullet =
  "relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold";

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || !hasLocale(lang)) notFound();

  const t = getDictionary(lang);
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const cover = project.cover ?? project.gallery?.[0];

  return (
    <main id="main" className="mx-auto max-w-4xl overflow-x-clip px-5 pt-32 pb-24">
      <header data-perch-zone className="relative">
        <PerchBranch />
        <Link href={`/${lang}#projects`} className="text-sm font-semibold text-azure hover:text-scarlet">
          {t.project.back}
        </Link>
        <p className="mt-8 text-sm text-muted">{project.period[lang]}</p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{project.summary[lang]}</p>
        <p className="mt-6 max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.25em] text-scarlet uppercase">{t.project.role}</span>
          <span className="mt-1 block font-medium">{project.role[lang]}</span>
        </p>
        {project.links?.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full border border-ink/20 px-5 py-2 text-sm font-semibold transition-colors hover:border-ink"
          >
            {t.project.repo} ↗
          </a>
        )}
      </header>

      {project.stats.length > 0 && (
        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {project.stats.map((stat) => (
            <div key={stat.label.en} className="sheet px-4 py-5 text-center">
              <dt className="sr-only">{stat.label[lang]}</dt>
              <dd className="font-display text-3xl font-bold text-scarlet">{stat.value}</dd>
              <dd className="mt-1 text-xs leading-snug text-muted">{stat.label[lang]}</dd>
            </div>
          ))}
        </dl>
      )}

      {cover && (
        <div className="sheet mt-10 p-2">
          <Image
            src={cover.src}
            width={cover.width}
            height={cover.height}
            alt={project.title}
            sizes="(min-width: 896px) 896px, 100vw"
            priority
            className="aspect-[16/9] w-full rounded-[0.9rem] object-cover"
          />
        </div>
      )}

      <div className="mt-12 space-y-5 text-lg leading-relaxed">
        {project.overview.map((p, i) => (
          <p key={i}>
            <Rich text={p[lang]} />
          </p>
        ))}
      </div>

      {project.sections.map((section) => (
        <section key={section.title.en} data-perch-zone className="sheet relative mt-12 p-6 sm:p-10">
          <PerchBranch />
          <h2 className="font-display text-3xl font-semibold">{section.title[lang]}</h2>
          {section.paragraphs?.map((p, i) => (
            <p key={i} className="mt-5 leading-relaxed">
              <Rich text={p[lang]} />
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-6 space-y-3 leading-relaxed">
              {section.bullets.map((b, i) => (
                <li key={i} className={bullet}>
                  <Rich text={b[lang]} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mt-12">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">{t.project.stack}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{t.project.gallery}</h2>
          <Gallery items={project.gallery} lang={lang} t={t.project} />
        </section>
      )}

      <Link
        href={`/${lang}/projects/${next.slug}`}
        data-perch-zone
        className="sheet group relative mt-12 ml-auto block w-fit px-7 py-5"
      >
        <PerchBranch />
        <p className="text-xs font-semibold tracking-[0.25em] text-scarlet uppercase">{t.project.next}</p>
        <p className="mt-1 font-display text-2xl font-semibold group-hover:text-scarlet">{next.title} →</p>
      </Link>
    </main>
  );
}
