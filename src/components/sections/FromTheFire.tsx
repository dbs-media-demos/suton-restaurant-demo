"use client";

import { useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useDesktopGSAP, prefersReducedMotion } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { VideoLoop } from "@/components/ui/VideoLoop";
import type { Chapter } from "@/content/story";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  chapters: Chapter[];
  alts: Record<string, [string, string]>;
  link: { label: string; href: string };
};

/**
 * "Iz vatre / From the fire": a pinned horizontal journey through the kitchen philosophy.
 * Desktop scrolls sideways with layered parallax photos; phones swipe through the same chapters.
 */
export function FromTheFire({ locale, eyebrow, title, intro, chapters, alts, link }: Props) {
  const root = useRef<HTMLElement>(null);

  useDesktopGSAP(
    ({ gsap }) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });

        el.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
          const back = panel.querySelector("[data-back]");
          const front = panel.querySelector("[data-front]");
          const words = panel.querySelector("[data-num]");
          const st = { containerAnimation: scroll, trigger: panel, start: "left right", end: "right left", scrub: true };
          if (back) gsap.fromTo(back, { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: st });
          if (front) gsap.fromTo(front, { xPercent: 45, yPercent: 8 }, { xPercent: -35, yPercent: -6, ease: "none", scrollTrigger: st });
          if (words) gsap.fromTo(words, { xPercent: 60 }, { xPercent: -60, ease: "none", scrollTrigger: st });
          const text = panel.querySelector("[data-text]");
          if (text)
            gsap.fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { containerAnimation: scroll, trigger: panel, start: "left 70%", end: "left 25%", scrub: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-night md:h-[100svh] phone:order-[8] phone:h-auto phone:py-8" aria-labelledby="fire-title">
      <div className="wrap hidden phone:block">
        <p className="t-eyebrow text-candle">{eyebrow}</p>
        <h2 className="t-h2 mt-3">{title}</h2>
        <p className="mt-3 text-smoke">{intro}</p>
        <Link href={link.href} className="mt-2 inline-block text-candle">
          {link.label} →
        </Link>
        <ul className="swipe swipe-wide mt-5">
          {chapters.map((c) => (
            <li key={c.id} className="overflow-hidden rounded-[1.25rem] border border-line bg-char">
              <div className="relative aspect-[3/2]">
                <Photo k={c.images[0]} alt={alts[c.id][0]} sizes="min(78vw, 22rem)" quality={60} />
                <div className="absolute -bottom-5 right-3 aspect-square w-[5.5rem] overflow-hidden rounded-xl border-4 border-char">
                  <Photo k={c.images[1]} alt={alts[c.id][1]} sizes="5.5rem" quality={60} />
                </div>
              </div>
              <div className="p-4 pt-3">
                <p className="t-eyebrow t-num text-candle">
                  {c.n} / {String(chapters.length).padStart(2, "0")}
                </p>
                <h3 className="t-serif mt-2 text-[1.6rem] italic leading-none">{c.title[locale]}</h3>
                <p className="mt-2 text-[0.92rem] leading-snug text-cream/85">{c.text[locale]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div data-track className="flex flex-col md:h-full md:w-max md:flex-row md:items-stretch phone:hidden">
        {/* Intro panel */}
        <div className="wrap flex shrink-0 flex-col justify-center py-24 md:w-[min(46rem,52vw)] md:py-0 md:pr-16">
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <h2 id="fire-title" className="t-h1 mt-6">
            {title}
          </h2>
          <p className="t-lead mt-8 max-w-md text-smoke">{intro}</p>
          <Link href={link.href} className="link-underline mt-8 w-fit text-candle">
            {link.label} →
          </Link>
          <p className="t-eyebrow mt-14 hidden items-center gap-3 text-smoke md:flex" aria-hidden>
            <span className="h-px w-10 bg-smoke/50" /> {locale === "sr" ? "Skrolujte" : "Scroll"}
          </p>
        </div>

        {chapters.map((c, i) => (
          <article
            key={c.id}
            data-panel
            className={clsx(
              "relative flex shrink-0 flex-col overflow-hidden border-line px-[var(--gutter)] pb-20 pt-6 md:h-full md:w-[min(92rem,88vw)] md:flex-row md:items-center md:gap-[4vw] md:border-l md:px-[4vw] md:py-0",
            )}
            aria-labelledby={`ch-${c.id}`}
          >
            <span
              data-num
              data-word={c.n}
              className="deco-word t-serif pointer-events-none absolute -top-6 right-0 select-none text-[34vw] leading-none text-cream/[0.035] md:right-auto md:top-auto md:left-[8vw] md:text-[30vw]"
              aria-hidden
            />

            <div className="relative aspect-[4/5] w-full md:aspect-auto md:h-[72svh] md:w-[42%]">
              <div data-back className={clsx("absolute inset-0 overflow-hidden bg-char", i % 2 === 0 ? "arch" : "rounded-[1.25rem]")}>
                {c.video ? (
                  <VideoLoop name={c.video} poster={`poster/${c.video}` as "poster/embers"} sizes="(min-width: 768px) 40vw, 90vw" />
                ) : (
                  <Photo k={c.images[0]} alt={alts[c.id][0]} sizes="(min-width: 768px) 40vw, 90vw" />
                )}
              </div>
              <div
                data-front
                className={clsx(
                  "absolute -bottom-8 aspect-[3/4] w-[46%] overflow-hidden rounded-[1rem] border-[6px] border-night shadow-2xl md:-bottom-10 md:w-[44%]",
                  i % 2 === 0 ? "-right-4 md:-right-[18%]" : "-left-4 md:-left-[16%]",
                )}
              >
                <Photo k={c.images[1]} alt={alts[c.id][1]} sizes="(min-width: 768px) 20vw, 45vw" />
              </div>
            </div>

            <div data-text className="relative mt-16 max-w-md md:mt-0 md:ml-[8%]">
              <p className="t-eyebrow t-num text-candle">
                {c.n} / {String(chapters.length).padStart(2, "0")}
              </p>
              <h3 id={`ch-${c.id}`} className="t-h1 mt-4 italic">
                {c.title[locale]}
              </h3>
              <p className="t-lead mt-6 text-cream/85">{c.text[locale]}</p>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 md:block" aria-hidden />
      </div>

      <div className="wrap pointer-events-none absolute inset-x-0 bottom-8 hidden md:block phone:hidden" aria-hidden>
        <div className="h-px w-full bg-cream/15">
          <div data-progress className="h-px origin-left scale-x-0 bg-candle" />
        </div>
      </div>
    </section>
  );
}
