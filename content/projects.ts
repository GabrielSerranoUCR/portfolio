import type { L } from "@/lib/i18n";
import type { Photo } from "./photos";

// Written from each repository's code, commit history and pull requests (not the résumé).
// For team projects, only work from Gabriel's own commits is described.
// Text wrapped in **double asterisks** gets a highlighter stroke.

export type ProjectSection = { title: L; paragraphs?: L[]; bullets?: L[] };

export type Project = {
  slug: string;
  title: string;
  period: L;
  /** Gabriel's role on the project. */
  role: L;
  summary: L;
  stack: string[];
  stats: { value: string; label: L }[];
  overview: L[];
  sections: ProjectSection[];
  links?: { live?: string; repo?: string };
  /** Card / header image; falls back to the first gallery image. */
  cover?: Photo;
  /** Screenshots in /public/projects/<slug>/ */
  gallery?: (Photo & { caption: L })[];
};

const mangakaPos: Project = {
  slug: "mangakacr-pos",
  title: "MangaKaCR POS & Inventory Platform",
  period: { en: "Dec 2025 – Present", es: "Dic. 2025 – actualidad" },
  role: {
    en: "Sole developer: architecture, backend, frontend, testing, CI/CD and production operations",
    es: "Desarrollador único: arquitectura, backend, frontend, pruebas, CI/CD y operación en producción",
  },
  summary: {
    en: "The point-of-sale, inventory and back-office platform that runs MangaKaCR, a manga bookstore in San José. I designed and built every part of it on my own.",
    es: "La plataforma de punto de venta, inventario y administración con la que opera MangaKaCR, una librería de manga en San José. La diseñé y construí por completo yo solo.",
  },
  stack: [
    "C# / .NET 9",
    "ASP.NET Core Minimal APIs",
    "Blazor Server",
    "MudBlazor",
    "EF Core",
    "PostgreSQL (Neon)",
    "Kiota",
    "QuestPDF",
    "Cloudflare R2 + Workers",
    "Resend",
    "Google Drive API",
    "xUnit",
    "Testcontainers",
    "GitHub Actions",
    "Docker",
    "CodeQL",
    "SonarQube",
  ],
  cover: { src: "/photos/me/bookstore.jpg", width: 1800, height: 1350 },
  stats: [
    { value: "916", label: { en: "automated tests", es: "pruebas automatizadas" } },
    { value: "28", label: { en: "app screens", es: "pantallas" } },
    { value: "10", label: { en: "business modules", es: "módulos de negocio" } },
  ],
  overview: [
    {
      en: "MangaKaCR is an independent manga bookstore in San José. It used to run its counter sales and invoicing on a legacy system; I replaced it with a platform built from scratch around how the store actually works: counter sales with several payment methods, layaways, cash-register shifts, bulk restocks, client cashback, back-in-stock alerts and a printable catalog that updates itself every day.",
      es: "MangaKaCR es una librería independiente de manga en San José. Antes manejaba sus ventas e inventario en un sistema heredado; lo reemplacé con una plataforma hecha desde cero alrededor de cómo trabaja realmente la tienda: ventas en mostrador con varios métodos de pago, apartados, turnos de caja, reabastecimientos masivos, cashback para clientes, avisos de reabastecimiento y un catálogo imprimible que se actualiza solo todos los días.",
    },
    {
      en: "**I was the only person on the project.** I designed the architecture and domain model, wrote the API, the admin web app, the PDFs and emails, the 916 automated tests and the CI/CD pipelines, migrated the infrastructure mid-project, and I deploy and support it in production. The store let me publish it here.",
      es: "**Fui la única persona en el proyecto.** Diseñé la arquitectura y el modelo de dominio, escribí la API, la aplicación web de administración, los PDF y correos, las 916 pruebas automatizadas y los pipelines de CI/CD, migré la infraestructura a mitad del proyecto y lo despliego y le doy soporte en producción. La tienda me permitió publicarlo aquí.",
    },
  ],
  sections: [
    {
      title: { en: "Architecture", es: "Arquitectura" },
      paragraphs: [
        {
          en: "The system is two .NET 9 applications, each split into clean-architecture layers (Domain → Application → Infrastructure → Presentation, plus a composition project for dependency injection):",
          es: "El sistema son dos aplicaciones .NET 9, cada una dividida en capas de arquitectura limpia (Dominio → Aplicación → Infraestructura → Presentación, más un proyecto de composición para la inyección de dependencias):",
        },
      ],
      bullets: [
        {
          en: "**Mangaka.Api**: an ASP.NET Core Minimal API with 20 endpoint groups, JWT authentication, an administrator-only policy, global ProblemDetails error handling and two background services.",
          es: "**Mangaka.Api**: una Minimal API de ASP.NET Core con 20 grupos de endpoints, autenticación JWT, una política solo para administradores, manejo global de errores con ProblemDetails y dos servicios en segundo plano.",
        },
        {
          en: "**Mangaka.Invoicing**: the staff-facing Blazor Server app (MudBlazor + ApexCharts) with 28 screens and ~100 Razor components. It talks to the API through a typed client generated with **Microsoft Kiota** from the API's OpenAPI document, so a contract change breaks the build instead of production.",
          es: "**Mangaka.Invoicing**: la aplicación Blazor Server para el personal (MudBlazor + ApexCharts) con 28 pantallas y ~100 componentes Razor. Se comunica con la API mediante un cliente tipado generado con **Microsoft Kiota** a partir del documento OpenAPI, así que un cambio de contrato rompe la compilación en lugar de producción.",
        },
        {
          en: "A rich domain model: entities and self-validating value objects (Price, Cost, CABYS code, cédula, email, phone, storage location…) with domain exceptions translated to HTTP responses at the edge.",
          es: "Un modelo de dominio rico: entidades y objetos de valor que se validan a sí mismos (precio, costo, código CABYS, cédula, correo, teléfono, ubicación de bodega…) con excepciones de dominio traducidas a respuestas HTTP en el borde.",
        },
        {
          en: "PostgreSQL with 34 EF Core migrations, product images in Cloudflare R2, transactional email through Resend, documents with QuestPDF, a daily Google Drive sync and lookups against Costa Rica's Hacienda API.",
          es: "PostgreSQL con 34 migraciones de EF Core, imágenes de productos en Cloudflare R2, correos transaccionales con Resend, documentos con QuestPDF, una sincronización diaria con Google Drive y consultas a la API de Hacienda.",
        },
      ],
    },
    {
      title: { en: "Point of sale", es: "Punto de venta" },
      bullets: [
        {
          en: "A multi-tab POS: each vendor's open draft invoices come back as tabs, scoped to whoever is signed in (I fixed a bug where carts could leak between vendors).",
          es: "Un POS con varias pestañas: los borradores abiertos de cada vendedor se restauran como pestañas, limitados a quien inició sesión (corregí un error en el que los carritos podían filtrarse entre vendedores).",
        },
        {
          en: "Sales to a walk-in client or a registered one. Typing a cédula fetches the registered name from **Hacienda's public API**, cached for an hour (including not-found results) to avoid hammering the service.",
          es: "Ventas a cliente de contado o registrado. Al digitar una cédula se obtiene el nombre registrado desde la **API pública de Hacienda**, con caché de una hora (incluidos los no encontrados) para no saturar el servicio.",
        },
        {
          en: "Six payment methods (cash with change, card, bank transfer, SINPE Móvil, CompraClick) plus **combined payments** split across methods, per-line price overrides and time-limited offers by amount or percentage.",
          es: "Seis métodos de pago (efectivo con vuelto, tarjeta, transferencia, SINPE Móvil, CompraClick) más **pagos combinados** entre métodos, precios ajustables por línea y ofertas por monto o porcentaje.",
        },
        {
          en: "Emitting an invoice decrements stock and assigns its consecutive number, continuing the legacy system's numbering through a dedicated migration so the store's sequence never broke.",
          es: "Emitir una factura rebaja el inventario y asigna su consecutivo, continuando la numeración del sistema heredado mediante una migración dedicada para que la secuencia de la tienda nunca se rompiera.",
        },
        {
          en: "Voids within a 24-hour window, administrators only: stock is restored, quantity-limited offers are credited back and an audit entry is recorded.",
          es: "Anulaciones dentro de una ventana de 24 horas, solo para administradores: se devuelve el inventario, se reintegran las ofertas con cupo limitado y se registra en la bitácora.",
        },
        {
          en: "80 mm POS tickets and A4 receipts generated with QuestPDF, receipts emailed to the client, and a combined A4 PDF export of many receipts at once.",
          es: "Tiquetes de 80 mm y recibos A4 generados con QuestPDF, envío del recibo por correo al cliente y exportación de muchos recibos a un solo PDF A4.",
        },
        {
          en: "**Client cashback**: 10% accrues on each sale, the whole balance can be redeemed (capped at the total), it's reversed on voids, and the cashier can opt a sale out. Layaway payoffs deliberately don't earn it.",
          es: "**Cashback para clientes**: cada venta acumula un 10%, el saldo completo se puede redimir (con tope en el total), se revierte al anular y el cajero puede excluir una venta. Los pagos finales de apartados no acumulan, a propósito.",
        },
      ],
    },
    {
      title: { en: "Getting concurrency right", es: "Concurrencia sin errores" },
      paragraphs: [
        {
          en: "The trickiest bug I tracked down: to keep the cart responsive, the POS sends one request per product in parallel when it flushes a burst of edits. Each request loaded the invoice, changed its own line and wrote back totals computed from whatever lines it had seen. That is a classic lost update: a live 9-line cart emitted with the total of only 2 lines, even though all 9 lines were saved.",
          es: "El error más difícil que rastreé: para que el carrito responda rápido, el POS envía una petición por producto en paralelo al guardar varios cambios. Cada petición cargaba la factura, cambiaba su propia línea y escribía totales calculados con las líneas que alcanzó a ver. Es una actualización perdida clásica: un carrito real de 9 líneas se emitió con el total de solo 2, aunque las 9 líneas sí se guardaron.",
        },
        {
          en: "I fixed it with a **PostgreSQL transaction-scoped advisory lock keyed on the invoice number**, taken before the invoice is even read. Edits to the same invoice are serialized, different invoices still run in parallel, and the lock releases itself on commit or rollback.",
          es: "Lo resolví con un **advisory lock de PostgreSQL con alcance de transacción, indexado por el número de factura**, que se toma antes siquiera de leer la factura. Los cambios a una misma factura se serializan, las facturas distintas siguen en paralelo y el bloqueo se libera solo al confirmar o revertir.",
        },
      ],
      bullets: [
        {
          en: "Other races I fixed: product quantity and storage-location updates, a search box that dropped keystrokes while a page was loading, and infinite scroll returning duplicate or missing rows under concurrent edits.",
          es: "Otras condiciones de carrera que corregí: actualizaciones de cantidad y ubicación de productos, un buscador que perdía teclas mientras cargaba una página y el scroll infinito devolviendo filas duplicadas o faltantes con ediciones concurrentes.",
        },
        {
          en: "**Live sync across open tabs**: an in-process pub/sub over Blazor Server's circuits pushes stock, price, location and offer changes to every open tab without reloading. An edit page shows a notice instead of overwriting what you're typing.",
          es: "**Sincronización en vivo entre pestañas**: un pub/sub en proceso sobre los circuitos de Blazor Server envía los cambios de inventario, precio, ubicación y ofertas a todas las pestañas abiertas sin recargar. Una página de edición muestra un aviso en lugar de sobrescribir lo que estás escribiendo.",
        },
      ],
    },
    {
      title: { en: "Layaways and cash-register shifts", es: "Apartados y turnos de caja" },
      bullets: [
        {
          en: "**Apartados (layaways)** reserve stock and lock each line's price at creation, collect an initial payment and later partial payments, enforce an expiration at least 30 days out, return stock if cancelled and finally convert into a full invoice, with their own tickets and receipts.",
          es: "**Apartados**: reservan inventario y congelan el precio de cada línea al crearse, cobran un aporte inicial y abonos posteriores, exigen un vencimiento de al menos 30 días, devuelven el inventario si se cancelan y al final se convierten en una factura completa, con sus propios tiquetes y recibos.",
        },
        {
          en: "**Turnos (shifts)** open with a starting cash amount, log manual cash-in movements and close with the counted cash and observations. Anything that collects money is blocked while no shift is open.",
          es: "**Turnos**: se abren con un monto inicial, registran entradas manuales de efectivo y se cierran con el efectivo contado y observaciones. Cualquier operación que cobre dinero se bloquea si no hay un turno abierto.",
        },
        {
          en: "Shift reports reconcile sales and layaway payments per period, covered by integration tests against a real database.",
          es: "Los reportes de turnos concilian ventas y abonos de apartados por período, cubiertos por pruebas de integración contra una base de datos real.",
        },
      ],
    },
    {
      title: { en: "Inventory and catalog", es: "Inventario y catálogo" },
      bullets: [
        {
          en: "Products with validated CABYS tax codes, authors, categories, collections (with alternate names), publishers, demographics, types, storage location, visibility and image uploads to Cloudflare R2 with a crop-and-manage UI.",
          es: "Productos con códigos CABYS validados, autores, categorías, colecciones (con nombres alternativos), editoriales, demografías, tipos, ubicación en bodega, visibilidad y carga de imágenes a Cloudflare R2 con recorte y administración.",
        },
        {
          en: "Search ranked by match quality, filters, sorting and infinite scroll, plus bulk delete, price and visibility actions and one-click product duplication.",
          es: "Búsqueda ordenada por calidad de coincidencia, filtros, ordenamiento y scroll infinito, además de acciones masivas de borrado, precio y visibilidad y duplicación de productos con un clic.",
        },
        {
          en: "**Bulk restock drafts**: a restock can be saved and resumed. Applying it updates every product's stock and location, writes one audit entry per change and freezes its report.",
          es: "**Borradores de reabastecimiento masivo**: un reabastecimiento se puede guardar y retomar. Al aplicarlo actualiza el inventario y la ubicación de cada producto, escribe una entrada de bitácora por cambio y congela su reporte.",
        },
        {
          en: "**“Avisar cuando llegue”**: clients can watch sold-out products. Only a genuine out-of-stock to in-stock transition queues them, and a background service bundles everything that came back for a client into a single email after a one-hour window.",
          es: "**“Avisar cuando llegue”**: los clientes pueden seguir productos agotados. Solo una transición real de agotado a disponible los pone en cola, y un servicio en segundo plano agrupa todo lo que volvió para cada cliente en un solo correo tras una ventana de una hora.",
        },
        {
          en: "A background service renders the full **Product List PDF** every morning and overwrites a fixed Google Drive file, so the link the store shares with customers never changes.",
          es: "Un servicio en segundo plano genera cada mañana el **PDF de la lista de productos** y sobrescribe un archivo fijo en Google Drive, así el enlace que la tienda comparte con sus clientes nunca cambia.",
        },
      ],
    },
    {
      title: { en: "Analytics, administration and auditing", es: "Analítica, administración y bitácoras" },
      bullets: [
        {
          en: "Sales analytics with KPIs, top-10 breakdowns by author, collection, category, publisher, demographic, product, client and vendor, daily/weekly/monthly trends and previous-period or year-over-year comparisons, all in Costa Rica time.",
          es: "Analítica de ventas con KPIs, top 10 por autor, colección, categoría, editorial, demografía, producto, cliente y vendedor, tendencias diarias, semanales o mensuales y comparación con el período anterior o año contra año, todo en hora de Costa Rica.",
        },
        {
          en: "Sign-in through Neon Auth. The first sign-in creates an **access request** that an administrator approves (assigning a role) or rejects. Administrators can't change their own role or status.",
          es: "Inicio de sesión con Neon Auth. El primer ingreso crea una **solicitud de acceso** que un administrador aprueba (asignando un rol) o rechaza. Los administradores no pueden cambiar su propio rol ni estado.",
        },
        {
          en: "Searchable audit trails for products (with field-level change detail), clients, sales and invoices, plus company settings (tax regime, economic activity, terms and notes) that print on every receipt.",
          es: "Bitácoras con búsqueda para productos (con detalle por campo), clientes, ofertas y facturas, y la configuración de la empresa (régimen tributario, actividad económica, términos y notas) que se imprime en cada recibo.",
        },
      ],
    },
    {
      title: { en: "Quality, delivery and operations", es: "Calidad, entrega y operación" },
      bullets: [
        {
          en: "**916 automated tests** across five projects: domain, application (Moq), infrastructure, presentation, and 87 integration tests that run against a real PostgreSQL in **Testcontainers** for the risky paths (cashback, layaway payoffs, shift reconciliation, cascade deletes).",
          es: "**916 pruebas automatizadas** en cinco proyectos: dominio, aplicación (Moq), infraestructura, presentación y 87 pruebas de integración contra un PostgreSQL real en **Testcontainers** para los caminos delicados (cashback, liquidación de apartados, conciliación de turnos, borrados en cascada).",
        },
        {
          en: "GitHub Actions for build and test, **CodeQL** analysis, and Docker images for both apps pushed to GHCR on every merge to main, built on a self-hosted Docker runner I set up. Local **SonarQube** analysis with coverage.",
          es: "GitHub Actions para compilar y probar, análisis con **CodeQL** e imágenes Docker de ambas aplicaciones publicadas en GHCR en cada merge a main, construidas en un runner Docker propio que configuré. Análisis local con **SonarQube** y cobertura.",
        },
        {
          en: "Mid-project I migrated images from Supabase Storage to Cloudflare R2 and auth and database to Neon, bridging Neon's EdDSA-signed JWTs into .NET's token validation.",
          es: "A mitad del proyecto migré las imágenes de Supabase Storage a Cloudflare R2 y la autenticación y la base de datos a Neon, haciendo que la validación de tokens de .NET aceptara los JWT firmados con EdDSA de Neon.",
        },
        {
          en: "Because the store's .cr registrar can't delegate DNS to Cloudflare, I serve the R2 images through a **Cloudflare Worker** with edge caching instead of a custom domain.",
          es: "Como el registrador .cr de la tienda no permite delegar el DNS a Cloudflare, sirvo las imágenes de R2 mediante un **Cloudflare Worker** con caché en el borde en lugar de un dominio propio.",
        },
        {
          en: "A Git flow with feature branches, versioned releases promoted from development to main, and a published import schema for bulk-loading products crawled from the store's online shop. Next up: connecting the e-commerce storefront through a backend-for-frontend.",
          es: "Un flujo de Git con ramas por funcionalidad, versiones publicadas de development a main y un esquema documentado para importar masivamente los productos de la tienda en línea. Lo siguiente: conectar la tienda en línea mediante un backend-for-frontend.",
        },
      ],
    },
  ],
};

