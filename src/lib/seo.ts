import type { Metadata } from "next";
import { localeMeta, type Locale, type Localized } from "./i18n";
import { site } from "./site";

type BuildMetadataInput = {
  locale: Locale;
  /** Page title without the brand suffix (the root template adds "| Suton"). */
  title: string;
  description: string;
  /** Both language versions of this page. */
  alternates: Localized<string>;
  /** Short label above the title on the generated share image. */
  eyebrow?: string;
  /** Use the full title as-is (home page). */
  absoluteTitle?: boolean;
  /** Photo path for the share image background. */
  photo?: string;
};

export const ogImageUrl = (title: string, eyebrow?: string, locale: Locale = "sr", photo?: string) => {
  const params = new URLSearchParams({ title, locale });
  if (eyebrow) params.set("eyebrow", eyebrow);
  if (photo) params.set("photo", photo);
  return `/api/og?${params.toString()}`;
};

export function buildMetadata({ locale, title, description, alternates, eyebrow, absoluteTitle, photo }: BuildMetadataInput): Metadata {
  const canonical = alternates[locale];
  const og = ogImageUrl(title, eyebrow, locale, photo);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        [localeMeta.sr.hreflang]: alternates.sr,
        [localeMeta.en.hreflang]: alternates.en,
        "x-default": alternates.sr,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.fullName,
      title: fullTitle,
      description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: [localeMeta[locale === "sr" ? "en" : "sr"].ogLocale],
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og],
    },
  };
}
