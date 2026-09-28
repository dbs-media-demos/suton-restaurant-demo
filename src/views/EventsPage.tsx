import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { EventsStack } from "@/components/sections/EventsStack";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { eventSchema, graph, serviceSchema } from "@/lib/schema";
import { events } from "@/content/events";
import type { PhotoKey } from "@/content/photos";

const copy = {
  sr: {
    title: "Događaji i privatne proslave na Savi",
    description: "Vinske večere, degustacioni meni iz vatre i nedeljni ručak uz tamburaše. Privatna sala do 16, terasa do 60 i ceo restoran do 120 gostiju za rođendane, venčanja i poslovne večere.",
    eyebrow: "Događaji i proslave",
    h1: "Večeri koje se pamte, i one koje organizujete vi.",
    intro: "Pratite naše vinske večeri i degustacije ili nam prepustite vaš rođendan, veridbu ili poslovnu večeru.",
    upcoming: "Uskoro u Sutonu",
    more: "Pošaljite upit za proslavu",
    cta: "Detalji",
    spacesTitle: "Tri prostora, jedan šef.",
    spaces: [
      { t: "Privatna sala", n: "do 16 gostiju", d: "Zasebna sala sa dugim hrastovim stolom i pogledom na kuhinju kroz staklo. Za poslovne večere i porodična slavlja.", k: "people/long-table-formal" },
      { t: "Terasa na reci", n: "do 60 gostiju", d: "Ceo deo terase uz Savu, sa lampicama, grejalicama i zalaskom sunca kao dekoracijom. Od aprila do oktobra.", k: "room/terrace-night" },
      { t: "Ceo restoran", n: "do 120 gostiju", d: "Sala, šank i terasa samo za vas. Venčanja, lansiranja i velike proslave, sa DJ-em ili bendom.", k: "room/windows-night" },
    ] as { t: string; n: string; d: string; k: PhotoKey }[],
    formTitle: "Upit za proslavu",
    formText: "Javljamo se u roku od 24 sata sa predlogom menija i ponudom. Bez obaveze.",
    service: "Privatne proslave i poslovne večere",
  },
  en: {
    title: "Events & private dining on the Sava",
    description: "Wine dinners, a tasting menu from the fire and Sunday lunch with tamburica. A private room for 16, the terrace for 60 and the whole restaurant for 120 guests: birthdays, weddings and business dinners.",
    eyebrow: "Events & private dining",
    h1: "Evenings to remember, and the ones you host.",
    intro: "Join our wine dinners and tasting nights, or leave your birthday, engagement or business dinner to us.",
    upcoming: "Coming up at Suton",
    more: "Send a private dining inquiry",
    cta: "Details",
    spacesTitle: "Three spaces, one chef.",
    spaces: [
      { t: "Private room", n: "up to 16 guests", d: "A separate room with a long oak table and a glass view into the kitchen. For business dinners and family celebrations.", k: "people/long-table-formal" },
      { t: "River terrace", n: "up to 60 guests", d: "A whole section of the terrace on the Sava, with string lights, heaters and the sunset as decoration. April to October.", k: "room/terrace-night" },
      { t: "The whole restaurant", n: "up to 120 guests", d: "Dining room, bar and terrace just for you. Weddings, launches and big celebrations, with a DJ or a band.", k: "room/windows-night" },
    ] as { t: string; n: string; d: string; k: PhotoKey }[],
    formTitle: "Private dining inquiry",
    formText: "We reply within 24 hours with a suggested menu and a quote. No obligation.",
    service: "Private events and business dinners",
  },
};

export const eventsMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.events, eyebrow: copy[locale].eyebrow, photo: "/images/people/long-table-flowers.jpg" });

export function EventsPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <JsonLd data={graph(...events.map((e) => eventSchema(locale, e)), serviceSchema(locale, c.service, c.description, pageHref(locale, "events")))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.events, href: pageHref(locale, "events") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
        image="people/group-toast"
        imageAlt={locale === "sr" ? "Gosti nazdravljaju za dugim stolom" : "Guests raising a toast at a long table"}
      />
      <EventsStack locale={locale} eyebrow={c.eyebrow} title={c.upcoming} more={c.more} moreHref="#upit" cta={c.cta} />

      <section className="border-t border-line py-[clamp(6rem,12vw,10rem)]" aria-labelledby="spaces-title">
        <div className="wrap">
          <SplitReveal id="spaces-title" className="t-h2 max-w-[14ch]">
            {c.spacesTitle}
          </SplitReveal>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6">
            {c.spaces.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.1}>
                <Parallax className={i === 1 ? "arch aspect-[3/4] bg-char" : "aspect-[3/4] rounded-[1.5rem] bg-char"} amount={10}>
                  <div className="absolute inset-0">
                    <Photo k={s.k} alt={s.t} sizes="(min-width: 768px) 32vw, 90vw" />
                  </div>
                </Parallax>
                <p className="t-eyebrow mt-6 text-candle">{s.n}</p>
                <h3 className="t-h3 mt-2">{s.t}</h3>
                <p className="mt-3 text-cream/80">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="upit" className="scroll-mt-20 border-t border-line py-[clamp(6rem,12vw,10rem)]" aria-labelledby="inq-title">
        <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="t-eyebrow text-candle">{c.eyebrow}</p>
            <h2 id="inq-title" className="t-h2 mt-5">
              {c.formTitle}
            </h2>
            <p className="t-lead mt-6 max-w-md text-cream/80">{c.formText}</p>
          </div>
          <div className="rounded-[2rem] border border-line bg-char/50 p-6 sm:p-10">
            <InquiryForm locale={locale} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