const lasce: Project = {
  slug: "lasce-lab-platform",
  title: "LASCE Research Lab Platform",
  period: { en: "Aug 2026 – Present", es: "Ago. 2026 – actualidad" },
  role: {
    en: "Full-stack developer on team g02 (publications, in-place CMS, news, admin dashboard)",
    es: "Desarrollador full-stack del equipo g02 (publicaciones, CMS en sitio, noticias, panel de administración)",
  },
  summary: {
    en: "The web platform for UCR's Space Weather Lab. I built its research publications, the in-place CMS and the news management.",
    es: "La plataforma web del Laboratorio de Clima Espacial de la UCR. Construí sus publicaciones de investigación, el CMS en sitio y la gestión de noticias.",
  },
  stack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "SQLAlchemy", "Vitest", "Storybook", "Playwright", "MinIO", "Turborepo"],
  links: { repo: "https://github.com/LasceUCR/lasce" },
  stats: [
    { value: "20+", label: { en: "tested components", es: "componentes con pruebas" } },
  ],
  overview: [
    {
      en: "LASCE is the platform for the Universidad de Costa Rica's Space Weather Lab: a pnpm + Turborepo monorepo with a Next.js app (UI and API) and a Python worker sharing a BullMQ queue, backed by PostgreSQL, Redis, InfluxDB and MinIO. Several student teams build it together; I work on team g02.",
      es: "LASCE es la plataforma del Laboratorio de Clima Espacial de la Universidad de Costa Rica: un monorepo con pnpm y Turborepo con una aplicación Next.js (interfaz y API) y un worker en Python que comparten una cola BullMQ, sobre PostgreSQL, Redis, InfluxDB y MinIO. Varios equipos de estudiantes la construyen juntos; yo trabajo en el equipo g02.",
    },
  ],
  sections: [
    {
      title: { en: "Research publications", es: "Publicaciones de investigación" },
      bullets: [
        {
          en: "Designed a dedicated **research** PostgreSQL schema in Prisma (publishers, research records, authors and an ordered author join for citation order) with unique DOIs and source URLs and a date index, plus its migration and seed data.",
          es: "Diseñé un esquema **research** dedicado en PostgreSQL con Prisma (editoriales, registros de investigación, autores y una tabla intermedia ordenada para el orden de citación), con DOI y URL de origen únicos e índice por fecha, además de su migración y datos semilla.",
        },
        {
          en: "Mirrored the schema in SQLAlchemy for the Python worker and wrote a test that asserts the mirror matches Prisma's tables, columns and foreign keys, so the two runtimes can't drift apart.",
          es: "Repliqué el esquema en SQLAlchemy para el worker en Python y escribí una prueba que verifica que coincide con las tablas, columnas y llaves foráneas de Prisma, para que ambos entornos no se desincronicen.",
        },
        {
          en: "Replaced the page's mock data with a Server Component that reads from Postgres, built the PublicationsExplorer and PublicationCard components, and documented the schema.",
          es: "Reemplacé los datos de prueba de la página por un Server Component que lee de Postgres, construí los componentes PublicationsExplorer y PublicationCard y documenté el esquema.",
        },
      ],
    },
    {
      title: { en: "A reusable in-place CMS", es: "Un CMS en sitio reutilizable" },
      bullets: [
        {
          en: "An edit mode that admins toggle from the admin shell (shared through a provider), a wrapper that adds edit and delete actions to any piece of content, and an add-item card, so pages are edited where they're read.",
          es: "Un modo de edición que los administradores activan desde el panel (compartido mediante un provider), un envoltorio que agrega acciones de editar y eliminar a cualquier contenido y una tarjeta para agregar elementos, para editar las páginas donde se leen.",
        },
        {
          en: "A shared UI kit: modal (three sizes), confirm dialog, labelled form field, file drop input, icon button, toggle and a danger button variant, each with Storybook stories and Vitest tests.",
          es: "Un kit de interfaz compartido: modal (tres tamaños), diálogo de confirmación, campo de formulario con etiqueta, zona para soltar archivos, botón de ícono, interruptor y una variante de botón de peligro, cada uno con historias de Storybook y pruebas con Vitest.",
        },
        {
          en: "Wrote the guide other teams follow to make their own features CMS-editable.",
          es: "Escribí la guía que siguen los demás equipos para hacer editables sus propias funcionalidades.",
        },
      ],
    },
    {
      title: { en: "News management", es: "Gestión de noticias" },
      bullets: [
        {
          en: "Article form, editable news cards and a news explorer that persists through the API instead of local state.",
          es: "Formulario de artículos, tarjetas de noticias editables y un explorador de noticias que persiste mediante la API en lugar de estado local.",
        },
        {
          en: "Permission-gated REST routes (**POST /api/news**, **PATCH** and **DELETE /api/news/[id]**), with each create, edit and delete control in the UI gated by its own grant.",
          es: "Rutas REST protegidas por permisos (**POST /api/news**, **PATCH** y **DELETE /api/news/[id]**), con cada control de crear, editar y eliminar en la interfaz habilitado según su propio permiso.",
        },
        {
          en: "Tests for the routes, the data functions and every component, plus a generic validator shared by the forms.",
          es: "Pruebas para las rutas, las funciones de datos y cada componente, además de un validador genérico compartido por los formularios.",
        },
      ],
    },
    {
      title: { en: "Admin dashboard and uploads", es: "Panel de administración y archivos" },
      bullets: [
        {
          en: "Built the first version of the admin dashboard (shell, sidebar, stat cards, status pills and summary page) with a Playwright end-to-end spec.",
          es: "Construí la primera versión del panel de administración (estructura, barra lateral, tarjetas de estadísticas, indicadores de estado y página de resumen) con una prueba end-to-end en Playwright.",
        },
        {
          en: "Fixed uploaded images not loading on staging, restricted the accepted file types for uploads to MinIO, and documented the build arguments the deployment needs.",
          es: "Corregí que las imágenes subidas no cargaran en staging, restringí los tipos de archivo aceptados al subir a MinIO y documenté los argumentos de compilación que necesita el despliegue.",
        },
      ],
    },
  ],
};

