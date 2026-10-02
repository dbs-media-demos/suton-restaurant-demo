import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { FromTheFire } from "@/components/sections/FromTheFire";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { WineTeaser } from "@/components/sections/WineTeaser";
import { RiverSunset } from "@/components/sections/RiverSunset";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { EventsStack } from "@/components/sections/EventsStack";
import { GalleryRibbon } from "@/components/sections/GalleryRibbon";
import { CtaBand } from "@/components/sections/CtaBand";
import { chapters, chapterAlts } from "@/content/story";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import type { PhotoKey } from "@/content/photos";
import { PreviewMap } from "@/components/preview/PreviewMap";
import { num, openDays, type Biz } from "@/lib/biz-core";

const copy = {
  sr: {
    title: "Suton: restoran i vinski bar na Savi, Beograd",
    description:
      "Moderna balkanska kuhinja sa otvorene vatre, 180 srpskih vina i terasa na Savi za najlepši zalazak u gradu. Savamala, Beograd. Rezervišite sto online.",
    h1: "Suton, restoran i vinski bar na obali Save u Savamali, Beograd",
    eyebrow: "Savamala · Beograd · od 2019.",
    sub: "Moderna balkanska kuhinja sa otvorene vatre, srpska vina i sto na obali Save.",
    story: {
      label: "Naša priča",
      title: "Kuhinja koja počinje od vatre.",
      text: "Bukva i hrast gore od jutra. Na žaru nastaje sve: od proje do deserta. Namirnice stižu sa pet porodičnih imanja iz Šumadije i Vojvodine, a vino isključivo iz srpskih podruma.",
      link: "Upoznajte šefa i proizvođače",
      aside: "VATRA · VINO · REKA · SAVAMALA · BEOGRAD · ",
    },
    manifesto: {
      eyebrow: "Suton, imenica: trenutak kada dan prelazi u noć",
      text: "Suton je onih dvadeset minuta kada grad uspori, Sava postane bakarna, žar u kuhinji zapucketa, a mi otvorimo prvu bocu. Sve ostalo je samo izgovor da ostanete do kasno.",
      pills: { 8: "river/sunset-water", 11: "fire/embers-bright", 17: "wine/pour-red" } as Record<number, PhotoKey>,
      footnotes: [
        { n: "180", label: "etiketa srpskih vina" },
        { n: "5", label: "porodičnih proizvođača" },
        { n: "0", label: "gasnih ringli u kuhinji" },
        { n: "4,8★", label: "od 1.184 gosta na Google-u" },
      ],
    },
    fire: {
      eyebrow: "Iz vatre",
      title: "Pet stvari koje nas čine.",
      intro: "Nema gasa, nema mikrotalasne, nema prečica. Samo vatra, zemlja, ruke, podrum i reka.",
      link: "Cela priča",
    },
    menu: {
      eyebrow: "Meni",
      title: "Ukusi koje pamtite do sledećeg sutona.",
      text: "Meni pišemo prema sezoni i onome što tog jutra stigne sa salaša. Ovo su jela zbog kojih nam se gosti vraćaju.",
      cta: "Ceo meni",
    },
    wine: {
      eyebrow: "Vinska karta",
      title: "Srbija u čaši, region po region.",
      text: "Od lesnih brda Fruške gore do kamenih pivnica Negotina. Naš sommelier Vuk Lazić predstaviće vam vina za koja možda nikada niste čuli, i koja nećete zaboraviti.",
      cta: "Istraži vinsku kartu",
    },
    river: {
      eyebrow: "Terasa na reci",
      title: "Najlepši zalazak u Beogradu.",
      cta: "Rezerviši sto na terasi",
      facts: ["Terasa: 15. april – 31. oktobar", "Grejalice i ćebad od vune", "Psi su dobrodošli", "Pogled na Savu i Most na Adi"],
      alt: "Most na Adi noću, sa odrazima svetla u Savi",
    },
    reviews: { eyebrow: "Utisci gostiju", title: "Ono što gosti pišu posle poslednje čaše.", link: "Svi utisci" },
    events: { eyebrow: "Događaji i proslave", title: "Večeri koje se prepričavaju.", more: "Privatne proslave i upiti", cta: "Detalji" },
    gallery: { title: "Iza kulisa i za stolom.", link: "Galerija" },
    ribbon: [
      [
        { k: "dish/plating-spoon", alt: "Serviranje jela kašikom" },
        { k: "room/candle-flowers", alt: "Sveća i cveće na stolu" },
        { k: "fire/flames-close", alt: "Plamen u kuhinji" },
        { k: "people/clink-red", alt: "Gosti nazdravljaju crvenim vinom" },
        { k: "dish/pan-steam", alt: "Tiganj koji se puši na šporetu" },
        { k: "room/bar-plants", alt: "Šank sa biljkama" },
      ],
      [
        { k: "wine/barrel-room", alt: "Podrum sa buradima" },
        { k: "chef/seasoning-steak", alt: "Kuvar soli odrezak" },
        { k: "river/bridge-dusk", alt: "Most preko Save u sumrak" },
        { k: "dish/desserts-two", alt: "Dva deserta sa voćem" },
        { k: "people/table-wine", alt: "Društvo za stolom sa vinom" },
        { k: "detail/cheese-board", alt: "Daska sa sirevima" },
      ],
    ] as { k: PhotoKey; alt: string }[][],
  },
  en: {
    title: "Suton: restaurant & wine bar on the Sava, Belgrade",
    description:
      "Modern Balkan cooking over open fire, 180 Serbian wines and a river terrace with the best sunset in Belgrade. Savamala. Book a table online.",
    h1: "Suton, a restaurant and wine bar on the Sava riverfront in Savamala, Belgrade",
    eyebrow: "Savamala · Belgrade · since 2019",
    sub: "Modern Balkan cooking over open fire, Serbian wines and a table on the Sava.",
    story: {
      label: "Our story",
      title: "A kitchen that starts with fire.",
      text: "Beech and oak burn from morning. Everything is cooked on the embers, from cornbread to dessert. Produce comes from five family farms in Šumadija and Vojvodina, and the wine only from Serbian cellars.",
      link: "Meet the chef and our producers",
      aside: "FIRE · WINE · RIVER · SAVAMALA · BELGRADE · ",
    },
    manifesto: {
      eyebrow: "Suton, noun: the moment day turns into night",
      text: "Suton is those twenty minutes when the city slows down, the Sava turns copper, the embers in the kitchen start to crackle and we open the first bottle. Everything else is just an excuse to stay late.",
      pills: { 11: "river/sunset-water", 15: "fire/embers-bright", 24: "wine/pour-red" } as Record<number, PhotoKey>,
      footnotes: [
        { n: "180", label: "Serbian wine labels" },
        { n: "5", label: "family producers" },
        { n: "0", label: "gas burners in the kitchen" },
        { n: "4.8★", label: "from 1,184 guests on Google" },
      ],
    },
    fire: {
      eyebrow: "From the fire",
      title: "Five things that make us.",
      intro: "No gas, no microwave, no shortcuts. Just fire, land, hands, the cellar and the river.",
      link: "The whole story",
    },
    menu: {
      eyebrow: "Menu",
      title: "Flavours you'll remember until the next sunset.",
      text: "We write the menu around the season and whatever arrived from the farms that morning. These are the dishes guests come back for.",
      cta: "Full menu",
    },
    wine: {
      eyebrow: "Wine list",
      title: "Serbia in a glass, region by region.",
      text: "From the loess hills of Fruška Gora to the stone cellars of Negotin. Our sommelier Vuk Lazić will pour you wines you may never have heard of, and won't forget.",
      cta: "Explore the wine list",
    },
    river: {
      eyebrow: "River terrace",
      title: "The best sunset in Belgrade.",
      cta: "Book a terrace table",
      facts: ["Terrace: 15 April – 31 October", "Heaters and wool blankets", "Dogs welcome", "Views of the Sava and the Ada Bridge"],
      alt: "The Ada Bridge at night with its lights reflected in the Sava",
    },
    reviews: { eyebrow: "Guest reviews", title: "What guests write after the last glass.", link: "All reviews" },
    events: { eyebrow: "Events & private dining", title: "Evenings people talk about.", more: "Private dining & inquiries", cta: "Details" },
    gallery: { title: "Behind the pass and at the table.", link: "Gallery" },
    ribbon: [
      [
        { k: "dish/plating-spoon", alt: "Plating a dish with a spoon" },
        { k: "room/candle-flowers", alt: "Candle and flowers on a table" },
        { k: "fire/flames-close", alt: "Flames in the kitchen" },
        { k: "people/clink-red", alt: "Guests clinking glasses of red wine" },
        { k: "dish/pan-steam", alt: "A steaming pan on the stove" },
        { k: "room/bar-plants", alt: "The bar with plants" },
      ],
      [
        { k: "wine/barrel-room", alt: "A cellar with barrels" },
        { k: "chef/seasoning-steak", alt: "A cook seasoning a steak" },
        { k: "river/bridge-dusk", alt: "A bridge over the Sava at dusk" },
        { k: "dish/desserts-two", alt: "Two desserts with fruit" },
        { k: "people/table-wine", alt: "Friends at a table with wine" },
        { k: "detail/cheese-board", alt: "A cheese board" },
      ],
    ] as { k: PhotoKey; alt: string }[][],
  },
};

