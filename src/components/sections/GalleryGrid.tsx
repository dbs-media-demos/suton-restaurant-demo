"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Flip } from "@/lib/flip";
import { gallery, galleryCats, type GalleryCat } from "@/content/gallery";
import { photos } from "@/content/photos";
import type { Locale } from "@/lib/i18n";

type Labels = { all: string; close: string; prev: string; next: string; view: string; filter: string };

/** Filterable masonry gallery with FLIP transitions and a keyboard-friendly lightbox. */
export function GalleryGrid({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [cat, setCat] = useState<GalleryCat | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const items = gallery.filter((g) => !cat || g.cat === cat);

  const pick = (c: GalleryCat | null) => {
    const el = grid.current;
    const state = el && !prefersReducedMotion() ? Flip.getState(el.children) : null;
    setCat(c);
    if (state)
      requestAnimationFrame(() =>
        Flip.from(state, {
          duration: 0.9,
          ease: "expo.out",
          absolute: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35 }),
        }),
      );
  };

  const show = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(i);
    dialog.current?.showModal();
    window.__lenis?.stop();
  };
  const close = useCallback(() => {
    dialog.current?.close();
  }, []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    const onClose = () => {
      setOpen(null);
      window.__lenis?.start();
      lastFocus.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("keydown", onKey);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div className="no-scrollbar -mx-1 mb-10 flex gap-2 overflow-x-auto px-1" role="group" aria-label={labels.filter}>
        {[null, ...(Object.keys(galleryCats) as GalleryCat[])].map((c) => {
          const on = cat === c;
          return (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c)}
              className={clsx(
                "h-11 shrink-0 rounded-full border px-5 text-sm transition-colors duration-300",
                on ? "border-candle bg-candle text-night" : "border-line text-cream/85 hover:border-cream/60",
              )}
            >
              {c ? galleryCats[c][locale] : labels.all}
            </button>
          );
        })}
      </div>

      <ul ref={grid} className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        {items.map((g, i) => {
          const p = photos[g.k];
          return (
            <li key={g.k} className="mb-3 break-inside-avoid md:mb-5">
              <button
                type="button"
                onClick={() => show(i)}
                className={clsx("group relative block w-full overflow-hidden bg-char", i % 5 === 0 ? "arch" : "rounded-2xl")}
                data-cursor={labels.view}
                aria-label={`${labels.view}: ${g.alt[locale]}`}
              >
                <Image
                  src={p.src}
                  alt={g.alt[locale]}
                  width={p.w}
                  height={p.h}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  quality={60}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <span className="t-eyebrow absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1.5 text-[0.65rem] text-cream opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                  {galleryCats[g.cat][locale]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        className="m-0 h-full max-h-none w-full max-w-none bg-night/95 p-0 text-cream backdrop:bg-night/80 open:flex open:flex-col"
        aria-label={current?.alt[locale]}
        onClick={(e) => e.target === dialog.current && close()}
      >
        {current && (
          <>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="t-eyebrow t-num text-smoke">
                {String((open ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {galleryCats[current.cat][locale]}
              </p>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-cream" aria-label={labels.close}>
                ✕
              </button>
            </div>
            <div className="relative flex-1">
              <Image key={current.k} src={photos[current.k].src} alt={current.alt[locale]} fill sizes="100vw" quality={85} className="anim-fade object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <button type="button" onClick={() => step(-1)} className="h-11 rounded-full border border-line px-5 hover:border-cream">
                ← {labels.prev}
              </button>
              <p className="hidden text-center text-sm text-cream/80 sm:block">{current.alt[locale]}</p>
              <button type="button" onClick={() => step(1)} className="h-11 rounded-full border border-line px-5 hover:border-cream">
                {labels.next} →
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
