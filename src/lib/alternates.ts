import type { Locale, Localized } from "./i18n";
import { pagePaths, eventAlternates } from "./routes";
import { events } from "@/content/events";

/** Every page on the site as a pair of language versions. */
export function allPagePairs(): Localized<string>[] {
  return [...Object.values(pagePaths), ...events.map((e) => eventAlternates(e.slug))];
}

/** pathname in `from` locale → same page in the other locale (language switch). */
export function alternateMap(from: Locale): Record<string, string> {
  const to: Locale = from === "sr" ? "en" : "sr";
  // /v2, the homepage without 3D, isn't in the sitemap but switches language like the homepage
  return Object.fromEntries([...allPagePairs(), { sr: "/v2", en: "/en/v2" }].map((p) => [p[from], p[to]]));
}
