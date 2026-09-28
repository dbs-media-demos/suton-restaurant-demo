import type { Metadata, Viewport } from "next";
import { noindex, site, siteUrl } from "./site";
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n/dict";

export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.fullName, template: `%s | ${site.name}` },
    description: dict.brandLine,
    applicationName: site.fullName,
    authors: [{ name: "DBS Media", url: site.agencyUrl }],
    creator: "DBS Media",
    publisher: site.fullName,
    category: "Restaurant",
    formatDetection: { telephone: false, email: false, address: false },
    // Concept site: kept out of search engines unless NEXT_PUBLIC_NOINDEX=false.
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    other: {
      "geo.region": "RS-00",
      "geo.placename": locale === "sr" ? "Beograd" : "Belgrade",
      "geo.position": `${site.geo.lat};${site.geo.lng}`,
    },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#0e0c0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
