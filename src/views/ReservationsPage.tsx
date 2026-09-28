import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReservationWidget } from "@/components/reserve/ReservationWidget";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { fmtTime, hoursRows, site, terraceSeason } from "@/lib/site";
import { faqs } from "@/content/faq";
import { faqSchema, graph } from "@/lib/schema";
import Link from "next/link";

const copy = {
  sr: {
    title: "Rezervacije: sto u sali, na terasi ili za šankom kuhinje",
    description: "Rezervišite sto u Sutonu online: izaberite datum, vreme i mesto u sali, na terasi na Savi ili za šankom kuhinje pored žara. Potvrda odmah.",
    eyebrow: "Rezervacije",
    h1: "Vaš sto na obali.",
    intro: "Tri koraka i sto je vaš. Za grupe veće od 12 osoba i privatne proslave pošaljite upit.",
    info: "Dobro je znati",
    points: [
      "Sto čuvamo 15 minuta od vremena rezervacije.",
      "Otkazivanje najkasnije 4 sata ranije, za grupe 48 sati.",
      "Svako veče imamo nekoliko mesta za šankom bez rezervacije.",
      "Deca su dobrodošla; imamo visoke stolice i bojanke.",
    ],
    group: "Proslava ili poslovna večera?",
    groupLink: "Pošaljite upit",
    faqTitle: "Pitanja o rezervacijama",
  },
  en: {
    title: "Reservations: dining room, river terrace or kitchen counter",
    description: "Book a table at Suton online: choose a date, time and seat in the dining room, on the Sava terrace or at the kitchen counter by the fire. Instant confirmation.",
    eyebrow: "Reservations",
    h1: "Your table by the river.",
    intro: "Three steps and the table is yours. For groups of more than 12 and private events, send an inquiry.",
    info: "Good to know",
    points: [
      "We hold your table for 15 minutes after the booking time.",
      "Cancel at least 4 hours ahead, or 48 hours for groups.",
      "We keep a few counter seats for walk-ins every night.",
      "Kids are welcome; we have high chairs and colouring books.",
    ],
    group: "A celebration or business dinner?",
    groupLink: "Send an inquiry",
    faqTitle: "Booking questions",
  },
};

export const reservationsMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.reservations, eyebrow: copy[locale].eyebrow, photo: "/images/room/terrace-dusk.jpg" });

export function ReservationsPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  const bookFaqs = faqs.filter((f) => f.group === "book");
  return (
    <PageShell>
      <JsonLd data={graph(faqSchema(locale, bookFaqs))} />
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_60%_at_80%_0%,rgb(110_31_42/0.45),transparent_70%)]" aria-hidden />
        <div className="wrap relative">
          <div className="anim-fade">
            <Breadcrumbs
              items={[
                { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
                { name: dict.nav.reservations, href: pageHref(locale, "reservations") },
              ]}
              label={dict.breadcrumbHome}
            />
          </div>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="t-eyebrow anim-fade text-candle">{c.eyebrow}</p>
              <h1 className="t-h1 anim-heading mt-5">{c.h1}</h1>
              <p className="t-lead anim-fade mt-6 max-w-xl text-cream/80" style={{ "--d": "0.3s" } as React.CSSProperties}>
                {c.intro}
              </p>
            </div>
            <div className="anim-fade flex flex-col gap-2 text-sm md:items-end" style={{ "--d": "0.4s" } as React.CSSProperties}>
              <OpenBadge dict={dict} />
              <a href={`tel:${site.phone}`} className="link-underline text-cream">
                {site.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="anim-fade mt-14 rounded-[2rem] border border-line bg-char/50 p-5 backdrop-blur-sm sm:p-8 md:p-10" style={{ "--d": "0.45s" } as React.CSSProperties}>
            <ReservationWidget locale={locale} eventsHref={pageHref(locale, "events")} />
          </div>
        </div>
      </section>

      <section className="py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap grid gap-14 md:grid-cols-3">
          <Reveal>
            <h2 className="t-eyebrow text-candle">{dict.hours}</h2>
            <dl className="t-num mt-5 space-y-2">
              {hoursRows.map((r) => (
                <div key={r.days.en} className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt>{r.days[locale]}</dt>
                  <dd className="text-right">
                    {fmtTime(r.open)}–{fmtTime(r.close)}
                    <span className="block text-xs text-smoke">
                      {dict.kitchenUntil} {fmtTime(r.kitchen)}
                    </span>
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-4">
                <dt>{dict.terraceSeason}</dt>
                <dd>{terraceSeason[locale]}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="t-eyebrow text-candle">{c.info}</h2>
            <ul className="mt-5 space-y-3 text-cream/85">
              {c.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-candle" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="t-h3">{c.group}</h2>
            <Link href={pageHref(locale, "events")} className="link-underline mt-4 inline-block text-candle">
              {c.groupLink} →
            </Link>
          </Reveal>
        </div>
        <div className="wrap mt-20 max-w-4xl">
          <h2 className="t-h2">{c.faqTitle}</h2>
          <div className="mt-8">
            <FaqList items={bookFaqs.map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
