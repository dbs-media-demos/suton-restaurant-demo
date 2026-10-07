import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { FromTheFire } from "@/components/sections/FromTheFire";
import { CtaBand } from "@/components/sections/CtaBand";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { chapters, chapterAlts, producers, team } from "@/content/story";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

const copy = {
  sr: {
    title: "Naša priča: šef, vatra i proizvođači",
    description: "Suton je otvoren 2019. u staroj savamalskoj magacinskoj zgradi na obali Save. Upoznajte šefa Andreja Stojkovića, sommeliera Vuka Lazića i pet porodičnih proizvođača iz Šumadije i Vojvodine.",
    eyebrow: "Naša priča",
    h1: "Počelo je od jedne vatre i jedne reke.",
    lead: "Godine 2019. uzeli smo stari magacin na Savskom pristaništu, srušili pregradne zidove, izbacili gasne ringle i ozidali ognjište od cigle. Hteli smo restoran u kom se kuva onako kako se kuvalo kod naših baka: sporo, na drvetu, sa onim što je tog jutra stiglo sa njive. Samo sa pogledom koji one nikad nisu imale.",
    team: "Ljudi iza vatre",
    fire: { eyebrow: "Iz vatre", title: "Pet stvari koje nas čine.", intro: "Filozofija kuhinje u pet poglavlja. Skrolujte kroz nju.", link: "Proizvođači" },
    timeline: "Od 2019.",
    years: [
      { y: "2019", t: "Otvaramo vrata u starom magacinu na Savi." },
      { y: "2021", t: "Terasa na reci i prvi nedeljni ručkovi uz tamburaše." },
      { y: "2023", t: "Šank kuhinje: osam mesta na metar od žara." },
      { y: "2025", t: "Vinska karta raste na 180 srpskih etiketa." },
      { y: "2026", t: "Jesenji meni i Večeri Prokupca." },
    ],
    producersTitle: "Pet porodica koje nas hrane.",
    producersLink: "Upoznajte proizvođače",
  },
  en: {
    title: "Our story: the chef, the fire and our producers",
    description: "Suton opened in 2019 in an old Savamala warehouse on the Sava riverfront. Meet Chef Andrej Stojković, sommelier Vuk Lazić and five family producers from Šumadija and Vojvodina.",
    eyebrow: "Our story",
    h1: "It started with one fire and one river.",
    lead: "In 2019 we took over an old warehouse on the Sava quay, knocked down the partition walls, threw out the gas burners and built a brick hearth. We wanted a restaurant that cooks the way our grandmothers did: slowly, over wood, with whatever came from the fields that morning. Only with a view they never had.",
    team: "The people behind the fire",
    fire: { eyebrow: "From the fire", title: "Five things that make us.", intro: "The kitchen's philosophy in five chapters. Scroll through it.", link: "Our producers" },
    timeline: "Since 2019",
    years: [
      { y: "2019", t: "We open the doors of an old warehouse on the Sava." },
      { y: "2021", t: "The river terrace and our first Sunday lunches with tamburica." },
      { y: "2023", t: "The kitchen counter: eight seats a metre from the fire." },
      { y: "2025", t: "The wine list grows to 180 Serbian labels." },
      { y: "2026", t: "The autumn menu and Prokupac Nights." },
    ],
    producersTitle: "Five families who feed us.",
    producersLink: "Meet the producers",
  },
};

export const storyMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.story, eyebrow: copy[locale].eyebrow, photo: "/images/fire/grill-hands.jpg" });

export function StoryPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.story, href: pageHref(locale, "story") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        image="poster/grill"
        video="grill"
        wide
      />

      <section className="py-[clamp(6rem,12vw,10rem)]">
        <div className="wrap">
          <ScrubWords text={c.lead} className="t-serif max-w-[30ch] text-[clamp(1.7rem,3.4vw,3.3rem)] leading-[1.2] tracking-[-0.005em]" />
        </div>
      </section>

      <section className="pb-[clamp(6rem,12vw,10rem)]" aria-labelledby="team-title">
        <div className="wrap">
          <SplitReveal id="team-title" className="t-h2">
            {c.team}
          </SplitReveal>
          <div className="mt-14 grid gap-16 md:grid-cols-2 md:gap-10">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.12} className={i === 1 ? "md:mt-40" : undefined}>
                <Parallax className={i === 0 ? "arch aspect-[4/5] bg-char" : "aspect-[4/5] rounded-[2rem] bg-char"} amount={10}>
                  <div className="absolute inset-0">
                    <Photo k={m.image} alt={`${m.name}, ${m.role[locale]}`} sizes="(min-width: 768px) 45vw, 90vw" />
                  </div>
                </Parallax>
                <p className="t-eyebrow mt-6 text-candle">{m.role[locale]}</p>
                <h3 className="t-h3 mt-2">{m.name}</h3>
                <p className="mt-3 max-w-md text-cream/80">{m.text[locale]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FromTheFire
        locale={locale}
        eyebrow={c.fire.eyebrow}
        title={c.fire.title}
        intro={c.fire.intro}
        chapters={chapters}
        alts={chapterAlts[locale]}
        link={{ label: c.fire.link, href: pageHref(locale, "producers") }}
      />

      <section className="py-[clamp(6rem,12vw,10rem)]" aria-labelledby="timeline-title">
        <div className="wrap">
          <h2 id="timeline-title" className="t-eyebrow text-candle">
            {c.timeline}
          </h2>
          <Reveal as="ol" stagger={0.1} className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-5">
            {c.years.map((y) => (
              <li key={y.y}>
                <p className="t-serif t-num text-5xl text-candle">{y.y}</p>
                <p className="mt-3 text-cream/85">{y.t}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-[clamp(6rem,12vw,10rem)]" aria-labelledby="prod-title">
        <div className="wrap flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <SplitReveal id="prod-title" className="t-h2 max-w-[14ch]">
            {c.producersTitle}
          </SplitReveal>
          <Link href={pageHref(locale, "producers")} className="link-underline w-fit shrink-0 text-candle">
            {c.producersLink} →
          </Link>
        </div>
        <Reveal as="ul" stagger={0.08} className="wrap mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {producers.map((p) => (
            <li key={p.id}>
              <Link href={`${pageHref(locale, "producers")}#${p.id}`} className="group block" data-cursor={dict.cursor.view}>
                <span className="relative block aspect-square overflow-hidden rounded-full bg-char">
                  <Photo k={p.image} alt={p.name} sizes="(min-width: 1024px) 18vw, 45vw" className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
                </span>
                <span className="t-serif mt-4 block text-xl">{p.name}</span>
                <span className="block text-sm text-smoke">
                  {p.place[locale]} · {p.region[locale]}
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>
      <CtaBand dict={dict} reserveHref={pageHref(locale, "reservations")} />
    </PageShell>
  );
}
