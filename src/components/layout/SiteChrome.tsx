import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dict";
import { pageHref, type PageKey } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { site } from "@/lib/site";
import { photos, type PhotoKey } from "@/content/photos";
import { graph, restaurantSchema, websiteSchema } from "@/lib/schema";
import type { Biz } from "@/lib/biz-core";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
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

/**
 * Header, the page, footer, the phone bar and the demo badge. Client parts read the business
 * from BizProvider; a personalised preview also passes `biz` for the server-rendered footer.
 */
export function SiteChrome({ locale, biz, children }: { locale: Locale; biz?: Biz; children: ReactNode }) {
  const dict = getDictionary(locale);
  const link = (key: keyof typeof navImages): NavLink => ({
    key,
    label: dict.nav[key],
    href: pageHref(locale, key),
    image: photos[navImages[key]].src,
  });
  const primary = (["menu", "wine", "story", "events"] as const).map(link);
  const all = (Object.keys(navImages) as (keyof typeof navImages)[]).map(link);
  const address = biz ? biz.address.full : `${site.street}, ${site.streetNote[locale]} · ${site.neighbourhood}, ${locale === "sr" ? site.city : site.cityEn}`;

  return (
    <>
      {!biz && <JsonLd data={graph(restaurantSchema(locale, dict.brandLine), websiteSchema(locale, dict.brandLine))} />}
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
      <Footer locale={locale} dict={dict} biz={biz} />
      <MobileBar dict={dict} reserveHref={pageHref(locale, "reservations")} />
      <DemoBadge dict={dict} />
    </>
  );
}
