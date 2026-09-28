import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { localeMeta, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dict";
import { pageHref, type PageKey } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { site } from "@/lib/site";
import { photos, type PhotoKey } from "@/content/photos";
import { graph, restaurantSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { MobileBar } from "./MobileBar";
import { DemoBadge } from "./DemoBadge";

const navImages: Record<Exclude<PageKey, "privacy">, PhotoKey> = {
  home: "room/terrace-dusk",
  menu: "dish/lamb-shank",
  wine: "wine/pour-red",
  reservations: "room/candle-flowers",
  story: "fire/grill-hands",
  producers: "prod/plums-tree",
  gallery: "chef/plating",
  events: "people/long-table-flowers",
  gifts: "wine/shadow-glass",
  reviews: "people/clink-red",
  faq: "room/bar-plants",
  contact: "river/bridge-dusk",
};

/** The <html> document shared by the Serbian and English root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  const link = (key: keyof typeof navImages): NavLink => ({
    key,
    label: dict.nav[key],
    href: pageHref(locale, key),
    image: photos[navImages[key]].src,
  });
  const primary = (["menu", "wine", "story", "events"] as const).map(link);
  const all = (Object.keys(navImages) as (keyof typeof navImages)[]).map(link);
  const address = `${site.street}, ${site.streetNote[locale]} · ${site.neighbourhood}, ${locale === "sr" ? site.city : site.cityEn}`;

  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <head>
        <JsonLd data={graph(restaurantSchema(locale, dict.brandLine), websiteSchema(locale, dict.brandLine))} />
      </head>
      <body className="theme-night min-h-screen">
        <a
          href="#main"
          className="t-eyebrow fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-candle px-5 py-3 text-night focus:translate-y-0"
        >
          {dict.skip}
        </a>
        <SmoothScroll />
        <Header
          locale={locale}
          dict={dict}
          primary={primary}
          all={all}
          homeHref={pageHref(locale, "home")}
          reserveHref={pageHref(locale, "reservations")}
          altMap={alternateMap(locale)}
          otherLocaleHome={pageHref(locale === "sr" ? "en" : "sr", "home")}
          address={address}
        />
        {children}
        <Footer locale={locale} dict={dict} />
        <MobileBar dict={dict} reserveHref={pageHref(locale, "reservations")} />
        <DemoBadge dict={dict} />
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
