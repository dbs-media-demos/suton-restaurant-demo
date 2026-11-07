import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { reviews } from "@/content/reviews";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n/dict";
import { ReviewCard } from "./ReviewCard";
import type { Biz } from "@/lib/biz-core";

/** Rating summary + an endless, hover-pausable ribbon of review cards. */
export function ReviewsStrip({ locale, dict, eyebrow, title, href, linkLabel, biz }: { locale: Locale; dict: Dict; eyebrow: string; title: string; href: string; linkLabel: string; biz?: Biz }) {
  const list = biz
    ? reviews.filter((r) => r.name !== "Jelena M." && r.name !== "Thomas K.").slice(0, 6).map((r) => ({ ...r, from: { sr: biz.area, en: biz.area } }))
    : reviews.slice(0, 6);
  const rating = biz ? biz.rating : site.rating;
  // Phones read the shortest three first, so all three fit on one screen
  const byLength = [...list].sort((a, b) => a.text[locale].length - b.text[locale].length);
  return (
    <section className="relative overflow-hidden py-[clamp(6rem,12vw,11rem)] phone-later [--later-h:1048px] phone:order-5 phone:pb-6 phone:pt-6" aria-labelledby="reviews-title">
      <div className="wrap grid gap-10 md:grid-cols-[1fr_auto] md:items-end phone:grid-cols-1 phone:gap-2">
        <div>
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <SplitReveal id="reviews-title" className="t-h2 mt-6 max-w-[16ch] phone:mt-2.5 phone:max-w-none">
            {title}
          </SplitReveal>
        </div>
        {rating && (
        <Reveal className="flex items-center gap-6 phone:gap-3">
          <p className="t-serif t-num text-[clamp(4rem,8vw,7rem)] leading-none text-candle phone:text-[2.5rem]">{rating.value.toLocaleString(locale === "sr" ? "de-DE" : "en-US")}</p>
          <div>
            <Stars value={rating.value} className="text-xl text-candle phone:text-base" />
            <p className="mt-2 text-sm text-smoke phone:mt-0">
              {rating.count.toLocaleString(locale === "sr" ? "de-DE" : "en-US")} {dict.rating.reviews} {dict.rating.on}
            </p>
            <Link href={href} className="link-underline mt-2 inline-block text-sm text-cream phone:hidden">
              {linkLabel} →
            </Link>
          </div>
        </Reveal>
        )}
      </div>

      <div className="wrap mt-3 hidden phone:block">
        <ul className="space-y-2.5">
          {byLength.slice(0, 3).map((r) => (
            <li key={r.id}>
              <ReviewCard r={r} locale={locale} />
            </li>
          ))}
        </ul>
        <ul className="swipe swipe-wide mt-2.5">
          {byLength.slice(3).map((r) => (
            <li key={r.id}>
              <ReviewCard r={r} locale={locale} />
            </li>
          ))}
        </ul>
        <Link href={href} className="mt-3 inline-block text-candle">
          {linkLabel} →
        </Link>
      </div>

      <div className="group mt-16 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] phone:hidden">
        <div className="marquee gap-5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]" style={{ "--speed": "70s" } as React.CSSProperties}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 || undefined}>
              {list.map((r) => (
                <li key={r.id} className="w-[min(84vw,24rem)] shrink-0">
                  <ReviewCard r={r} locale={locale} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
