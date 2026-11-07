"use client";

import { useRef } from "react";
import Link from "next/link";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { events } from "@/content/events";
import { formatRsd } from "@/content/menu";
import { eventHref } from "@/lib/routes";
import type { Locale } from "@/lib/i18n";

/** Sticky stacking event cards: each one settles and dims as the next slides over it. */
export function EventsStack({ locale, eyebrow, title, more, moreHref, cta }: { locale: Locale; eyebrow: string; title: string; more: string; moreHref: string; cta: string }) {
  const root = useRef<HTMLElement>(null);

  useDesktopGSAP(
    ({ gsap }) => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const inner = card.querySelector("[data-inner]");
        const shade = card.querySelector("[data-dim]");
        const st = { trigger: cards[i + 1], start: "top bottom", end: "top 18%", scrub: true };
        gsap.fromTo(inner, { scale: 1 }, { scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.fromTo(shade, { opacity: 0 }, { opacity: 0.6, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-[clamp(6rem,12vw,11rem)] phone-later [--later-h:691px] phone:order-[11] phone:py-8" aria-labelledby="events-title">
      <div className="wrap mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between phone:mb-4 phone:flex-col phone:items-start phone:gap-2">
        <div>
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <h2 id="events-title" className="t-h1 mt-6 max-w-[12ch] phone:mt-2.5 phone:max-w-none">
            {title}
          </h2>
        </div>
        <Link href={moreHref} className="link-underline w-fit text-candle">
          {more} →
        </Link>
      </div>
      <ol className="wrap swipe swipe-wide swipe-flush">
        {events.map((e, i) => (
          <li key={e.id} data-card className="events-card sticky mb-8 phone:static phone:mb-0" style={{ top: `calc(var(--header-h) + ${1 + i * 1.25}rem)` }}>
            <div data-inner className="relative origin-top overflow-hidden phone:h-full rounded-[2rem] border border-line bg-char will-change-transform phone:rounded-[1.25rem] phone:will-change-auto">
              <div className="grid md:grid-cols-[1.1fr_1fr] phone:flex phone:h-full phone:flex-col">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[32rem] phone:aspect-[3/2] phone:min-h-0">
                  <Photo k={e.image} alt={e.title[locale]} sizes="(hover: none) min(78vw, 22rem), (pointer: coarse) min(78vw, 22rem), (min-width: 768px) 55vw, min(78vw, 22rem)" />
                </div>
                <div className="flex flex-col justify-between gap-10 p-8 md:p-12 phone:flex-1 phone:gap-3 phone:p-4">
                  <div>
                    <p className="t-eyebrow t-num text-candle phone:text-[0.66rem]! phone:tracking-[0.16em]!">
                      0{i + 1} · {e.kicker[locale]}
                    </p>
                    <h3 className="t-h2 mt-5 text-[clamp(2rem,3.6vw,3.6rem)] phone:mt-2 phone:text-[1.5rem]!">{e.title[locale]}</h3>
                    <p className="mt-5 max-w-md text-smoke phone:mt-2 phone:text-[0.92rem] phone:leading-snug">{e.summary[locale]}</p>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6 phone:gap-3 phone:pt-3">
                    <div>
                      <p className="text-cream phone:text-[0.92rem] phone:leading-snug">{e.when[locale]}</p>
                      <p className="t-num mt-1 text-sm text-smoke">
                        {formatRsd(e.price, locale)} {e.priceNote[locale]}
                      </p>
                    </div>
                    <Link href={eventHref(locale, e.slug)} className="inline-flex h-12 items-center rounded-full border border-cream/30 px-6 text-cream transition-colors hover:border-candle hover:text-candle phone:h-11 phone:px-5" aria-label={`${cta}: ${e.title[locale]}`}>
                      {cta} →
                    </Link>
                  </div>
                </div>
              </div>
              <div data-dim className="pointer-events-none absolute inset-0 bg-night opacity-0" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
