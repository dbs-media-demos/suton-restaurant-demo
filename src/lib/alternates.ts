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
  return Object.fromEntries(allPagePairs().map((p) => [p[from], p[to]]));
}