const microscope: Project = {
  slug: "virtual-microscope",
  title: "Virtual Microscope Admin Panel",
  period: { en: "Jun 2026 – Jul 2026", es: "Jun. 2026 – jul. 2026" },
  role: {
    en: "Developer on a 3-person team: persistence, the entire frontend and desktop packaging",
    es: "Desarrollador en un equipo de 3: persistencia, todo el frontend y el empaquetado de escritorio",
  },
  summary: {
    en: "An admin panel for a biology virtual microscope, shipped as a one-click Windows app with its own embedded database.",
    es: "Un panel de administración para un microscopio virtual de biología, distribuido como aplicación de Windows con su propia base de datos embebida.",
  },
  stack: ["C# / .NET", "Blazor WebAssembly", "MudBlazor", "EF Core", "PostgreSQL", "Electron", "Docker"],
  stats: [],
  overview: [
    {
      en: "The panel manages the slide collection of a virtual microscope at UCR: slides grouped by biological group (e.g. bacteria) and storage box, each with an ordered set of microscope images. A teammate had started the API with in-memory repositories; I built most of what turned it into a usable product.",
      es: "El panel administra la colección de láminas de un microscopio virtual de la UCR: láminas agrupadas por grupo biológico (p. ej. bacterias) y caja, cada una con un conjunto ordenado de imágenes. Un compañero había iniciado la API con repositorios en memoria; yo construí la mayor parte de lo que la convirtió en un producto usable.",
    },
  ],
  sections: [
    {
      title: { en: "Persistence", es: "Persistencia" },
      bullets: [
        {
          en: "Replaced the in-memory repositories with EF Core over PostgreSQL: a DbContext with Fluent API configurations for boxes, groups, slides and images, value-object conversions, the initial migration and dependency injection wiring.",
          es: "Reemplacé los repositorios en memoria por EF Core sobre PostgreSQL: un DbContext con configuraciones Fluent API para cajas, grupos, láminas e imágenes, conversiones de objetos de valor, la migración inicial y la inyección de dependencias.",
        },
        {
          en: "A Docker Compose database pinned to Postgres 17 (to match the desktop build), bound to localhost and with a health check.",
          es: "Una base de datos con Docker Compose fijada a Postgres 17 (igual que la versión de escritorio), accesible solo desde localhost y con health check.",
        },
      ],
    },
    {
      title: { en: "The whole frontend", es: "Todo el frontend" },
      bullets: [
        {
          en: "Built the Blazor WebAssembly frontend in clean architecture: a domain with its own value objects, application services, a typed HTTP API client and a MudBlazor UI with UCR's visual identity and an in-app usage guide.",
          es: "Construí el frontend en Blazor WebAssembly con arquitectura limpia: un dominio con sus propios objetos de valor, servicios de aplicación, un cliente HTTP tipado y una interfaz MudBlazor con la identidad visual de la UCR y una guía de uso integrada.",
        },
        {
          en: "**Server-side pagination and search** for slides: the endpoint returns a paged envelope with validated page sizes, and the table loads pages from the server with a debounced search and box filter instead of downloading everything.",
          es: "**Paginación y búsqueda del lado del servidor** para las láminas: el endpoint devuelve una respuesta paginada con tamaños validados, y la tabla carga páginas desde el servidor con búsqueda y filtro por caja con debounce en lugar de descargar todo.",
        },
        {
          en: "Fixed a bug where creating a slide with **6 images always failed**: once the sixth image was picked, the upload input unmounted and the browser invalidated every earlier file handle. Files are now read as soon as they're selected, which also enabled multi-select. Image order now follows list position, which removed duplicate orders.",
          es: "Corregí un error en el que crear una lámina con **6 imágenes siempre fallaba**: al elegir la sexta imagen, el campo de carga se desmontaba y el navegador invalidaba todos los archivos anteriores. Ahora los archivos se leen apenas se seleccionan, lo que además permitió la selección múltiple. El orden de las imágenes sigue su posición en la lista, lo que eliminó órdenes duplicados.",
        },
      ],
    },
    {
      title: { en: "One-click desktop app", es: "Aplicación de escritorio en un clic" },
      bullets: [
        {
          en: "Packaged everything as a **Windows installer**: an Electron shell starts an embedded Postgres 17 and the published API, waits for its health endpoint, then opens the app in a native window. **No Docker or database install needed.**",
          es: "Empaqueté todo como un **instalador de Windows**: un shell de Electron inicia un Postgres 17 embebido y la API publicada, espera su endpoint de salud y abre la aplicación en una ventana nativa. **No requiere Docker ni instalar una base de datos.**",
        },
        {
          en: "The API serves the WebAssembly app with client-side routing fallback and applies migrations on startup with retries for a slow first database boot. A PowerShell script publishes both apps and drives electron-builder.",
          es: "La API sirve la aplicación WebAssembly con respaldo para el enrutamiento del cliente y aplica las migraciones al iniciar con reintentos por si la base tarda en arrancar. Un script de PowerShell publica ambas aplicaciones y ejecuta electron-builder.",
        },
      ],
    },
  ],
};

