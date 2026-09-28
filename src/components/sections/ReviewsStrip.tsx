import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { reviews } from "@/content/reviews";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n/dict";
import { ReviewCard } from "./ReviewCard";

/** Rating summary + an endless, hover-pausable ribbon of review cards. */
export function ReviewsStrip({ locale, dict, eyebrow, title, href, linkLabel }: { locale: Locale; dict: Dict; eyebrow: string; title: string; href: string; linkLabel: string }) {
  const list = reviews.slice(0, 6);
  return (
    <section className="relative overflow-hidden py-[clamp(6rem,12vw,11rem)]" aria-labelledby="reviews-title">
      <div className="wrap grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <SplitReveal id="reviews-title" className="t-h2 mt-6 max-w-[16ch]">
            {title}
          </SplitReveal>
        </div>
        <Reveal className="flex items-center gap-6">
          <p className="t-serif t-num text-[clamp(4rem,8vw,7rem)] leading-none text-candle">{site.rating.value.toLocaleString(locale === "sr" ? "de-DE" : "en-US")}</p>
          <div>
            <Stars value={site.rating.value} className="text-xl text-candle" />
            <p className="mt-2 text-sm text-smoke">
              {site.rating.count.toLocaleString(locale === "sr" ? "de-DE" : "en-US")} {dict.rating.reviews} {dict.rating.on}
            </p>
            <Link href={href} className="link-underline mt-2 inline-block text-sm text-cream">
              {linkLabel} →
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="group mt-16 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
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
