import clsx from "clsx";
import { Stars } from "@/components/ui/Stars";
import type { Review } from "@/content/reviews";
import type { Locale } from "@/lib/i18n";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter((c) => c && /[A-ZČĆŠĐŽ]/.test(c))
    .slice(0, 2)
    .join("");

/** Google-style review card (fictional reviews). */
export function ReviewCard({ r, locale, className }: { r: Review; locale: Locale; className?: string }) {
  const date = new Date(r.date).toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : "en-GB", { month: "long", year: "numeric" });
  return (
    <figure className={clsx("flex h-full flex-col rounded-[1.5rem] border border-line bg-char/80 p-7 backdrop-blur-sm phone:rounded-[1.1rem] phone:bg-char phone:px-3.5 phone:py-3 phone:backdrop-blur-none", className)}>
      <div className="flex items-center justify-between gap-4">
        <Stars value={r.rating} className="text-candle" label={`${r.rating} / 5`} />
        <span className="t-eyebrow text-smoke">{r.tag[locale]}</span>
      </div>
      <blockquote className="mt-5 flex-1 text-[1.02rem] leading-relaxed text-cream/90 phone:mt-1.5 phone:text-[0.9rem] phone:leading-[1.38]">
        <p>“{r.text[locale]}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5 phone:mt-2 phone:gap-2 phone:pt-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-vranac text-sm font-medium text-cream phone:h-8 phone:w-8 phone:text-xs" aria-hidden>
          {initials(r.name)}
        </span>
        <span className="text-sm phone:text-[0.8rem] phone:leading-snug">
          <span className="block text-cream">{r.name}</span>
          <span className="block text-smoke">
            {r.from[locale]} · {date}
            {r.lang !== locale && <span> · {locale === "sr" ? "prevedeno" : "translated"}</span>}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