const themePark: Project = {
  slug: "themepark-ucr",
  title: "ThemePark@UCR",
  period: { en: "Aug 2025 – Dec 2025", es: "Ago. 2025 – dic. 2025" },
  role: {
    en: "Scrum Master of team “Ingeniería del Pozole”; owner of authentication and authorization",
    es: "Scrum Master del equipo “Ingeniería del Pozole”; responsable de autenticación y autorización",
  },
  summary: {
    en: "A Web VR portal built by the whole course. I led my team as Scrum Master and built sign-in and the permission system for the entire platform.",
    es: "Un portal Web VR construido por todo el curso. Lideré a mi equipo como Scrum Master y construí el inicio de sesión y el sistema de permisos de toda la plataforma.",
  },
  stack: ["C# / .NET", "Blazor", "Microsoft Entra ID", "SQL Server", "Kiota", "xUnit", "SonarQube"],
  stats: [],
  overview: [
    {
      en: "ThemePark@UCR is a Web VR portal that lets people explore the university through immersive tours, built by several teams in the Software Engineering and Databases integration course. Besides being Scrum Master of my team, I sat on the Project Management and Gitflow committees and owned **authentication and authorization across the whole platform**.",
      es: "ThemePark@UCR es un portal Web VR para explorar la universidad mediante recorridos inmersivos, construido por varios equipos del proyecto integrador de Ingeniería de Software y Bases de Datos. Además de ser Scrum Master de mi equipo, formé parte de los comités de Gestión del Proyecto y Gitflow y fui responsable de la **autenticación y autorización de toda la plataforma**.",
    },
  ],
  sections: [
    {
      title: { en: "Sign-in with Microsoft Entra ID", es: "Inicio de sesión con Microsoft Entra ID" },
      bullets: [
        {
          en: "Implemented sign-in and registration with Entra ID in the Blazor frontend and the API, creating each user from their token claims the first time they're validated and linking them to their Entra object ID.",
          es: "Implementé el inicio de sesión y el registro con Entra ID en el frontend Blazor y en la API, creando a cada usuario a partir de los claims de su token la primera vez que se valida y enlazándolo con su identificador de Entra.",
        },
        {
          en: "New accounts get a Guest role automatically. Tokens travel as Bearer headers, there's an endpoint to validate them, and Swagger works independently of whether Entra is configured.",
          es: "Las cuentas nuevas reciben automáticamente el rol de invitado. Los tokens viajan como encabezado Bearer, hay un endpoint para validarlos y Swagger funciona independientemente de si Entra está configurado.",
        },
      ],
    },
    {
      title: { en: "A platform-wide permission system", es: "Un sistema de permisos para toda la plataforma" },
      bullets: [
        {
          en: "Permissions are registered as authorization policies, and a permission-injector service adds each user's permissions to their identity as claims at sign-in.",
          es: "Los permisos se registran como políticas de autorización, y un servicio inyecta los permisos de cada usuario en su identidad como claims al iniciar sesión.",
        },
        {
          en: "Protected every backend endpoint (leaving anonymous only what needed to be), seeded the default roles and permissions, and exposed the current user's permissions to the frontend.",
          es: "Protegí todos los endpoints del backend (dejando anónimos solo los necesarios), sembré los roles y permisos por defecto y expuse al frontend los permisos del usuario actual.",
        },
        {
          en: "On the frontend: every page is protected, and a **PermissionGuard** component hides navigation and the add, edit and delete actions for buildings, learning spaces and interactive components according to the user's permissions.",
          es: "En el frontend: todas las páginas están protegidas, y un componente **PermissionGuard** oculta la navegación y las acciones de agregar, editar y eliminar edificios, espacios de aprendizaje y componentes interactivos según los permisos del usuario.",
        },
        {
          en: "User management screens (add users, assign roles) with on-blur validation and clear error messages.",
          es: "Pantallas de gestión de usuarios (agregar usuarios, asignar roles) con validación al salir del campo y mensajes de error claros.",
        },
      ],
    },
    {
      title: { en: "Quality and delivery", es: "Calidad y entrega" },
      bullets: [
        {
          en: "Unit tests for endpoint authorization and for the user and permission services across the backend and frontend layers.",
          es: "Pruebas unitarias de la autorización de endpoints y de los servicios de usuarios y permisos en las capas del backend y del frontend.",
        },
        {
          en: "Moved the OpenAPI setup into the presentation layer, kept the Kiota-generated client in sync, flagged the test projects for SonarQube, and set up the deployment configuration with per-environment API URLs.",
          es: "Moví la configuración de OpenAPI a la capa de presentación, mantuve sincronizado el cliente generado con Kiota, marqué los proyectos de prueba para SonarQube y preparé la configuración de despliegue con URLs de la API por ambiente.",
        },
        {
          en: "Wrote parts of the project documentation, including team structure and the user data requirements.",
          es: "Escribí partes de la documentación del proyecto, incluida la estructura de equipos y los requerimientos de datos de los usuarios.",
        },
      ],
    },
  ],
};

