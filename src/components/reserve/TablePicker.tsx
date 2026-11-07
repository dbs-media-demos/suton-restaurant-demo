"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

const TIMES = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

const T = {
  sr: {
    guests: "Gostiju",
    time: "Vreme",
    less: "Jedan gost manje",
    more: "Jedan gost više",
    label: (n: number, t: string) => `Sto za ${n} u ${t}`,
    call: (n: number, t: string) => `Pozovite: sto za ${n} u ${t}`,
  },
  en: {
    guests: "Guests",
    time: "Time",
    less: "One guest fewer",
    more: "One guest more",
    label: (n: number, t: string) => `Table for ${n} at ${t}`,
    call: (n: number, t: string) => `Call: table for ${n} at ${t}`,
  },
};

/** Phones: pick guests and a time, and the button carries them into the reservation page (a preview's calls instead). */
export function TablePicker({ locale, reserveHref, tel }: { locale: Locale; reserveHref: string; tel?: string }) {
  const t = T[locale];
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("20:00");
  const btn = "flex h-[3.25rem] w-full items-center justify-center rounded-full bg-candle font-medium text-night";

  return (
    <div className="mt-3 hidden w-full text-left phone:block">
      <div className="flex items-center justify-between gap-3">
        <span className="t-eyebrow text-cream/80">{t.guests}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} aria-label={t.less} className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-xl leading-none text-cream">
            −
          </button>
          <output className="t-serif t-num w-9 text-center text-[1.6rem] leading-none text-candle" aria-live="polite">
            {guests}
          </output>
          <button type="button" onClick={() => setGuests(Math.min(12, guests + 1))} aria-label={t.more} className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 text-xl leading-none text-cream">
            +
          </button>
        </div>
      </div>
      <fieldset className="mt-2.5">
        <legend className="sr-only">{t.time}</legend>
        <div className="grid grid-cols-6 gap-1">
          {TIMES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === time}
              onClick={() => setTime(s)}
              className={clsx("t-num h-11 rounded-full border text-[0.8rem] transition-colors duration-200", s === time ? "border-candle bg-candle font-medium text-night" : "border-cream/30 bg-night/40 text-cream")}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-3">
        {tel ? (
          <a href={`tel:${tel}`} className={btn}>
            {t.call(guests, time)}
          </a>
        ) : (
          <Link href={`${reserveHref}?guests=${guests}&time=${encodeURIComponent(time)}`} className={btn}>
            {t.label(guests, time)} →
          </Link>
        )}
      </div>
    </div>
  );
}
