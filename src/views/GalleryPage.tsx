import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

const copy = {
  sr: {
    title: "Galerija: hrana, vatra, vino i reka",
    description: "Fotografije iz Sutona: jela sa žara, kuhinja, sala uz sveće, terasa na Savi u sumrak i naši gosti.",
    eyebrow: "Galerija",
    h1: "Pogled kroz dim.",
    intro: "Jela, ljudi i trenuci iz kuhinje, sale i sa terase. Filtrirajte po temi i otvorite fotografiju u punoj veličini.",
    labels: { all: "Sve", close: "Zatvori", prev: "Prethodna", next: "Sledeća", view: "Pogledaj", filter: "Teme galerije" },
  },
  en: {
    title: "Gallery: food, fire, wine and the river",
    description: "Photos from Suton: dishes from the grill, the kitchen, the candlelit dining room, the Sava terrace at dusk and our guests.",
    eyebrow: "Gallery",
    h1: "A view through the smoke.",
    intro: "Dishes, people and moments from the kitchen, the dining room and the terrace. Filter by theme and open any photo full size.",
    labels: { all: "All", close: "Close", prev: "Previous", next: "Next", view: "View", filter: "Gallery themes" },
  },
};

export const galleryMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.gallery, eyebrow: copy[locale].eyebrow, photo: "/images/chef/plating.jpg" });

export function GalleryPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.gallery, href: pageHref(locale, "gallery") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
      />
      <section className="pb-28">
        <div className="wrap">
          <GalleryGrid locale={locale} labels={c.labels} />
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