const asciiNetwork: Project = {
  slug: "ascii-art-network",
  title: "Distributed ASCII-Art Network",
  period: { en: "Mar 2025 – Jul 2025", es: "Mar. 2025 – jul. 2025" },
  role: {
    en: "Developer on a 4-person team: fork server, threaded simulation and the team's switch configuration",
    es: "Desarrollador en un equipo de 4: servidor tenedor, simulación con hilos y la configuración de switches del equipo",
  },
  summary: {
    en: "C++ servers, clients and intermediary “fork” servers that cooperate over a real switched network to serve ASCII-art drawings.",
    es: "Servidores, clientes y servidores intermediarios (“tenedores”) en C++ que cooperan sobre una red física con switches para servir dibujos en arte ASCII.",
  },
  stack: ["C++", "POSIX sockets", "Threads", "HTTP", "UDP", "L2/L3 switching"],
  stats: [],
  overview: [
    {
      en: "The networks and operating systems capstone: build a service that several servers on different machines can answer redundantly. Drawing servers store ASCII-art figures in a custom file system, fork servers route clients to them, and every team's implementation has to interoperate over the course's shared protocol and physical network.",
      es: "El proyecto integrador de Redes y Sistemas Operativos: construir un servicio que varios servidores en distintas máquinas pueden atender de forma redundante. Los servidores de dibujos guardan figuras en arte ASCII en un sistema de archivos propio, los servidores tenedores dirigen a los clientes hacia ellos y la implementación de cada equipo debe interoperar con el protocolo común del curso sobre una red física.",
    },
  ],
  sections: [
    {
      title: { en: "Servers and forwarding", es: "Servidores y reenvío" },
      bullets: [
        {
          en: "Stage 1: implemented the server's request forwarding, a signal handler for clean shutdowns and the build setup, and wrote the design documentation.",
          es: "Etapa 1: implementé el reenvío de solicitudes del servidor, un manejador de señales para apagados limpios y la configuración de compilación, y escribí la documentación de diseño.",
        },
        {
          en: "Stage 2: implemented the **fork server** (the intermediary that receives client requests and hands them to drawing servers), with request handling and the server injected as a dependency.",
          es: "Etapa 2: implementé el **servidor tenedor** (el intermediario que recibe las solicitudes de los clientes y las pasa a los servidores de dibujos), con manejo de solicitudes y el servidor inyectado como dependencia.",
        },
      ],
    },
    {
      title: { en: "Threaded simulation", es: "Simulación con hilos" },
      bullets: [
        {
          en: "Designed a common base class so the server, fork server and client all run as threads inside one simulation, replacing the first stage's process and message-queue approach, and implemented the client and the instruction set.",
          es: "Diseñé una clase base común para que el servidor, el tenedor y el cliente corran como hilos dentro de una misma simulación, reemplazando el enfoque de procesos y colas de mensajes de la primera etapa, e implementé el cliente y el conjunto de instrucciones.",
        },
        {
          en: "Integrated the i-node file system that stores the drawings in a single binary disk file split into 256-byte blocks.",
          es: "Integré el sistema de archivos con i-nodos que guarda los dibujos en un único archivo binario dividido en bloques de 256 bytes.",
        },
      ],
    },
    {
      title: { en: "The physical network", es: "La red física" },
      bullets: [
        {
          en: "Configured our island's **L2 switch and multilayer (L3) switch**, first in Packet Tracer and then on the physical hardware in the lab.",
          es: "Configuré el **switch L2 y el switch multicapa (L3)** de nuestra isla, primero en Packet Tracer y luego en el equipo físico del laboratorio.",
        },
        {
          en: "Tested connectivity and requests against other teams' implementations using the inter-group UDP protocol (discovery, requests and responses), and documented the system with its functionality diagram and the final presentations.",
          es: "Probé la conectividad y las solicitudes con las implementaciones de otros equipos usando el protocolo UDP inter-grupal (descubrimiento, solicitudes y respuestas), y documenté el sistema con su diagrama de funcionamiento y las presentaciones finales.",
        },
      ],
    },
  ],
};

export const projects: Project[] = [mangakaPos, lasce, microscope, themePark, asciiNetwork];
