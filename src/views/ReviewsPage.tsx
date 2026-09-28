import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { reviews, ratingBreakdown } from "@/content/reviews";

const copy = {
  sr: {
    title: "Utisci gostiju: 4,8 od 1.184 recenzije",
    description: "Šta gosti kažu o Sutonu: jagnjetina ispod sača, terasa na zalasku, srpska vina i privatne proslave. Prosečna ocena 4,8 na Google-u.",
    eyebrow: "Utisci",
    h1: "Najbolje reklame pišu gosti.",
    intro: "Izbor iz 1.184 recenzije na Google-u, od komšija sa Dorćola do putnika iz Minhena i Madrida.",
    badges: ["Preporuka vodiča „Beograd za sladokusce 2026.“", "Nagrada publike, Festival ukusa Savamale 2025.", "Najbolja vinska karta, Vinska nedelja 2025."],
    write: "Bili ste kod nas? Ostavite utisak",
    writeNote: "Demo: dugme ne vodi na pravi profil.",
  },
  en: {
    title: "Guest reviews: 4.8 from 1,184 reviews",
    description: "What guests say about Suton: lamb under the sač, the sunset terrace, Serbian wines and private events. Rated 4.8 on Google.",
    eyebrow: "Reviews",
    h1: "Our best adverts are written by guests.",
    intro: "A selection from 1,184 Google reviews, from neighbours in Dorćol to travellers from Munich and Madrid.",
    badges: ["Recommended in “Belgrade for Food Lovers 2026”", "Audience award, Savamala Taste Festival 2025", "Best wine list, Belgrade Wine Week 2025"],
    write: "Visited us? Leave a review",
    writeNote: "Demo: this button doesn't link to a real profile.",
  },
};

export const reviewsMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.reviews, eyebrow: copy[locale].eyebrow, photo: "/images/people/clink-red.jpg" });

export function ReviewsPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  const nf = (n: number, d = 0) => n.toLocaleString(locale === "sr" ? "de-DE" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.reviews, href: pageHref(locale, "reviews") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
      />

      <section className="pb-16">
        <div className="wrap grid gap-10 rounded-[2rem] border border-line bg-char/50 p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-14 md:p-12">
          <div>
            <p className="t-serif t-num text-[6rem] leading-none text-candle">{nf(site.rating.value, 1)}</p>
            <Stars value={site.rating.value} className="mt-2 text-2xl text-candle" />
            <p className="mt-2 text-sm text-smoke">
              {nf(site.rating.count)} {dict.rating.reviews} {dict.rating.on}
            </p>
          </div>
          <ul className="space-y-2" aria-label={c.eyebrow}>
            {ratingBreakdown.map((r) => (
              <li key={r.stars} className="t-num flex items-center gap-3 text-sm">
                <span className="w-4 text-smoke">{r.stars}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream/10">
                  <span className="block h-full rounded-full bg-candle" style={{ width: `${r.share * 100}%` }} />
                </span>
                <span className="w-12 text-right text-smoke">{nf(r.share * 100, 0)}%</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <span className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full border border-line px-6 text-cream/85" aria-disabled="true">
              {c.write}
            </span>
            <span className="text-center text-xs text-smoke">{c.writeNote}</span>
          </div>
        </div>
        <Reveal as="ul" stagger={0.08} className="wrap mt-8 flex flex-wrap gap-3">
          {c.badges.map((b) => (
            <li key={b} className="t-eyebrow rounded-full border border-candle/40 px-4 py-2.5 text-[0.68rem] text-candle">
              ★ {b}
            </li>
          ))}
        </Reveal>
      </section>

      <section className="pb-28">
        <div className="wrap columns-1 gap-5 md:columns-2 xl:columns-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <ReviewCard r={r} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
