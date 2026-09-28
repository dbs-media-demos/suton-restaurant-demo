export const locales = ["sr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sr";

/** A value that exists in every language. */
export type Localized<T> = Record<Locale, T>;

export const localeMeta: Record<Locale, { htmlLang: string; hreflang: string; ogLocale: string; label: string; short: string }> = {
  sr: { htmlLang: "sr-Latn", hreflang: "sr", ogLocale: "sr_RS", label: "Srpski", short: "SR" },
  en: { htmlLang: "en", hreflang: "en", ogLocale: "en_US", label: "English", short: "EN" },
};

export const otherLocale = (locale: Locale): Locale => (locale === "sr" ? "en" : "sr");

/** Pick the current language from a localized value. */
export const t = <T,>(value: Localized<T>, locale: Locale): T => value[locale];
