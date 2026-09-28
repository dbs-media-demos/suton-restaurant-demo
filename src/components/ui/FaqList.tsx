"use client";

import { useState } from "react";
import clsx from "clsx";

/** Accordion list; each answer expands with a grid-rows transition (keyboard friendly buttons). */
export function FaqList({ items, idPrefix = "faq" }: { items: { q: string; a: string }[]; idPrefix?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="t-serif text-[clamp(1.25rem,2vw,1.7rem)] leading-snug transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{f.q}</span>
                <span
                  className={clsx(
                    "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)]",
                    isOpen ? "rotate-45 bg-candle text-night" : "text-candle",
                  )}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`${idPrefix}-a-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-q-${i}`}
              className={clsx("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-cream/80">{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
