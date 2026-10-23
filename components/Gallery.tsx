"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const arrow =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 bg-white/80 text-lg transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30";

// The carousel arrows float over its edges, centred on the screenshots (above the captions).
const edgeArrow = `${arrow} absolute top-[calc(50%-1.75rem)] z-10 -translate-y-1/2 shadow-md backdrop-blur-sm disabled:opacity-0`;

/**
 * A scroll-snap carousel of screenshots. Clicking one opens it in a modal
 * dialog, large, with its description to the side; arrow keys page through.
 */
export function Gallery({ items, lang, t }: { items: GalleryImage[]; lang: Locale; t: Dictionary["project"] }) {
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(updateEdges, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const show = (i: number) => {
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length));

  // Lock the page behind the dialog while it's open.
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  // On close, bring the last viewed screenshot into the carousel and focus it.
  const onClose = () => {
    const slide = open === null ? null : slides.current[open];
    setOpen(null);
    slide?.focus({ preventScroll: true });
    slide?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };

  const current = open === null ? null : items[open];

  return (
    <>
      <div className="relative mt-6">
        <div
          ref={track}
          onScroll={updateEdges}
          className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <figure key={item.src} className="w-[80%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)]">
              <button
                ref={(el) => {
                  slides.current[i] = el;
                }}
                type="button"
                onClick={() => show(i)}
                aria-label={`${t.galleryOpen}: ${item.caption[lang]}`}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-white"
              >
                <Image
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt={item.caption[lang]}
                  sizes="(min-width: 640px) 420px, 80vw"
                  className="w-full transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
              <figcaption className="mt-2 font-hand text-lg text-muted">{item.caption[lang]}</figcaption>
            </figure>
          ))}
        </div>
        <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={t.galleryPrev} className={`${edgeArrow} left-2`}>
          ←
        </button>
        <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label={t.galleryNext} className={`${edgeArrow} right-2`}>
          →
        </button>
      </div>

      <dialog
        ref={dialog}
        onClose={onClose}
        // A click on the dimmed area around the panels (the dialog itself) closes it.
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          else if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={current?.caption[lang]}
        className="m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-4 backdrop:bg-ink/85 backdrop:backdrop-blur-sm sm:p-8"
      >
        {current && open !== null && (
          <div
            onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
            className="mx-auto flex h-full max-w-7xl flex-col gap-4 md:flex-row"
          >
            {/* A size container, so the screenshot can fit itself to the space left beside the panel. */}
            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center [container-type:size]">
              <Image
                key={current.src}
                src={current.src}
                width={current.width}
                height={current.height}
                alt={current.caption[lang]}
                sizes="(min-width: 768px) 75vw, 100vw"
                style={{ width: `min(100cqw, ${current.width / current.height} * 100cqh)` }}
                className="h-auto rounded-xl bg-white shadow-2xl"
              />
            </div>
            <aside className="flex shrink-0 flex-col rounded-xl bg-paper p-6 shadow-2xl md:w-80 md:self-center">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold tracking-[0.25em] text-scarlet uppercase">
                  {open + 1} / {items.length}
                </p>
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  aria-label={t.galleryClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none text-muted transition-colors hover:text-ink"
                >
                  ×
                </button>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">{current.caption[lang]}</h3>
              {current.description && <p className="mt-3 leading-relaxed text-muted">{current.description[lang]}</p>}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => step(-1)} aria-label={t.galleryPrev} className={arrow}>
                  ←
                </button>
                <button type="button" onClick={() => step(1)} aria-label={t.galleryNext} className={arrow}>
                  →
                </button>
              </div>
            </aside>
          </div>
        )}
      </dialog>
    </>
  );
}
