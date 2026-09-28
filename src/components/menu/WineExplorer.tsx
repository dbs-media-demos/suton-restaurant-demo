"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Flip } from "@/lib/flip";
import { regions, wines, colorLabels, type RegionId, type WineColor } from "@/content/wines";
import { formatRsd } from "@/content/menu";
import type { Locale } from "@/lib/i18n";
import { RiverMap } from "./RiverMap";

const COLORS: WineColor[] = ["white", "orange", "rose", "red", "sweet"];
const swatch: Record<WineColor, string> = {
  white: "#e9dca0",
  orange: "#e0913f",
  rose: "#e59aa0",
  red: "#8c2a37",
  sweet: "#b8742a",
};

type Labels = { list: string; all: string; region: string; color: string; glass: string; bottle: string; count: string; home: string; mapLabel: string; allRegions: string };

/** Wine list filterable by region (on a river map) and by colour, animated with FLIP. */
export function WineExplorer({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [region, setRegion] = useState<RegionId | null>(null);
  const [color, setColor] = useState<WineColor | null>(null);
  const list = useRef<HTMLUListElement>(null);

  const animate = (fn: () => void) => {
    const el = list.current;
    const state = el && !prefersReducedMotion() ? Flip.getState(el.children) : null;
    fn();
    if (state)
      requestAnimationFrame(() =>
        Flip.from(state, {
          duration: 0.7,
          ease: "expo.out",
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.03 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
        }),
      );
  };

  const shown = wines.filter((w) => (!region || w.region === region) && (!color || w.color === color));
  const current = regions.find((r) => r.id === region);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="t-eyebrow text-candle">{labels.region}</p>
        <RiverMap
          pins={regions.map((r) => ({ id: r.id, x: r.pin.x, y: r.pin.y, label: r.name[locale] }))}
          active={region}
          onSelect={(id) => animate(() => setRegion((cur) => (cur === id ? null : (id as RegionId))))}
          home={labels.home}
          selectLabel={labels.mapLabel}
          className="mt-4 text-cream"
        />
        <div className="mt-4 min-h-[9rem] rounded-2xl border border-line p-5" aria-live="polite">
          {current ? (
            <>
              <p className="t-h3">{current.name[locale]}</p>
              <p className="mt-2 text-sm text-smoke">{current.blurb[locale]}</p>
              <p className="t-eyebrow mt-3 text-candle/90">{current.grapes.join(" · ")}</p>
            </>
          ) : (
            <p className="text-sm text-smoke">{labels.allRegions}</p>
          )}
        </div>
      </aside>

      <div>
        <h2 className="sr-only">{labels.list}</h2>
        <div className="flex flex-col gap-4 border-b border-line pb-6">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={labels.region}>
            <Chip on={!region} onClick={() => animate(() => setRegion(null))}>
              {labels.all}
            </Chip>
            {regions.map((r) => (
              <Chip key={r.id} on={region === r.id} onClick={() => animate(() => setRegion(region === r.id ? null : r.id))}>
                {r.name[locale]}
              </Chip>
            ))}
          </div>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={labels.color}>
            {COLORS.map((c) => (
              <Chip key={c} on={color === c} onClick={() => animate(() => setColor(color === c ? null : c))}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: swatch[c] }} aria-hidden />
                {colorLabels[c][locale]}
              </Chip>
            ))}
          </div>
          <p className="t-eyebrow text-smoke" aria-live="polite">
            {labels.count.replace("{n}", String(shown.length))}
          </p>
        </div>

        <ul ref={list} className="grid gap-px overflow-hidden rounded-b-2xl sm:grid-cols-2">
          {shown.map((w) => (
            <li key={w.id} className="group relative bg-night py-7 sm:px-6 sm:odd:pl-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-eyebrow flex items-center gap-2 text-smoke">
                    <span className="h-2 w-2 rounded-full" style={{ background: swatch[w.color] }} aria-hidden />
                    {colorLabels[w.color][locale]} · {w.vintage}
                  </p>
                  <h3 className="t-serif mt-3 text-[1.6rem] leading-tight transition-transform duration-500 group-hover:translate-x-1 group-hover:italic">{w.name}</h3>
                  <p className="mt-1 text-sm text-cream/80">
                    {w.producer} · {w.grape}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-smoke">{w.notes[locale]}</p>
              <p className="t-num mt-4 flex gap-5 text-sm">
                {w.glass && (
                  <span>
                    <span className="text-smoke">{labels.glass} </span>
                    {formatRsd(w.glass, locale)}
                  </span>
                )}
                <span>
                  <span className="text-smoke">{labels.bottle} </span>
                  {formatRsd(w.bottle, locale)}
                </span>
              </p>
              <span className="absolute inset-x-0 bottom-0 h-px bg-line sm:group-odd:right-6" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx(
        "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
        on ? "border-candle bg-candle text-night" : "border-line text-cream/85 hover:border-cream/60",
      )}
    >
      {children}
    </button>
  );
}
