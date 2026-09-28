import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, menuSchema } from "@/lib/schema";
import { menuSeason } from "@/content/menu";

const copy = {
  sr: {
    title: "Meni: jesen 2026",
    description: "Sezonski meni Sutona: proja iz žara, ćevapi od mangulice, jagnjetina ispod sača, riblja čorba sa Dunava i šljive u Prokupcu. Cene u dinarima, vegetarijanska, veganska i bezglutenska jela.",
    eyebrow: "Meni · jesen 2026",
    h1: "Sve što stiže na sto, stiže iz vatre.",
    intro: "Meni menjamo sa sezonom i sa onim što tog jutra stigne sa salaša. Pređite mišem preko jela da ga vidite, ili ga dodirnite na telefonu.",
    wine: "Vinska karta",
    notes: [
      "Cene su u dinarima i uključuju PDV.",
      "Kuhinja radi do 23:00, petkom i subotom do ponoći.",
      "Za alergije i celijakiju razgovarajte sa konobarom; imamo spisak 14 alergena za svako jelo.",
      "Degustacioni meni od 8 sledova petkom i subotom za šankom kuhinje: 8.900 RSD.",
    ],
    labels: { filter: "Ishrana", all: "Poništi", empty: "Nijedno jelo ne odgovara svim izabranim filterima.", count: "Prikazano jela: {n}", jump: "Delovi menija" },
  },
  en: {
    title: "Menu: autumn 2026",
    description: "Suton's seasonal menu: cornbread from the embers, Mangalica ćevapi, lamb under the sač, Danube fish soup and plums in Prokupac. Prices in RSD, with vegetarian, vegan and gluten-free dishes.",
    eyebrow: "Menu · autumn 2026",
    h1: "Everything on the table comes from the fire.",
    intro: "The menu changes with the season and with whatever arrives from the farms that morning. Hover over a dish to see it, or tap it on your phone.",
    wine: "Wine list",
    notes: [
      "Prices are in Serbian dinars (RSD) and include VAT. 1 EUR ≈ 117 RSD.",
      "The kitchen serves until 11 pm, and until midnight on Fridays and Saturdays.",
      "For allergies or coeliac disease, talk to your waiter; we list the 14 allergens for every dish.",
      "Eight-course tasting menu on Fridays and Saturdays at the kitchen counter: RSD 8,900.",
    ],
    labels: { filter: "Diet", all: "Clear", empty: "No dishes match all the selected filters.", count: "Dishes shown: {n}", jump: "Menu sections" },
  },
};

export const menuMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.menu, eyebrow: menuSeason[locale], photo: "/images/dish/lamb-shank.jpg" });

export function MenuPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <JsonLd data={graph(menuSchema(locale))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.menu, href: pageHref(locale, "menu") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
        image="dish/sauce-pour-steak"
        imageAlt={locale === "sr" ? "Kuvar preliva sos preko odreska" : "A chef pouring sauce over a steak"}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={pageHref(locale, "reservations")}>{dict.reserve}</Button>
          <Button href={pageHref(locale, "wine")} variant="ghost">
            {c.wine}
          </Button>
        </div>
      </PageHero>

      <section className="theme-paper relative pb-24">
        <div className="wrap">
          <MenuBoard locale={locale} labels={c.labels} />
          <ul className="mt-20 grid gap-4 border-t border-line pt-8 text-sm text-muted md:grid-cols-2">
            {c.notes.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
