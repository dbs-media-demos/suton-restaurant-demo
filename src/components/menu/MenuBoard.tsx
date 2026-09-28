"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Flip, gsap, prefersReducedMotion } from "@/lib/gsap";
import { menu, dietLabels, dietShort, type Diet } from "@/content/menu";
import type { Locale } from "@/lib/i18n";
import { DishRows } from "./DishRows";

const DIETS: Diet[] = ["veg", "vegan", "gf", "spicy"];

/**
 * The full menu on paper: section tabs, dietary filters with animated (FLIP) filtering,
 * and the cursor-following dish photos.
 */
export function MenuBoard({ locale, labels }: { locale: Locale; labels: { filter: string; all: string; empty: string; count: string; jump: string } }) {
  const [active, setActive] = useState<Diet[]>([]);
  const board = useRef<HTMLDivElement>(null);

  const toggle = (d: Diet) => {
    const el = board.current;
    const state = el && !prefersReducedMotion() ? Flip.getState(el.querySelectorAll("[data-dish], [data-section]")) : null;
    setActive((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
    if (state) {
      requestAnimationFrame(() =>
        Flip.from(state, {
          duration: 0.8,
          ease: "expo.out",
          absolute: false,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.03 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
        }),
      );
    }
  };

  const match = (diet: Diet[]) => active.every((a) => diet.includes(a) || (a === "veg" && diet.includes("vegan")));
  const sections = menu.map((s) => ({ ...s, dishes: s.dishes.filter((d) => match(d.diet)) }));
  const total = sections.reduce((n, s) => n + s.dishes.length, 0);

  return (
    <div ref={board}>
      {/* Sticky controls */}
      <div className="sticky top-0 z-[20] -mx-[var(--gutter)] border-b border-line bg-paper/90 px-[var(--gutter)] py-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label={labels.jump} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {menu.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="t-serif shrink-0 rounded-full px-4 py-2 text-lg hover:bg-ink/5">
                {s.title[locale]}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={labels.filter}>
            <span className="t-eyebrow mr-1 text-muted">{labels.filter}</span>
            {DIETS.map((d) => {
              const on = active.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(d)}
                  className={clsx(
                    "flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
                    on ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink/60",
                  )}
                >
                  <span aria-hidden className="text-xs opacity-70">
                    {dietShort[d]}
                  </span>
                  {dietLabels[d][locale]}
                </button>
              );
            })}
            {active.length > 0 && (
              <button type="button" onClick={() => setActive([])} className="link-underline ml-2 h-10 text-sm text-accent">
                {labels.all}
              </button>
            )}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {labels.count.replace("{n}", String(total))}
        </p>
      </div>

      {total === 0 && <p className="t-h3 py-24 text-center text-muted">{labels.empty}</p>}

      {sections.map((s, i) =>
        s.dishes.length === 0 ? null : (
          <section key={s.id} id={s.id} data-section className="scroll-mt-28 pt-20" aria-labelledby={`${s.id}-t`}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 id={`${s.id}-t`} className="t-h2 flex items-baseline gap-5">
                <span className="t-eyebrow t-num text-accent">0{i + 1}</span>
                {s.title[locale]}
              </h2>
              <p className="t-serif text-lg italic text-muted">{s.note[locale]}</p>
            </div>
            <DishRows dishes={s.dishes} locale={locale} theme="paper" />
          </section>
        ),
      )}
    </div>
  );
}
