import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { eventAlternates, eventHref, pageHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { eventSchema, graph } from "@/lib/schema";
import { events, type SutonEvent } from "@/content/events";
import { formatRsd } from "@/content/menu";
import { site } from "@/lib/site";

const L = {
  sr: { when: "Kada", price: "Cena", seats: "Mesta", book: "Rezerviši mesto", call: "ili pozovite", programme: "Program večeri", more: "Ostali događaji", seatsN: (n: number) => `${n} gostiju` },
  en: { when: "When", price: "Price", seats: "Seats", book: "Reserve a seat", call: "or call", programme: "The evening", more: "More events", seatsN: (n: number) => `${n} guests` },
};

export const eventMetadata = (locale: Locale, e: SutonEvent): Metadata =>
  buildMetadata({
    locale,
    title: `${e.title[locale]} · ${e.when[locale]}`,
    description: e.summary[locale],
    alternates: eventAlternates(e.slug),
    eyebrow: e.kicker[locale],
    photo: `/images/${e.image}.jpg`,
  });

export function EventDetailPage({ locale, e }: { locale: Locale; e: SutonEvent }) {
  const l = L[locale];
  const dict = getDictionary(locale);
  const others = events.filter((x) => x.id !== e.id);
  return (
    <PageShell>
      <JsonLd data={graph(eventSchema(locale, e))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.events, href: pageHref(locale, "events") },
          { name: e.title[locale], href: eventHref(locale, e.slug) },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={e.kicker[locale]}
        title={e.title[locale]}
        intro={e.summary[locale]}
        image={e.image}
        imageAlt={e.title[locale]}
        wide
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={pageHref(locale, "reservations")} magnetic>
            {l.book}
          </Button>
          <p className="text-cream/80">
            {l.call}{" "}
            <a href={`tel:${site.phone}`} className="link-underline text-cream">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </PageHero>

      <section className="py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_22rem]">
          <div className="max-w-2xl space-y-6">
            {e.body[locale].map((p, i) => (
              <Reveal key={i} as="p" className={i === 0 ? "t-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug" : "t-lead text-cream/85"}>
                {p}
              </Reveal>
            ))}
          </div>
          <Reveal as="dl" className="h-fit space-y-5 rounded-[1.5rem] border border-line bg-char/60 p-7 lg:sticky lg:top-28">
            <div>
              <dt className="t-eyebrow text-smoke">{l.when}</dt>
              <dd className="mt-1 text-cream">{e.when[locale]}</dd>
            </div>
            <div>
              <dt className="t-eyebrow text-smoke">{l.price}</dt>
              <dd className="t-num mt-1 text-cream">
                {formatRsd(e.price, locale)} <span className="text-sm text-smoke">{e.priceNote[locale]}</span>
              </dd>
            </div>
            <div>
              <dt className="t-eyebrow text-smoke">{l.seats}</dt>
              <dd className="mt-1 text-cream">{l.seatsN(e.seats)}</dd>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-[clamp(5rem,10vw,8rem)]" aria-labelledby="prog-title">
        <div className="wrap">
          <SplitReveal id="prog-title" className="t-h2">
            {l.programme}
          </SplitReveal>
          <Reveal as="ol" stagger={0.08} className="mt-10 border-t border-line">
            {e.programme[locale].map((p) => (
              <li key={p.title} className="grid gap-2 border-b border-line py-6 md:grid-cols-[8rem_1fr_1.2fr] md:items-baseline md:gap-8">
                <span className="t-eyebrow t-num text-candle">{p.time ?? "·"}</span>
                <span className="t-serif text-2xl">{p.title}</span>
                <span className="text-cream/80">{p.text}</span>
              </li>
            ))}
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {e.gallery.map((k, i) => (
              <Reveal key={k} delay={i * 0.08} className={i % 2 ? "relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl bg-char" : "arch relative aspect-[3/4] overflow-hidden bg-char"}>
                <Photo k={k} alt="" sizes="(min-width: 768px) 24vw, 48vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="wrap">
          <p className="t-eyebrow text-candle">{l.more}</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={eventHref(locale, o.slug)} className="group flex items-center gap-5 rounded-2xl border border-line p-4 transition-colors hover:border-candle/60">
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-char">
                    <Photo k={o.image} alt="" sizes="5rem" />
                  </span>
                  <span>
                    <span className="t-serif block text-2xl group-hover:italic">{o.title[locale]}</span>
                    <span className="block text-sm text-smoke">{o.when[locale]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
