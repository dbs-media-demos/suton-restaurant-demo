import type { Locale } from "./i18n";
import { absoluteUrl, hoursRows, site, fmtTime } from "./site";
import { pageHref, eventHref } from "./routes";
import { reviews } from "@/content/reviews";
import { menu, menuSeason } from "@/content/menu";
import type { SutonEvent } from "@/content/events";
import type { Faq } from "@/content/faq";
import { photos } from "@/content/photos";

type Thing = Record<string, unknown>;

const restaurantId = absoluteUrl("/#restaurant");
const websiteId = absoluteUrl("/#website");

export const graph = (...nodes: Thing[]) => ({ "@context": "https://schema.org", "@graph": nodes });

const dietMap = { veg: "https://schema.org/VegetarianDiet", vegan: "https://schema.org/VeganDiet", gf: "https://schema.org/GlutenFreeDiet" } as const;

export function restaurantSchema(locale: Locale, description: string): Thing {
  return {
    "@type": "Restaurant",
    "@id": restaurantId,
    name: site.fullName,
    alternateName: site.name,
    description,
    url: absoluteUrl(pageHref(locale, "home")),
    telephone: site.phone,
    email: site.email,
    image: [absoluteUrl(photos["room/terrace-dusk"].src), absoluteUrl(photos["dish/lamb-shank"].src), absoluteUrl(photos["fire/grill-over-fire"].src)],
    logo: absoluteUrl("/icon.svg"),
    priceRange: site.priceRange,
    servesCuisine: site.cuisine,
    acceptsReservations: absoluteUrl(pageHref(locale, "reservations")),
    hasMenu: absoluteUrl(pageHref(locale, "menu")),
    currenciesAccepted: "RSD, EUR",
    paymentAccepted: "Cash, Credit Card, Debit Card, Apple Pay, Google Pay",
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.street}, ${site.streetNote[locale]}`,
      addressLocality: site.city,
      addressRegion: site.neighbourhood,
      postalCode: site.postalCode,
      addressCountry: site.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: { "@type": "City", name: locale === "sr" ? "Beograd" : "Belgrade" },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: locale === "sr" ? "Terasa na reci" : "River terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: locale === "sr" ? "Psi dozvoljeni na terasi" : "Dogs allowed on terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: locale === "sr" ? "Privatna sala" : "Private dining room", value: true },
    ],
    openingHoursSpecification: hoursRows.map((r) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: r.schemaDays.map((d) => `https://schema.org/${d}`),
      opens: fmtTime(r.open),
      closes: fmtTime(r.close),
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text[locale],
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
  };
}

export const websiteSchema = (locale: Locale, description: string): Thing => ({
  "@type": "WebSite",
  "@id": websiteId,
  url: absoluteUrl(pageHref(locale, "home")),
  name: site.fullName,
  description,
  inLanguage: locale === "sr" ? "sr-Latn" : "en",
  publisher: { "@id": restaurantId },
});

export function menuSchema(locale: Locale): Thing {
  return {
    "@type": "Menu",
    "@id": absoluteUrl(`${pageHref(locale, "menu")}#menu`),
    name: `${site.name} · ${menuSeason[locale]}`,
    inLanguage: locale === "sr" ? "sr-Latn" : "en",
    url: absoluteUrl(pageHref(locale, "menu")),
    hasMenuSection: menu.map((s) => ({
      "@type": "MenuSection",
      name: s.title[locale],
      description: s.note[locale],
      hasMenuItem: s.dishes.map((d) => ({
        "@type": "MenuItem",
        name: d.name[locale],
        description: d.desc[locale],
        image: absoluteUrl(photos[d.image].src),
        offers: { "@type": "Offer", price: d.price, priceCurrency: "RSD" },
        ...(d.diet.some((x) => x in dietMap)
          ? { suitableForDiet: d.diet.filter((x): x is keyof typeof dietMap => x in dietMap).map((x) => dietMap[x]) }
          : {}),
      })),
    })),
  };
}

export function eventSchema(locale: Locale, e: SutonEvent): Thing {
  return {
    "@type": "Event",
    name: e.title[locale],
    description: e.summary[locale],
    startDate: e.start,
    endDate: e.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [absoluteUrl(photos[e.image].src)],
    url: absoluteUrl(eventHref(locale, e.slug)),
    location: { "@id": restaurantId, "@type": "Restaurant", name: site.fullName, address: `${site.street}, ${site.city}` },
    organizer: { "@type": "Organization", name: site.fullName, url: absoluteUrl(pageHref(locale, "home")) },
    offers: {
      "@type": "Offer",
      price: e.price,
      priceCurrency: "RSD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(eventHref(locale, e.slug)),
      validFrom: "2026-09-01T00:00:00+02:00",
    },
    maximumAttendeeCapacity: e.seats,
  };
}

export const faqSchema = (locale: Locale, items: Faq[]): Thing => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q[locale],
    acceptedAnswer: { "@type": "Answer", text: f.a[locale] },
  })),
});

export const breadcrumbSchema = (items: { name: string; href: string }[]): Thing => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
});

export const serviceSchema = (locale: Locale, name: string, description: string, href: string): Thing => ({
  "@type": "Service",
  name,
  description,
  provider: { "@id": restaurantId },
  areaServed: { "@type": "City", name: locale === "sr" ? "Beograd" : "Belgrade" },
  url: absoluteUrl(href),
});
