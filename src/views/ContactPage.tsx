import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { CityMap } from "@/components/sections/CityMap";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { fmtTime, hoursRows, site, terraceSeason } from "@/lib/site";

const copy = {
  sr: {
    title: "Kontakt: adresa, radno vreme i parking u Savamali",
    description: "Suton, Karađorđeva bb, Savsko pristanište, Savamala, Beograd. Radno vreme, kuhinja, parking, dolazak javnim prevozom i kontakt forma.",
    eyebrow: "Kontakt",
    h1: "Na Savi, ispod Brankovog mosta.",
    intro: "Pet minuta hoda od Zelenog venca i Kalemegdana, na samoj obali.",
    getting: "Kako do nas",
    ways: [
      { t: "Peške", d: "Od Trga Republike 12 minuta, niz Karađorđevu ulicu prema Savi." },
      { t: "Javni prevoz", d: "Tramvaji 2, 11 i 13 i autobusi 37 i 58 do stanice „Savski trg“, pa 4 minuta pešice." },
      { t: "Automobilom", d: "Garaža „Obilićev venac“ (10 min hoda) ili parking na Savskom pristaništu, zona 3. Posle 21h preporučujemo taksi." },
      { t: "Bicikl i trotinet", d: "Stalak za bicikle je ispred ulaza, a staza uz Savu vodi do samih vrata." },
    ],
    maps: "Otvori u Google mapama",
    write: "Pišite nam",
    mapLabels: { sava: "SAVA", danube: "DUNAV", fortress: "KALEMEGDAN", newBelgrade: "NOVI BEOGRAD", oldTown: "STARI GRAD", savamala: "SAVAMALA", bridge: "Brankov most", station: "Savski trg", label: "Stilizovana mapa centra Beograda sa lokacijom Sutona u Savamali" },
  },
  en: {
    title: "Contact: address, hours and parking in Savamala",
    description: "Suton, Karađorđeva bb, Sava river quay, Savamala, Belgrade. Opening hours, kitchen hours, parking, public transport and a contact form.",
    eyebrow: "Contact",
    h1: "On the Sava, below Branko's Bridge.",
    intro: "A five-minute walk from Zeleni Venac and Kalemegdan, right on the riverbank.",
    getting: "Getting here",
    ways: [
      { t: "On foot", d: "12 minutes from Republic Square, down Karađorđeva Street towards the Sava." },
      { t: "Public transport", d: "Trams 2, 11 and 13 and buses 37 and 58 to “Savski trg”, then a 4-minute walk." },
      { t: "By car", d: "Obilićev Venac garage (10-minute walk) or the Sava quay car park, zone 3. After 9 pm we recommend a taxi." },
      { t: "Bike or scooter", d: "There's a bike rack by the entrance, and the Sava riverside path leads right to the door." },
    ],
    maps: "Open in Google Maps",
    write: "Write to us",
    mapLabels: { sava: "SAVA", danube: "DANUBE", fortress: "KALEMEGDAN", newBelgrade: "NEW BELGRADE", oldTown: "OLD TOWN", savamala: "SAVAMALA", bridge: "Branko's Bridge", station: "Savski trg", label: "Stylised map of central Belgrade showing Suton in Savamala" },
  },
};

export const contactMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.contact, eyebrow: copy[locale].eyebrow, photo: "/images/river/bridge-dusk.jpg" });

export function ContactPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
          { name: dict.nav.contact, href: pageHref(locale, "contact") },
        ]}
        crumbLabel={dict.breadcrumbHome}
        eyebrow={c.eyebrow}
        title={c.h1}
        intro={c.intro}
      />

      <section className="pb-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-line bg-char/60 p-4 text-cream sm:p-6">
            <CityMap labels={c.mapLabels} />
            <a
              href="https://www.google.com/maps/search/?api=1&query=Savamala%2C+Beograd"
              target="_blank"
              rel="noopener"
              className="link-underline mt-3 inline-block px-2 text-sm text-candle"
            >
              {c.maps} ↗
            </a>
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="t-eyebrow text-candle">{dict.address}</h2>
              <address className="t-serif mt-4 text-2xl not-italic leading-snug">
                {site.street}
                <br />
                {site.streetNote[locale]}, {site.neighbourhood}
                <br />
                {site.postalCode} {locale === "sr" ? site.city : site.cityEn}
              </address>
              <p className="mt-4 flex flex-col gap-1">
                <a href={`tel:${site.phone}`} className="link-underline w-fit text-cream">
                  {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="link-underline w-fit text-cream/85">
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <h2 className="t-eyebrow text-candle">{dict.hours}</h2>
              <OpenBadge dict={dict} className="mt-4 text-cream" />
              <dl className="t-num mt-4 space-y-2">
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
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-[clamp(5rem,10vw,8rem)]" aria-labelledby="getting-title">
        <div className="wrap">
          <h2 id="getting-title" className="t-h2">
            {c.getting}
          </h2>
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.ways.map((w, i) => (
              <li key={w.t} className="border-t border-line pt-6">
                <p className="t-eyebrow t-num text-candle">0{i + 1}</p>
                <h3 className="t-h3 mt-3">{w.t}</h3>
                <p className="mt-3 text-cream/80">{w.d}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-[clamp(5rem,10vw,8rem)]" aria-labelledby="write-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="write-title" className="t-h2">
            {c.write}
          </h2>
          <div className="rounded-[2rem] border border-line bg-char/50 p-6 sm:p-10">
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