export const homeMetadata = (locale: Locale): Metadata =>
  buildMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    alternates: pagePaths.home,
    absoluteTitle: true,
    eyebrow: locale === "sr" ? "Savamala · Beograd" : "Savamala · Belgrade",
    photo: "/images/posters/hero.jpg",
  });

/** A preview's own lines: its name and area, no Sava or Savamala, numbers that are true of it. */
function previewCopy(biz: Biz) {
  const c = copy.sr;
  const days = openDays(biz);
  return {
    ...c,
    h1: `${biz.name}, restoran — ${biz.area}`,
    eyebrow: biz.area,
    sub: "Domaća kuhinja, dobra vina i sto koji vas čeka.",
    story: { ...c.story, aside: `VATRA · VINO · DRUŠTVO · ${biz.area.toUpperCase()} · ` },
    manifesto: {
      eyebrow: `${biz.shortName} · ${biz.area}`,
      text: "Ono malo vremena kada grad uspori, kuhinja zamiriše, žar zapucketa, a mi otvorimo prvu bocu. Sve ostalo je samo izgovor da ostanete do kasno.",
      pills: { 5: "room/candle-flowers", 8: "fire/embers-bright", 14: "wine/pour-red" } as Record<number, PhotoKey>,
      footnotes: [
        ...(biz.rating ? [{ n: `${num(biz, biz.rating.value)}★`, label: `od ${biz.rating.count} gostiju na Google-u` }] : []),
        ...(days ? [{ n: String(days), label: "dana nedeljno radimo" }] : []),
        { n: "1", label: "sto koji vas čeka" },
      ],
    },
    // The river chapter is hidden on previews, so four things remain
    fire: { ...c.fire, title: "Četiri stvari koje nas čine.", intro: "Nema gasa, nema mikrotalasne, nema prečica. Samo vatra, zemlja, ruke i podrum." },
    wine: {
      ...c.wine,
      text: "Od lesnih brda Fruške gore do kamenih pivnica Negotina. Predstavićemo vam vina za koja možda nikada niste čuli, i koja nećete zaboraviti.",
    },
  };
}

