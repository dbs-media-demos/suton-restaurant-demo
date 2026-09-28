import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { GiftCardBuilder } from "@/components/forms/GiftCardBuilder";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, serviceSchema } from "@/lib/schema";

const copy = {
  sr: {
    title: "Poklon kartice: večera na obali Save",
    description: "Poklonite veče u Sutonu: poklon kartice od 3.000 RSD ili doživljaji poput degustacionog menija za dvoje i zalaska na terasi. Isporuka emailom, PDF ili hrastova kutija.",
    eyebrow: "Poklon kartice",
    h1: "Poklonite jedan suton.",
    intro: "Iznos po izboru ili gotov doživljaj, sa porukom koju pišete vi. Kartica važi 12 meseci za sva jela, pića i događaje.",
    faq: "Česta pitanja o poklon karticama",
    items: [
      { q: "Koliko dugo važi poklon kartica?", a: "12 meseci od dana kupovine. Datum isteka piše na kartici." },
      { q: "Može li se kartica iskoristiti u više navrata?", a: "Da. Ostatak iznosa ostaje na kartici do isteka roka." },
      { q: "Mogu li da kupim karticu u restoranu?", a: "Naravno, svakog dana od 12 časova. Kartica stiže u hrastovoj kutiji sa voštanim pečatom." },
    ],
    service: "Poklon kartice Suton",
  },
  en: {
    title: "Gift cards: dinner on the Sava riverfront",
    description: "Give an evening at Suton: gift cards from RSD 3,000 or experiences like the tasting menu for two and a sunset on the terrace. Delivered by email, as a PDF or in an oak box.",
    eyebrow: "Gift cards",
    h1: "Give someone a sunset.",
    intro: "Any amount or a ready-made experience, with a message you write. Valid for 12 months on all food, drinks and events.",
    faq: "Gift card questions",
    items: [
      { q: "How long is a gift card valid?", a: "12 months from the date of purchase. The expiry date is printed on the card." },
      { q: "Can the card be used more than once?", a: "Yes. Any remaining balance stays on the card until it expires." },
      { q: "Can I buy a card at the restaurant?", a: "Of course, every day from noon. It comes in an oak box with a wax seal." },
    ],
    service: "Suton gift cards",
  },
};

export const giftsMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.gifts, eyebrow: copy[locale].eyebrow, photo: "/images/wine/shadow-glass.jpg" });

export function GiftsPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <JsonLd data={graph(serviceSchema(locale, c.service, c.description, pageHref(locale, "gifts")))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.gifts, href: pageHref(locale, "gifts") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
      />
      <section className="pb-24">
        <div className="wrap">
          <GiftCardBuilder locale={locale} />
        </div>
      </section>
      <section className="border-t border-line py-20">
        <div className="wrap max-w-4xl">
          <h2 className="t-h2">{c.faq}</h2>
          <div className="mt-8">
            <FaqList items={c.items} idPrefix="gift" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
