import type { Metadata } from "next";
import clsx from "clsx";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { RiverMap } from "@/components/menu/RiverMap";
import { producers } from "@/content/story";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

const pins: Record<string, { x: number; y: number }> = {
  jeremic: { x: 136, y: 66 },
  maric: { x: 132, y: 200 },
  "zlatni-breg": { x: 160, y: 168 },
  kosovac: { x: 100, y: 94 },
  sirig: { x: 92, y: 44 },
};

const copy = {
  sr: {
    title: "Proizvođači: pet porodičnih imanja iz Šumadije i Vojvodine",
    description: "Mangulica sa salaša u Kovilju, šljive ispod Rudnika, kajmak iz Topole, lipov med sa Fruške gore i kameno mleveno brašno iz Sirige. Upoznajte porodice koje hrane Suton.",
    eyebrow: "Proizvođači",
    h1: "Hrana ima ime, prezime i adresu.",
    intro: "Svaka namirnica u Sutonu ima poreklo koje možemo da vam pokažemo na mapi. Ovo su porodice sa kojima radimo od prvog dana.",
    since: "Sarađujemo od",
    what: "Šta nam donose",
    map: "Mapa proizvođača",
    mapTitle: "Na manje od tri sata od našeg žara.",
    home: "SUTON",
  },
  en: {
    title: "Producers: five family farms from Šumadija and Vojvodina",
    description: "Mangalica pork from a farm in Kovilj, plums from below Mount Rudnik, kajmak from Topola, linden honey from Fruška Gora and stone-ground flour from Sirig. Meet the families who feed Suton.",
    eyebrow: "Producers",
    h1: "Food has a name, a surname and an address.",
    intro: "Every ingredient at Suton comes from somewhere we can show you on a map. These are the families we have worked with since day one.",
    since: "Working together since",
    what: "What they bring us",
    map: "Producer map",
    mapTitle: "Less than three hours from our fire.",
    home: "SUTON",
  },
};

export const producersMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.producers, eyebrow: copy[locale].eyebrow, photo: "/images/prod/plums-tree.jpg" });

export function ProducersPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.story, href: pageHref(locale, "story") },
          { name: dict.nav.producers, href: pageHref(locale, "producers") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
        image="prod/field-sunset"
        imageAlt={locale === "sr" ? "Polje u Vojvodini na zalasku sunca" : "A field in Vojvodina at sunset"}
      />

      <section className="pb-10">
        {producers.map((p, i) => (
          <article key={p.id} id={p.id} className="scroll-mt-24 border-t border-line py-[clamp(4rem,9vw,8rem)]" aria-labelledby={`${p.id}-t`}>
            <div className={clsx("wrap grid items-center gap-12 md:grid-cols-2 md:gap-20", i % 2 && "md:[&>*:first-child]:order-2")}>
              <div className="relative">
                <Parallax className={clsx("aspect-[4/5] bg-char", i % 2 ? "rounded-[2rem]" : "arch")} amount={12}>
                  <div className="absolute inset-0">
                    <Photo k={p.image} alt={`${p.name}, ${p.place[locale]}`} sizes="(min-width: 768px) 45vw, 90vw" />
                  </div>
                </Parallax>
                <div className={clsx("absolute -bottom-8 aspect-square w-[38%] overflow-hidden rounded-full border-[6px] border-night", i % 2 ? "-left-4" : "-right-4")}>
                  <Photo k={p.detail} alt="" sizes="16rem" />
                </div>
              </div>
              <div>
                <p className="t-eyebrow t-num text-candle">
                  0{i + 1} · {p.place[locale]}, {p.region[locale]}
                </p>
                <SplitReveal id={`${p.id}-t`} as="h2" className="t-h2 mt-5">
                  {p.name}
                </SplitReveal>
                <Reveal>
                  <p className="t-lead mt-6 text-cream/85">{p.text[locale]}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                    <div>
                      <dt className="text-smoke">{c.what}</dt>
                      <dd className="mt-1 text-cream">{p.what[locale]}</dd>
                    </div>
                    <div>
                      <dt className="text-smoke">{c.since}</dt>
                      <dd className="t-num mt-1 text-cream">{p.since}</dd>
                    </div>
                  </dl>
                </Reveal>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="border-t border-line py-[clamp(5rem,10vw,8rem)]" aria-labelledby="pmap-title">
        <div className="wrap grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="t-eyebrow text-candle">{c.map}</p>
            <SplitReveal id="pmap-title" className="t-h2 mt-5 max-w-[14ch]">
              {c.mapTitle}
            </SplitReveal>
          </div>
          <Reveal className="text-cream">
            <RiverMap pins={producers.map((p) => ({ id: p.id, label: p.name, ...pins[p.id] }))} home={c.home} selectLabel={c.map} />
          </Reveal>
        </div>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
