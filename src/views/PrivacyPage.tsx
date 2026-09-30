import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDictionary } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const copy = {
  sr: {
    title: "Politika privatnosti",
    description: "Kako Suton prikuplja i koristi podatke iz rezervacija, upita, poklon kartica i newslettera.",
    updated: "Poslednja izmena: 28. septembar 2026.",
    note: "Ovo je koncept sajt koji je izradio Scale by Noon. Suton je izmišljen restoran i nijedna forma na ovom sajtu ne šalje niti čuva podatke.",
    sections: [
      { h: "Ko smo", p: `${site.fullName}, ${site.street}, ${site.city}. Za sva pitanja o privatnosti pišite na ${site.email}.` },
      { h: "Koje podatke prikupljamo", p: "Ime, telefon i email kada rezervišete sto, šaljete upit ili kupujete poklon karticu, kao i posebne napomene koje sami unesete (npr. alergije). Za newsletter čuvamo samo email adresu." },
      { h: "Zašto ih koristimo", p: "Da potvrdimo i upravljamo vašom rezervacijom, da odgovorimo na upit, da izdamo poklon karticu i, ako ste se prijavili, da vam jednom mesečno pošaljemo pismo. Podatke ne prodajemo i ne delimo u marketinške svrhe." },
      { h: "Koliko dugo ih čuvamo", p: "Podatke o rezervacijama čuvamo 12 meseci, podatke o poklon karticama do isteka kartice i godinu dana nakon toga, a email za newsletter dok se ne odjavite." },
      { h: "Kolačići", p: "Sajt koristi samo neophodno lokalno skladište (npr. da zapamti da ste sakrili oznaku koncept sajta). Ne koristimo kolačiće za praćenje ni oglašavanje." },
      { h: "Vaša prava", p: "U skladu sa Zakonom o zaštiti podataka o ličnosti imate pravo na pristup, ispravku, brisanje i prenos podataka, kao i pravo na prigovor Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti." },
    ],
  },
  en: {
    title: "Privacy policy",
    description: "How Suton collects and uses data from bookings, inquiries, gift cards and the newsletter.",
    updated: "Last updated: 28 September 2026.",
    note: "This is a concept site created by Scale by Noon. Suton is a fictional restaurant and no form on this site sends or stores any data.",
    sections: [
      { h: "Who we are", p: `${site.fullName}, ${site.street}, ${site.cityEn}. For any privacy question, email ${site.email}.` },
      { h: "What we collect", p: "Your name, phone and email when you book a table, send an inquiry or buy a gift card, plus any notes you add yourself (e.g. allergies). For the newsletter we keep only your email address." },
      { h: "Why we use it", p: "To confirm and manage your booking, answer your inquiry, issue your gift card and, if you subscribed, send you one letter a month. We never sell your data or share it for marketing." },
      { h: "How long we keep it", p: "Booking data for 12 months, gift card data until the card expires plus one year, and newsletter emails until you unsubscribe." },
      { h: "Cookies", p: "The site only uses essential local storage (e.g. to remember that you hid the concept-site label). We use no tracking or advertising cookies." },
      { h: "Your rights", p: "Under Serbian data protection law (and the GDPR for EU visitors) you have the right to access, correct, delete and port your data, and to complain to the Commissioner for Information of Public Importance and Personal Data Protection." },
    ],
  },
};

export const privacyMetadata = (locale: Locale): Metadata =>
  buildMetadata({ locale, title: copy[locale].title, description: copy[locale].description, alternates: pagePaths.privacy });

export function PrivacyPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const dict = getDictionary(locale);
  return (
    <PageShell>
      <article className="wrap max-w-3xl pb-28 pt-[calc(var(--header-h)+2.5rem)]">
        <Breadcrumbs
          items={[
            { name: dict.breadcrumbHome, href: pageHref(locale, "home") },
            { name: dict.nav.privacy, href: pageHref(locale, "privacy") },
          ]}
          label={dict.breadcrumbHome}
        />
        <h1 className="t-h1 anim-heading mt-12">{c.title}</h1>
        <p className="mt-6 text-smoke">{c.updated}</p>
        <p className="mt-8 rounded-2xl border border-candle/40 bg-candle/10 p-5 text-cream/90">{c.note}</p>
        <div className="mt-12 space-y-10">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="t-h3">{s.h}</h2>
              <p className="mt-3 text-cream/85">{s.p}</p>
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
