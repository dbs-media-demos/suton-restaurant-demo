import type { Locale, Localized } from "./i18n";

/** Localized URL paths. Serbian lives at the root, English under /en with English slugs. */
export const pagePaths = {
  home: { sr: "/", en: "/en" },
  menu: { sr: "/meni", en: "/en/menu" },
  wine: { sr: "/vinska-karta", en: "/en/wine-list" },
  reservations: { sr: "/rezervacije", en: "/en/reservations" },
  story: { sr: "/prica", en: "/en/our-story" },
  producers: { sr: "/prica/proizvodjaci", en: "/en/our-story/producers" },
  gallery: { sr: "/galerija", en: "/en/gallery" },
  events: { sr: "/dogadjaji", en: "/en/events" },
  gifts: { sr: "/poklon-kartice", en: "/en/gift-cards" },
  reviews: { sr: "/utisci", en: "/en/reviews" },
  faq: { sr: "/cesta-pitanja", en: "/en/faq" },
  contact: { sr: "/kontakt", en: "/en/contact" },
  privacy: { sr: "/privatnost", en: "/en/privacy" },
} satisfies Record<string, Localized<string>>;

export type PageKey = keyof typeof pagePaths;

export const pageHref = (locale: Locale, key: PageKey) => pagePaths[key][locale];

export const eventHref = (locale: Locale, slug: Localized<string>) => `${pagePaths.events[locale]}/${slug[locale]}`;

export const eventAlternates = (slug: Localized<string>): Localized<string> => ({
  sr: eventHref("sr", slug),
  en: eventHref("en", slug),
});
