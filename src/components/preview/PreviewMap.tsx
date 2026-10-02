import { OpenBadge } from "@/components/layout/OpenBadge";
import type { Dict } from "@/i18n/dict";
import { DAY_NAMES, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's "where we are": the restaurant's real address on a Google map, hours and directions. */
export function PreviewMap({ biz, dict }: { biz: Biz; dict: Dict }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className="theme-night py-24 md:py-36" aria-labelledby="visit-title">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="t-eyebrow text-candle">Gde smo</p>
          <h2 id="visit-title" className="t-h1 mt-6 max-w-[14ch]">
            Sto vas <em className="text-candle">čeka.</em>
          </h2>
          {biz.address.full && <p className="t-lead mt-8 text-cream/85">{biz.address.full}</p>}
          <OpenBadge dict={dict} className="mt-6 text-cream" />
          {biz.hours && (
            <dl className="t-num mt-4 max-w-xs space-y-1 text-sm text-smoke">
              {weekFromMonday(biz.hours).map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <dt>{DAY_NAMES.sr[h.day]}</dt>
                  <dd>{dayRange(h, "sr")}</dd>
                </div>
              ))}
            </dl>
          )}
          <a href={directions} className="link-underline mt-10 inline-block text-cream">
            Kako do nas ↗
          </a>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
          <iframe src={embed} title={`Mapa: ${query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
        </div>
      </div>
    </section>
  );
}