/**
 * The homepage. A personalised preview (/for/<token>, Serbian only) passes a real restaurant:
 * its name runs across the hero, its rating, hours and a map of its address replace Suton's,
 * and the Sava terrace, the river chapter and the dated events step aside.
 */
export function HomePage({ locale, biz }: { locale: Locale; biz?: Biz }) {
  const c = biz ? previewCopy(biz) : copy[locale];
  const dict = getDictionary(locale);
  const reserve = pageHref(locale, "reservations");

  return (
    <PageShell>
      <Hero
        dict={dict}
        h1={c.h1}
        eyebrow={c.eyebrow}
        sub={c.sub}
        reserveHref={reserve}
        menuHref={pageHref(locale, "menu")}
        story={{ ...c.story, href: pageHref(locale, "story") }}
        word={biz ? biz.shortName.toUpperCase() : undefined}
        tagline={biz ? (biz.tagline ?? "Hrana. Vino. Društvo.") : undefined}
      />
      <Manifesto eyebrow={c.manifesto.eyebrow} text={c.manifesto.text} pills={c.manifesto.pills} footnotes={c.manifesto.footnotes} />
      <FromTheFire
        locale={locale}
        eyebrow={c.fire.eyebrow}
        title={c.fire.title}
        intro={c.fire.intro}
        chapters={biz ? chapters.filter((ch) => ch.id !== "reka") : chapters}
        alts={chapterAlts[locale]}
        link={{ label: c.fire.link, href: pageHref(locale, "story") }}
      />
      <MenuPreview locale={locale} {...c.menu} href={pageHref(locale, "menu")} />
      <WineTeaser locale={locale} {...c.wine} href={pageHref(locale, "wine")} />
      {!biz && <RiverSunset locale={locale} {...c.river} href={reserve} />}
      <ReviewsStrip locale={locale} dict={dict} eyebrow={c.reviews.eyebrow} title={c.reviews.title} href={pageHref(locale, "reviews")} linkLabel={c.reviews.link} biz={biz} />
      {!biz && <EventsStack locale={locale} {...c.events} moreHref={pageHref(locale, "events")} />}
      <GalleryRibbon rows={c.ribbon} title={c.gallery.title} href={pageHref(locale, "gallery")} linkLabel={c.gallery.link} viewLabel={dict.cursor.view} />
      {biz && <PreviewMap biz={biz} dict={dict} />}
      <CtaBand dict={dict} reserveHref={reserve} biz={biz} />
    </PageShell>
  );
}
