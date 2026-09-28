import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { WineExplorer } from "@/components/menu/WineExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Photo } from "@/components/ui/Photo";
import { Reveal, SplitReveal, Parallax } from "@/components/ui/Reveal";
import { team } from "@/content/story";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

const copy = {
  sr: {
    title: "Vinska karta: srpska vina po regionima",
    description: "180 etiketa isključivo iz Srbije i regiona: Fruška gora, Šumadija, Župa i Negotinska krajina. Prokupac, Tamjanika, Grašac, Bermet. Vina na čašu i bocu, cene u dinarima.",
    eyebrow: "Vinska karta",
    h1: "Četiri regiona, jedna reka, 180 etiketa.",
    intro: "Izaberite region na mapi ili boju vina. U nastavku je izbor sa karte; ceo podrum od 180 etiketa donosi vam sommelier za stolom.",
    labels: {
      all: "Svi regioni",
      region: "Region",
      color: "Boja",
      glass: "Čaša",
      bottle: "Boca",
      count: "Vina: {n}",
      home: "SUTON · BEOGRAD",
      mapLabel: "Mapa vinskih regiona Srbije. Izaberite region.",
      allRegions: "Dodirnite region na mapi da vidite njegova vina, sorte i priču.",
    },
    somm: {
      eyebrow: "Sommelier",
      title: "Vino bira Vuk. Vi birate raspoloženje.",
      quote: "Recite mi šta jedete i kako vam je dan prošao. Ostalo je moj posao.",
      facts: ["Degustacija 3 vina: 1.900 RSD", "Otvaranje donesene boce: 1.500 RSD", "Kupovina boca za poneti: −20%"],
    },
  },
  en: {
    title: "Wine list: Serbian wines by region",
    description: "180 labels from Serbia and the region only: Fruška Gora, Šumadija, Župa and Negotin. Prokupac, Tamjanika, Grašac, Bermet. By the glass and bottle, prices in RSD.",
    eyebrow: "Wine list",
    h1: "Four regions, one river, 180 labels.",
    intro: "Pick a region on the map or a wine colour. Below is a selection from the list; the sommelier brings the full 180-label cellar to your table.",
    labels: {
      all: "All regions",
      region: "Region",
      color: "Colour",
      glass: "Glass",
      bottle: "Bottle",
      count: "Wines: {n}",
      home: "SUTON · BELGRADE",
      mapLabel: "Map of Serbian wine regions. Choose a region.",
      allRegions: "Tap a region on the map to see its wines, grapes and story.",
    },
    somm: {
      eyebrow: "Sommelier",
      title: "Vuk picks the wine. You pick the mood.",
      quote: "Tell me what you're eating and how your day went. The rest is my job.",
      facts: ["Tasting flight of 3 wines: RSD 1,900", "Corkage per bottle: RSD 1,500", "Bottles to take home: −20%"],
    },
  },
};

export const wineMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.wine, eyebrow: copy[locale].eyebrow, photo: "/images/wine/pour-red.jpg" });

export function WinePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  const somm = team[1];
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.wine, href: pageHref(locale, "wine") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
        image="poster/wine-pour"
        video="wine-pour"
      />

      <section className="pb-28">
        <div className="wrap">
          <WineExplorer locale={locale} labels={c.labels} />
        </div>
      </section>

      <section className="border-t border-line py-[clamp(6rem,12vw,10rem)]" aria-labelledby="somm-title">
        <div className="wrap grid items-center gap-14 md:grid-cols-2">
          <Parallax className="arch aspect-[4/5] w-full max-w-[28rem] bg-char">
            <div className="absolute inset-0">
              <Photo k={somm.image} alt={`${somm.name}, ${somm.role[locale]}`} sizes="(min-width: 768px) 28rem, 90vw" />
            </div>
          </Parallax>
          <div>
            <p className="t-eyebrow text-candle">{c.somm.eyebrow}</p>
            <SplitReveal id="somm-title" className="t-h2 mt-6">
              {c.somm.title}
            </SplitReveal>
            <Reveal>
              <blockquote className="t-serif mt-8 text-2xl italic text-cream/90">“{c.somm.quote}”</blockquote>
              <p className="mt-3 text-smoke">
                {somm.name}, {somm.role[locale]}
              </p>
              <p className="mt-6 max-w-lg text-cream/80">{somm.text[locale]}</p>
              <ul className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-cream/85">
                {c.somm.facts.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-candle" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
