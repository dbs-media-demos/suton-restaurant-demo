import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { pagePaths, eventAlternates, type PageKey } from "@/lib/routes";
import { events } from "@/content/events";
import type { Localized } from "@/lib/i18n";

// Bump when page content changes meaningfully.
const SITE_UPDATED = new Date("2026-09-28");

type Entry = { pair: Localized<string>; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

const priority: Partial<Record<PageKey, number>> = { home: 1, menu: 0.9, reservations: 0.9, wine: 0.8, events: 0.8, contact: 0.8, privacy: 0.2 };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...(Object.entries(pagePaths) as [PageKey, Localized<string>][]).map(([key, pair]) => ({
      pair,
      priority: priority[key] ?? 0.6,
      changeFrequency: (["home", "menu", "events"].includes(key) ? "weekly" : "monthly") as Entry["changeFrequency"],
    })),
    ...events.map((e) => ({ pair: eventAlternates(e.slug), priority: 0.7, changeFrequency: "weekly" as const })),
  ];

  // One <url> per language version, each listing all alternates (hreflang).
  return entries.flatMap(({ pair, priority, changeFrequency }) =>
    (["sr", "en"] as const).map((locale) => ({
      url: absoluteUrl(pair[locale]),
      lastModified: SITE_UPDATED,
      changeFrequency,
      priority: locale === "sr" ? priority : Math.max(0.1, +(priority - 0.1).toFixed(1)),
      alternates: { languages: { sr: absoluteUrl(pair.sr), en: absoluteUrl(pair.en), "x-default": absoluteUrl(pair.sr) } },
    })),
  );
}
