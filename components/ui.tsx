import type { ReactNode } from "react";
import { PerchBranch } from "./PerchBranch";

/** `**marked**` parts of a string are bold, with a gold highlighter stroke unless `highlight` is off. */
export function Rich({ text, highlight = true }: { text: string; highlight?: boolean }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <strong
            key={i}
            className={`font-semibold ${highlight ? "bg-[linear-gradient(transparent_58%,rgb(242_183_5/0.38)_58%)]" : ""}`}
          >
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}

/** A page section the macaws fly to; they land on the header. */
export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-perch-zone className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:py-32">
      <header data-perch-spot className="relative inline-block pt-6">
        <p className="text-xs font-semibold tracking-[0.25em] text-scarlet uppercase">{kicker}</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
        <PerchBranch />
      </header>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" fill="currentColor" />
      <circle cx="12" cy="9.8" r="2.4" fill="#fff" />
    </svg>
  );
}
