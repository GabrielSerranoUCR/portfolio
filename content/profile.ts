import type { L } from "@/lib/i18n";
import type { Photo } from "./photos";

// Text wrapped in **double asterisks** gets a hand-drawn highlight.

export const profile = {
  name: "Gabriel Serrano Rojas",
  email: "serranogabo10@gmail.com",
  linkedin: "https://linkedin.com/in/gabrielserranor",
  github: "https://github.com/GabrielSerranoUCR",
  resume: "/resume/GabrielSerranoRojas.pdf",
  portrait: { src: "/photos/me/portrait.jpg", width: 1400, height: 1867 },
  photos: [
    {
      src: "/photos/me/bookstore.jpg",
      width: 1800,
      height: 1350,
      caption: { en: "At MangaKaCR", es: "En MangaKaCR" },
    },
    {
      src: "/photos/me/team.jpg",
      width: 1600,
      height: 900,
      caption: { en: "Research team at UNED", es: "Equipo de investigación en la UNED" },
    },
  ] satisfies (Photo & { caption: L })[],
  role: {
    en: "Full-stack software engineer",
    es: "Ingeniero de software full-stack",
  },
  tagline: {
    en: "Every day learning new things, developing and keeping the vibes up.",
    es: "Todos los días aprendiendo cosas nuevas, desarrollando y manteniendo la buena vibra.",
  },
  about: [
    {
      en: "I'm Gabriel, a **software engineering** student at the Universidad de Costa Rica, pursuing a concurrent degree in **physics**.",
      es: "Soy Gabriel, estudiante de **Ingeniería de Software** en la Universidad de Costa Rica, y curso en paralelo la carrera de **Física**.",
    },
    {
      en: "Since 2024 I've been the full-stack engineer behind MangaKaCR, a manga bookstore in San José, building their point-of-sale system, e-commerce and integrations end to end. I also work as a research assistant, turning paper-based biomedical studies into offline-first software.",
      es: "Desde 2024 soy el ingeniero full-stack detrás de MangaKaCR, una librería de manga en San José, donde construí de punta a punta su punto de venta, su comercio electrónico y sus integraciones. También trabajo como asistente de investigación, llevando estudios biomédicos en papel a software que funciona sin conexión.",
    },
  ] satisfies L[],
};

export const education: { degree: L; school: string; period: L }[] = [
  {
    degree: { en: "B.S. in Software Engineering", es: "Bachillerato en Ingeniería de Software" },
    school: "Universidad de Costa Rica",
    period: { en: "Mar 2023 – Dec 2026 (expected)", es: "Mar. 2023 – dic. 2026 (esperado)" },
  },
  {
    degree: { en: "B.S. in Physics (concurrent degree)", es: "Bachillerato en Física (carrera simultánea)" },
    school: "Universidad de Costa Rica",
    period: { en: "Mar 2021 – Present", es: "Mar. 2021 – actualidad" },
  },
];

