import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, graph } from "@/lib/schema";
import { faqs, faqGroups, type Faq } from "@/content/faq";
import { site } from "@/lib/site";

const copy = {
  sr: {
    title: "Česta pitanja: rezervacije, parking, terasa, alergije",
    description: "Sve što treba da znate pre dolaska u Suton: rezervacije i otkazivanje, radno vreme kuhinje, sezona terase, psi, plaćanje karticom, parking u Savamali i posebna ishrana.",
    eyebrow: "Česta pitanja",
    h1: "Pre nego što dođete.",
    intro: "Niste našli odgovor? Pozovite nas na",
  },
  en: {
    title: "FAQ: bookings, parking, terrace, allergies",
    description: "Everything to know before visiting Suton: bookings and cancellations, kitchen hours, terrace season, dogs, card payments, parking in Savamala and dietary needs.",
    eyebrow: "FAQ",
    h1: "Before you come.",
    intro: "Can't find an answer? Call us on",
  },
};

export const faqMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.faq, eyebrow: copy[locale].eyebrow, photo: "/images/room/bar-plants.jpg" });

export function FaqPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <JsonLd data={graph(faqSchema(locale, faqs))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.faq, href: pageHref(locale, "faq") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        image="room/bar-plants"
        imageAlt={locale === "sr" ? "Šank Sutona u polumraku" : "The Suton bar in low light"}
      >
        <p className="t-lead text-cream/80">
          {c.intro}{" "}
          <a href={`tel:${site.phone}`} className="link-underline text-candle">
            {site.phoneDisplay}
          </a>
          .
        </p>
      </PageHero>
      <section className="pb-28">
        <div className="wrap max-w-5xl space-y-20">
          {(Object.keys(faqGroups) as Faq["group"][]).map((g) => (
            <div key={g} className="grid gap-6 md:grid-cols-[14rem_1fr]">
              <h2 className="t-eyebrow pt-7 text-candle">{faqGroups[g][locale]}</h2>
              <FaqList idPrefix={g} items={faqs.filter((f) => f.group === g).map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
            </div>
          ))}
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
