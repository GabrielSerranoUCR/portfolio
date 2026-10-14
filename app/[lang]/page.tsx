import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PerchBranch } from "@/components/PerchBranch";
import { Chip, PinIcon, Rich, Section } from "@/components/ui";
import { toucan } from "@/content/photos";
import { education, experience, profile, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";

const dots = ["bg-scarlet", "bg-gold", "bg-azure"];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    // Clip sideways so branches near the edge never widen the page on phones.
    <main className="overflow-x-clip">
      <section
        data-perch-zone
        className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-14 px-5 pt-32 pb-16 md:grid-cols-[1.25fr_1fr] md:pt-44"
      >
        <div>
          <p className="font-hand text-3xl text-scarlet">{t.hero.hello}</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.95] sm:text-8xl">{profile.name}</h1>
          <p className="mt-7 text-lg font-semibold sm:text-xl">{profile.role[lang]}</p>
          <p className="mt-2 max-w-xl text-lg text-muted">{profile.tagline[lang]}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${lang}#projects`}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-scarlet"
            >
              {t.hero.cta} →
            </Link>
            <a
              href={profile.resume}
              download
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-ink"
            >
              {t.hero.resume} ↓
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-sm">
          <div data-perch-spot className="sheet relative rotate-2 p-2.5">
            <Image
              src={profile.portrait.src}
              width={profile.portrait.width}
              height={profile.portrait.height}
              alt={profile.name}
              sizes="(min-width: 768px) 384px, 90vw"
              priority
              className="aspect-[4/5] w-full rounded-[0.9rem] object-cover"
            />
            <PerchBranch />
          </div>
          <figcaption className="mt-4 text-center font-hand text-2xl text-muted">{t.hero.note}</figcaption>
        </figure>

        <p className="col-span-full text-center font-hand text-2xl text-muted">{t.hero.scroll} ↓</p>
      </section>

      <Section id="about" kicker={t.sections.about.kicker} title={t.sections.about.title}>
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed">
            {profile.about.map((p, i) => (
              <p key={i}>
                <Rich text={p[lang]} />
              </p>
            ))}
            <h3 className="pt-6 text-xs font-semibold tracking-[0.25em] text-muted uppercase">{t.sections.education}</h3>
            <ul className="space-y-4">
              {education.map((e) => (
                <li key={e.degree.en}>
                  <p className="font-display text-xl">{e.degree[lang]}</p>
                  <p className="text-sm text-muted">
                    {e.school} · {e.period[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-10">
            {profile.photos.map((photo, i) => (
              <figure key={photo.src} className={i % 2 ? "rotate-2" : "-rotate-2"}>
                <div className="sheet p-2">
                  <Image
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={photo.caption[lang]}
                    sizes="(min-width: 768px) 420px, 90vw"
                    className="aspect-[4/3] w-full rounded-[0.8rem] object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-center font-hand text-xl text-muted">{photo.caption[lang]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section id="experience" kicker={t.sections.experience.kicker} title={t.sections.experience.title}>
        <ol className="relative space-y-10 border-l-2 border-line pl-7 sm:pl-10">
          {experience.map((job, i) => (
            <li key={job.org} className="relative">
              <span
                className={`absolute top-9 -left-[37px] h-4 w-4 rounded-full ring-4 ring-paper sm:-left-[49px] ${dots[i % dots.length]}`}
              />
              <div className="sheet p-6 sm:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-2xl sm:text-3xl">{job.role[lang]}</h3>
                  <p className="text-sm text-muted">{job.period[lang]}</p>
                </div>
                <p className="mt-1 font-medium text-scarlet">
                  {job.org} · {job.place}
                </p>
                <ul className="mt-5 space-y-2.5 leading-relaxed">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold">
                      <Rich text={b[lang]} />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" kicker={t.sections.projects.kicker} title={t.sections.projects.title}>
        <div className="space-y-12">
          {projects.map((project, i) => {
            const cover = project.cover ?? project.gallery?.[0];
            return (
              <Link
                key={project.slug}
                href={`/${lang}/projects/${project.slug}`}
                data-perch-zone
                className={`sheet group relative grid max-w-4xl gap-8 p-6 sm:p-9 ${
                  i % 2 ? "ml-auto" : ""
                } ${cover ? "md:grid-cols-[1fr_15rem]" : ""}`}
              >
                <PerchBranch />
                <div className="flex gap-6">
                  <p className="font-display text-5xl text-line sm:text-6xl">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <p className="text-sm text-muted">{project.period[lang]}</p>
                    <h3 className="mt-1 font-display text-2xl transition-colors group-hover:text-scarlet sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{project.summary[lang]}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.slice(0, 6).map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                      {project.stack.length > 6 && (
                        <Chip>
                          +{project.stack.length - 6} {t.project.more}
                        </Chip>
                      )}
                    </div>
                    <p className="mt-5 text-sm font-semibold text-azure">{t.project.readMore}</p>
                  </div>
                </div>
                {cover && (
                  <Image
                    src={cover.src}
                    width={cover.width}
                    height={cover.height}
                    alt=""
                    sizes="240px"
                    className="aspect-[4/3] w-full self-center rounded-xl object-cover"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </Section>

      <Section id="skills" kicker={t.sections.skills.kicker} title={t.sections.skills.title}>
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((group, i) => (
            <div key={group.label.en} className="sheet p-6 sm:p-8">
              <h3 className="flex items-center gap-2.5 font-display text-2xl">
                <span className={`h-2.5 w-2.5 rounded-full ${dots[i % dots.length]}`} />
                {group.label[lang]}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" kicker={t.sections.contact.kicker} title={t.sections.contact.title}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <ContactForm t={t.contact} email={profile.email} />
          <div>
            <figure className="rotate-2">
              <div className="sheet p-2">
                <Image
                  src={toucan.src}
                  width={toucan.width}
                  height={toucan.height}
                  alt={toucan.location[lang]}
                  sizes="(min-width: 768px) 380px, 90vw"
                  className="aspect-[4/3] w-full rounded-[0.8rem] object-cover"
                />
              </div>
              <figcaption className="mt-2 flex items-center justify-center gap-1.5 font-hand text-xl text-muted">
                <PinIcon className="h-4 w-4 text-scarlet" />
                {toucan.location[lang]}
              </figcaption>
            </figure>
            <p className="mt-8 font-hand text-2xl text-muted">{t.contact.or}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                ["Email", `mailto:${profile.email}`],
                ["LinkedIn", profile.linkedin],
                ["GitHub", profile.github],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold transition-colors hover:border-scarlet hover:text-scarlet"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <footer className="mx-auto max-w-6xl border-t border-line px-5 py-10 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {profile.name} · {t.footer}
        </p>
        <p className="mt-1 text-xs">
          {t.credits} {toucan.credit}.
        </p>
      </footer>
    </main>
  );
}
