"use client";

import { useEffect, useState } from "react";
import { formatBelgradeTime, sunsetFor } from "@/lib/time";
import type { Locale } from "@/lib/i18n";

type State = { time: string; mins: number; tomorrow: string } | null;

/** "The sun sets in Belgrade today at 18:47 — in 2 h 13 min." Computed live, in Belgrade time. */
export function SunsetCountdown({ locale }: { locale: Locale }) {
  const [s, setS] = useState<State>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const today = sunsetFor(now);
      const tomorrow = sunsetFor(new Date(now.getTime() + 86400000));
      setS({ time: formatBelgradeTime(today), mins: Math.round((today.getTime() - now.getTime()) / 60000), tomorrow: formatBelgradeTime(tomorrow) });
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const sr = locale === "sr";
  if (!s) {
    return (
      <p className="t-num flex items-baseline gap-3" aria-live="polite">
        <span className="t-serif text-[clamp(3.5rem,9vw,8rem)] leading-none text-candle">--:--</span>
      </p>
    );
  }

  const h = Math.floor(s.mins / 60);
  const m = s.mins % 60;
  const before = s.mins > 0;
  return (
    <div aria-live="polite">
      <p className="t-eyebrow text-cream/80">
        {before ? (sr ? "Sunce danas zalazi u" : "Sunset in Belgrade today") : sr ? "Sunce je danas zašlo u" : "Today's sunset was at"}
      </p>
      <p className="t-num t-serif mt-2 text-[clamp(3.5rem,9vw,8rem)] leading-none text-candle">{s.time}</p>
      <p className="mt-3 text-cream/85">
        {before
          ? sr
            ? `Još ${h > 0 ? `${h} h ` : ""}${m} min. Stignite na vreme za prvu čašu.`
            : `In ${h > 0 ? `${h} h ` : ""}${m} min. Just enough time for the first glass.`
          : sr
            ? `Sutra zalazi u ${s.tomorrow}. Rezervišite sto pola sata ranije.`
            : `Tomorrow it sets at ${s.tomorrow}. Book your table half an hour before.`}
      </p>
    </div>
  );
}
