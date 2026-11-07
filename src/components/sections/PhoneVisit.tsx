import type { Dict } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { fmtTime, hoursRows, site, terraceSeason } from "@/lib/site";

const copy = {
  sr: { eyebrow: "Radno vreme i lokacija", title: "Sto vas čeka na obali Save.", directions: "Kako do nas" },
  en: { eyebrow: "Hours & location", title: "Your table is waiting on the Sava.", directions: "Get directions" },
};

/** Phones only: hours and address right after the menu. Previews use PreviewMap for this. */
export function PhoneVisit({ locale, dict }: { locale: Locale; dict: Dict }) {
  const c = copy[locale];
  const city = locale === "sr" ? site.city : site.cityEn;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.neighbourhood}, ${city}`)}`;
  return (
    <section className="wrap hidden pb-2 pt-6 phone:order-2 phone:block" aria-labelledby="visit-title">
      <p className="t-eyebrow text-candle">{c.eyebrow}</p>
      <h2 id="visit-title" className="t-h2 mt-2.5">
        {c.title}
      </h2>
      <dl className="t-num mt-3 border-t border-line text-[0.92rem]">
        {hoursRows.map((r) => (
          <div key={r.days.en} className="flex justify-between gap-4 border-b border-line py-1">
            <dt className="text-smoke">{r.days[locale]}</dt>
            <dd>
              {fmtTime(r.open)}–{fmtTime(r.close)}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-b border-line py-1">
          <dt className="text-smoke">{dict.terrace}</dt>
          <dd>{terraceSeason[locale]}</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center justify-between gap-4">
        <address className="text-[0.92rem] not-italic leading-snug text-cream/85">
          {site.street}, {site.streetNote[locale]}
          <br />
          {site.neighbourhood}, {city}
        </address>
        <a href={directions} target="_blank" rel="noopener" className="inline-flex h-11 shrink-0 items-center rounded-full border border-cream/30 px-4 text-[0.9rem] text-cream">
          {c.directions} ↗
        </a>
      </div>
    </section>
  );
}
