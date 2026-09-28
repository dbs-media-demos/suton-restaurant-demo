import Link from "next/link";
import type { Dict } from "@/i18n/dict";
import type { Locale } from "@/lib/i18n";
import { pageHref, type PageKey } from "@/lib/routes";
import { fmtTime, hoursRows, site, terraceSeason } from "@/lib/site";
import { Newsletter } from "@/components/forms/Newsletter";
import { OpenBadge } from "./OpenBadge";
import { FooterSunset } from "./FooterSunset";

const exploreKeys: PageKey[] = ["menu", "wine", "reservations", "story", "producers", "gallery", "events", "gifts", "reviews", "faq", "contact"];

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <footer className="theme-night relative border-t border-line pb-28 md:pb-6">
      <div className="wrap grid gap-14 pt-20 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="t-eyebrow text-candle">{dict.footer.news}</p>
          <p className="t-h3 mt-5 max-w-md">{dict.footer.newsText}</p>
          <div className="mt-8 max-w-md">
            <Newsletter dict={dict} />
          </div>
        </div>

        <nav aria-label={dict.footer.explore} className="md:col-span-3 md:col-start-7">
          <p className="t-eyebrow text-smoke">{dict.footer.explore}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
            {exploreKeys.map((k) => (
              <li key={k}>
                <Link href={pageHref(locale, k)} className="link-underline text-cream/85 hover:text-cream">
                  {dict.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="t-eyebrow text-smoke">{dict.footer.visit}</p>
          <address className="mt-5 not-italic leading-relaxed text-cream/85">
            {site.street}
            <br />
            {site.streetNote[locale]}, {site.neighbourhood}
            <br />
            {site.postalCode} {locale === "sr" ? site.city : site.cityEn}
          </address>
          <p className="mt-4 flex flex-col gap-1">
            <a href={`tel:${site.phone}`} className="link-underline w-fit text-cream">
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="link-underline w-fit text-cream/85">
              {site.email}
            </a>
          </p>
          <div className="mt-6">
            <OpenBadge dict={dict} detail={false} className="text-cream" />
            <dl className="t-num mt-3 space-y-1 text-sm text-smoke">
              {hoursRows.map((r) => (
                <div key={r.days.en} className="flex justify-between gap-4">
                  <dt>{r.days[locale]}</dt>
                  <dd>
                    {fmtTime(r.open)}–{fmtTime(r.close)}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-1">
                <dt>{dict.terrace}</dt>
                <dd>{terraceSeason[locale]}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <FooterSunset />

      <div className="wrap flex flex-col gap-3 border-t border-line pt-6 text-xs text-smoke md:flex-row md:items-center md:justify-between">
        <p>
          © 2026 {site.fullName}. {dict.footer.demo}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={pageHref(locale, "privacy")} className="link-underline">
            {dict.nav.privacy}
          </Link>
          <a href={site.agencyUrl} target="_blank" rel="noopener" className="link-underline text-cream/85">
            {dict.footer.credit} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
