"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Magnetic } from "@/components/ui/Magnetic";
import type { Dict } from "@/i18n/dict";

type Props = {
  dict: Dict;
  h1: string;
  eyebrow: string;
  sub: string;
  reserveHref: string;
  menuHref: string;
  story: { label: string; title: string; text: string; link: string; href: string; aside: string };
  /** A preview's name and tagline instead of SUTON and the house tagline. */
  word?: string;
  tagline?: string;
};

const WORD = "SUTON";

/**
 * Cinematic hero: a full-screen film with a letter-by-letter title (CSS-only, fast LCP).
 * On scroll the film shrinks into the Suton arch while the story opens around it.
 */
export function Hero({ dict, h1, eyebrow, sub, reserveHref, menuHref, story, word = WORD, tagline }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const frame = el.querySelector<HTMLElement>("[data-frame]")!;
      const reduce = prefersReducedMotion();

      // Arch geometry, recalculated on resize.
      const arch = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw < 768;
        const w = mobile ? vw * 0.62 : Math.min(vw * 0.3, 470);
        const h = mobile ? vh * 0.46 : Math.min(vh * 0.74, w * 1.55);
        const x = (vw - w) / 2;
        const top = mobile ? vh * 0.3 : (vh - h) / 2 + vh * 0.03;
        const bottom = vh - top - h;
        // Park the text ring around the arch's semicircle.
        el.style.setProperty("--ring", `${w + 96}px`);
        el.style.setProperty("--ring-y", `${top + w / 2}px`);
        return `inset(${top}px ${x}px ${bottom}px ${x}px round ${w / 2}px ${w / 2}px 18px 18px)`;
      };
      const full = () => "inset(0px 0px 0px 0px round 0px 0px 0px 0px)";

      if (reduce) {
        // No motion: swap between the two states instantly as you scroll past the midpoint.
        let storyOn = false;
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const on = self.progress > 0.3;
            if (on === storyOn) return;
            storyOn = on;
            gsap.set(frame, { clipPath: on ? arch() : full() });
            gsap.set("[data-title]", { autoAlpha: on ? 0 : 1 });
            gsap.set("[data-shade]", { opacity: on ? 0 : 1 });
            gsap.set("[data-story], [data-ring]", { opacity: on ? 1 : 0, y: 0 });
          },
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      tl.fromTo(frame, { clipPath: full }, { clipPath: arch, duration: 1, ease: "power2.inOut" }, 0)
        .fromTo("[data-film]", { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .to("[data-title]", { yPercent: -18, opacity: 0, duration: 0.45 }, 0)
        .to("[data-shade]", { opacity: 0, duration: 0.6 }, 0.2)
        .fromTo("[data-story]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0.55)
        .fromTo("[data-ring]", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.6)
        .to({}, { duration: 0.5 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[260svh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Rotating ring of text around the arch (appears with the story). */}
        <div data-ring className="pointer-events-none absolute left-1/2 top-[var(--ring-y,40%)] hidden aspect-square w-[var(--ring,32rem)] -translate-x-1/2 -translate-y-1/2 opacity-0 md:block" aria-hidden>
          <svg viewBox="0 0 400 400" className="h-full w-full animate-[spin_60s_linear_infinite] text-smoke/40">
            <defs>
              <path id="ring" d="M200,200 m-188,0 a188,188 0 1,1 376,0 a188,188 0 1,1 -376,0" />
            </defs>
            <text className="t-eyebrow" fontSize="9" letterSpacing="5.2" fill="currentColor">
              <textPath href="#ring">{story.aside}</textPath>
            </text>
          </svg>
        </div>

        <div data-frame className="absolute inset-0 will-change-[clip-path]">
          <div data-film className="absolute inset-0">
            <VideoLoop name="hero" poster="poster/hero" sizes="100vw" eager preloadPoster className="anim-zoom" />
          </div>
          <div data-shade className="vignette absolute inset-0" />
        </div>

        <div data-title className="wrap relative z-[2] flex h-full flex-col justify-end pb-[max(7rem,14svh)] md:pb-16">
          <p className="t-eyebrow anim-fade text-cream/85" style={{ "--d": "0.2s" } as React.CSSProperties}>
            {eyebrow}
          </p>
          <h1 id="hero-title" className="t-display mt-4 text-cream">
            <span className="sr-only">{h1}</span>
            <span
              aria-hidden
              className="flex flex-wrap"
              // Long names step down so they still fit across the screen (letter-spacing is re-set: the h1's is computed at its own size)
              style={word.length > 7 ? { fontSize: `clamp(2.6rem, ${Math.max(5, 64 / word.length)}vw, 10rem)`, letterSpacing: "-0.02em" } : undefined}
            >
              {word.split("").map((ch, i) => (
                <span key={i} className="anim-letter" style={{ "--i": i, "--d": "0.15s" } as React.CSSProperties}>
                  {ch === " " ? "\u00a0" : ch}
                </span>
              ))}
            </span>
          </h1>
          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div className="anim-fade max-w-md" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <p className="t-serif text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-tight text-candle">{tagline ?? dict.tagline}</p>
              <p className="mt-3 text-cream/85">{sub}</p>
            </div>
            <div className="anim-fade flex flex-wrap items-center gap-3" style={{ "--d": "0.9s" } as React.CSSProperties}>
              <Magnetic>
                <Link href={reserveHref} className="inline-flex h-13 min-h-12 items-center rounded-full bg-candle px-7 font-medium text-night transition-colors hover:bg-candle-2">
                  {dict.reserve}
                </Link>
              </Magnetic>
              <Link href={menuHref} className="inline-flex h-13 min-h-12 items-center rounded-full border border-cream/35 px-7 text-cream backdrop-blur-sm transition-colors hover:border-cream">
                {dict.viewMenu}
              </Link>
            </div>
          </div>
          <div className="anim-fade mt-8 hidden items-center justify-between border-t border-cream/15 pt-5 text-cream/80 md:flex" style={{ "--d": "1.1s" } as React.CSSProperties}>
            <OpenBadge dict={dict} />
            <span className="t-eyebrow flex items-center gap-3">
              <span className="relative block h-8 w-px overflow-hidden bg-cream/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out-quart)_infinite] bg-candle" />
              </span>
              {story.label}
            </span>
          </div>
        </div>

        {/* Story that opens around the arch. */}
        <div className="wrap pointer-events-none absolute inset-0 z-[3] grid grid-rows-[auto_1fr_auto] pb-[6.5rem] pt-[calc(var(--header-h)+1rem)] md:grid-cols-[1fr_min(30vw,470px)_1fr] md:grid-rows-1 md:items-center md:gap-10 md:pb-0 md:pt-0">
          <div data-story className="pointer-events-auto opacity-0 md:pr-4">
            <p className="t-eyebrow text-candle">{story.label}</p>
            <h2 className="t-h2 mt-3 max-w-[12ch] text-[clamp(2rem,4.2vw,4.4rem)]">{story.title}</h2>
          </div>
          <div className="md:hidden" />
          <div data-story className="pointer-events-auto max-w-sm opacity-0 md:col-start-3 md:justify-self-end">
            <p className="text-[0.98rem] text-cream/85 md:text-[1.05rem]">{story.text}</p>
            <Link href={story.href} className="link-underline mt-4 inline-block text-candle">
              {story.link} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