export const experience: { role: L; org: string; place: string; period: L; bullets: L[] }[] = [
  {
    role: { en: "Full-Stack Engineer", es: "Ingeniero Full-Stack" },
    org: "MangaKaCR Bookstore",
    place: "San José, Costa Rica",
    period: { en: "Mar 2024 – Present", es: "Mar. 2024 – actualidad" },
    bullets: [
      {
        en: "Built a clean-architecture POS and inventory system (ASP.NET Core, Blazor, PostgreSQL), **reducing costs by 78%**",
        es: "Construí un sistema de punto de venta e inventario con arquitectura limpia (ASP.NET Core, Blazor, PostgreSQL), **reduciendo costos en un 78%**",
      },
      {
        en: "Implemented invoicing, layaways, cashback and audited voids; built live cross-tab sync with an in-process pub/sub",
        es: "Implementé facturación, apartados, cashback y anulaciones auditadas; construí la sincronización en vivo entre pestañas con un pub/sub en proceso",
      },
      {
        en: "Built the sales analytics: **8-dimension drill-down rankings**, period and year-over-year trends, and KPIs with layaway-aware revenue",
        es: "Construí la analítica de ventas: **rankings con drill-down en 8 dimensiones**, tendencias contra el período y el año anterior, y KPIs que reconocen los ingresos de apartados",
      },
      {
        en: "Wrote **900+ xUnit and Testcontainers tests**; set up CI, CodeQL, SonarQube and Docker builds on GitHub Actions",
        es: "Escribí **más de 900 pruebas con xUnit y Testcontainers**; configuré CI, CodeQL, SonarQube y builds de Docker en GitHub Actions",
      },
      {
        en: "Developed the Wix e-commerce site (**~3,000 monthly users**, ~$2,000 monthly revenue); started a Next.js storefront (in progress)",
        es: "Desarrollé el sitio de comercio electrónico en Wix (**~3.000 usuarios mensuales**, ~$2.000 de ingresos mensuales); inicié una tienda en Next.js (en progreso)",
      },
      {
        en: "Automated a daily product-catalog PDF sync to Google Drive and integrated the tax authority's (Hacienda) API",
        es: "Automaticé la sincronización diaria del catálogo de productos en PDF a Google Drive e integré la API de Hacienda",
      },
    ],
  },
  {
    role: { en: "Student Research Assistant", es: "Asistente de Investigación" },
    org: "Universidad Estatal a Distancia / Universidad de Costa Rica",
    place: "San José, Costa Rica",
    period: { en: "Feb 2026 – Present", es: "Feb. 2026 – actualidad" },
    bullets: [
      {
        en: "Digitized biomedical questionnaires into an offline HTML/CSS/JS app that keeps patient data in local CSVs",
        es: "Digitalicé cuestionarios biomédicos en una aplicación HTML/CSS/JS sin conexión que guarda los datos de pacientes en CSV locales",
      },
      {
        en: "Built CSV merge and schema-restore tools and a response viewer to reconcile diverging questionnaires",
        es: "Construí herramientas para fusionar CSV y restaurar esquemas, y un visor de respuestas para conciliar cuestionarios divergentes",
      },
      {
        en: "Supervised the on-site migration of **600+ paper questionnaires** to the digital system used by 10 other research assistants",
        es: "Supervisé en sitio la migración de **más de 600 cuestionarios en papel** al sistema digital que usan otros 10 asistentes de investigación",
      },
    ],
  },
];

export const skills: { label: L; items: string[] }[] = [
  {
    label: { en: "Languages", es: "Lenguajes" },
    items: ["C#", "TypeScript", "JavaScript", "Python", "C/C++", "SQL (PostgreSQL, SQL Server)", "HTML/CSS", "R"],
  },
  {
    label: { en: "Frameworks", es: "Frameworks" },
    items: ["ASP.NET Core", "Blazor", "EF Core", "Next.js", "React", "Node.js", "Prisma", "xUnit", "Vitest", "Playwright"],
  },
  {
    label: { en: "Cloud & Tools", es: "Nube y herramientas" },
    items: ["Git", "GitHub Actions", "Docker", "Azure", "Entra ID", "Google Cloud", "Cloudflare R2", "Supabase", "MinIO", "Wix"],
  },
];

/** Life outside the code, after the contact section. */
export const extras = {
  podcast: {
    youtubeId: "ltSKzyDhLzY",
    title: "¿Quién controla nuestra atención?",
    subtitle: { en: "A software engineer podcast", es: "Un podcast de ingeniería de software" } satisfies L,
  },
  photos: [
    {
      src: "/photos/extra/user-stories.jpg",
      width: 1600,
      height: 1200,
      // Shifted left of centre so the square crop keeps both people at the whiteboard.
      focus: "40% 50%",
      caption: {
        en: "Brainstorming and formulating user stories for the ThemePark@UCR project",
        es: "Lluvia de ideas y redacción de historias de usuario para el proyecto ThemePark@UCR",
      },
    },
    {
      src: "/photos/extra/ngabe-research.jpg",
      width: 1600,
      height: 1200,
      caption: {
        en: "Taking part in mental health research in a Ngäbe Indigenous community in San Vito, Coto Brus",
        es: "Participando en una investigación de salud mental en una comunidad indígena Ngäbe en San Vito, Coto Brus",
      },
    },
    {
      src: "/photos/extra/bruna.jpg",
      width: 1200,
      height: 1600,
      caption: { en: "The center of my universe, my dog Bruna", es: "El centro de mi universo, mi perrita Bruna" },
    },
  ] satisfies (Photo & { caption: L; focus?: string })[],
};
