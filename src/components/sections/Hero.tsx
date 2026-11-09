"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDesktopGSAP, prefersReducedMotion, PHONE, DESKTOP } from "@/lib/motion";
import { inTurn, keepStills, readyFor3D, STILL_EVENT, wait, watchFrames } from "@/lib/live3d";
import type { CounterHandle } from "@/components/fx/counterScene";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Magnetic } from "@/components/ui/Magnetic";
import { Stars } from "@/components/ui/Stars";
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
  /** The phone's first screen: service + town, rating, today's hours and the number to call. */
  phone: {
    h1: string;
    tel: string;
    telDisplay: string;
    rating: { value: string; count: string } | null;
    hours: string[];
  };
};

/** Stills rendered from the 3D counter scene (scripts/render-3d-stills.mjs): phones never load three.js or the film. */
const STILL = {
  avif: "/images/posters/hero-phone-640.avif 640w, /images/posters/hero-phone-900.avif 900w",
  webp: "/images/posters/hero-phone-900.webp 900w",
  // Desktop matches neither source and gets this empty pixel, so it never downloads the still
  none: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  sizes: "(min-width: 768px) 48rem, 100vw",
};
/** The same scene, framed for a desktop's first screen: shown at once, and stays under the live canvas. */
const DESK = {
  avif: "/images/posters/hero-3d-1600.avif 1600w, /images/posters/hero-3d-2200.avif 2200w, /images/posters/hero-3d-2860.avif 2860w",
  webp: "/images/posters/hero-3d-2200.webp 2200w",
};

const WORD = "SUTON";

/**
 * Hero: a real-time glass of red on the kitchen counter in front of the grill (desktop with a
 * mouse; a still rendered from the same scene everywhere else), the name across it.
 * On scroll the camera comes round to the glass as the frame closes into the Suton arch and the
 * story opens around it.
 */
export function Hero({ dict, h1, eyebrow, sub, reserveHref, menuHref, story, word = WORD, tagline, phone }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<CounterHandle | null>(null);
  const [live, setLive] = useState(false);
  const [hint, setHint] = useState<"off" | "on" | "done">("off");

  // The glass on the counter. three.js is only imported here, after load, once the check passes
  // (src/lib/live3d.ts). The still stays until the scene is built, compiled and drawn once.
  useEffect(() => {
    const canvas = canvasRef.current;
    const el = root.current;
    if (!canvas || !el) return;

    let alive = true;
    let handle: CounterHandle | null = null;
    let io: IntersectionObserver | undefined;
    let watch: ReturnType<typeof watchFrames> | undefined;
    let onScreen = false;
    let leaving: { handle: CounterHandle; timer: number } | undefined;
    const onMove = (e: PointerEvent) => handle?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    const onResize = () => handle?.resize();

    // Too slow for this computer: the canvas fades back to the still, the loop stops, the renderer goes.
    const fallBack = () => {
      if (!handle) return;
      const h = handle;
      handle = null;
      scene.current = null;
      watch?.stop();
      io?.disconnect();
      h.setVisible(false);
      setLive(false);
      setHint("done");
      leaving = { handle: h, timer: window.setTimeout(() => (h.dispose(true), (leaving = undefined)), 1500) };
    };
    window.addEventListener(STILL_EVENT, fallBack);

    void inTurn(async () => {
      if (!(await readyFor3D()) || !alive) return;
      const { createCounterScene } = await import("@/components/fx/counterScene");
      if (!alive) return;
      try {
        handle = await createCounterScene(canvas, {
          video: "/video/grill.mp4",
          poster: "/images/posters/grill.jpg",
          onSwirl: () => setHint("done"),
        });
      } catch (e) {
        if ((e as Error).name === "NoGpu") keepStills();
        return; // the still stays
      }
      if (!alive) return handle.dispose();
      scene.current = handle;
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        handle?.setVisible(onScreen);
      });
      io.observe(el);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", onResize);
      setLive(true);
      setHint((h) => (h === "off" ? "on" : h));
      watch = watchFrames(() => onScreen);
      void watch.verdict.then((slow) => slow && keepStills());
      // The bottle further down warms up after this verdict (or straight away if the hero's off screen).
      await Promise.race([watch.verdict, wait(3500)]);
    });

    return () => {
      alive = false;
      window.removeEventListener(STILL_EVENT, fallBack);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      watch?.stop();
      io?.disconnect();
      handle?.dispose();
      if (leaving) {
        window.clearTimeout(leaving.timer);
        leaving.handle.dispose(true);
      }
      scene.current = null;
    };
  }, []);

  useDesktopGSAP(
    ({ gsap, ScrollTrigger }) => {
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
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          // The camera comes round to the glass and centres it as the frame closes into the arch.
          onUpdate: (self) => {
            scene.current?.setProgress(self.progress);
            if (self.progress > 0.04) setHint((h) => (h === "on" ? "done" : h));
          },
        },
      });
      tl.fromTo(frame, { clipPath: full }, { clipPath: arch, duration: 1, ease: "power2.inOut" }, 0)
        .to("[data-title]", { yPercent: -18, opacity: 0, duration: 0.45 }, 0)
        .to("[data-shade]", { opacity: 0, duration: 0.6 }, 0.2)
        .fromTo("[data-story]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0.55)
        .fromTo("[data-ring]", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.6)
        .to({}, { duration: 0.5 });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero className="relative h-[260svh] phone:h-auto" aria-labelledby="hero-title">
      <link rel="preload" as="image" type="image/avif" imageSrcSet={STILL.avif} imageSizes={STILL.sizes} media={PHONE} fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" imageSrcSet={DESK.avif} imageSizes="max(100vw, 220vh)" media={DESKTOP} fetchPriority="high" />

      {/* Phones: a still of the fire, then everything a guest came for, in the first paint. */}
      <div className="hero-phone hidden phone:block">
        <div className="hero-still relative overflow-hidden bg-char">
          <picture>
            <source media={PHONE} type="image/avif" srcSet={STILL.avif} sizes={STILL.sizes} />
            <source media={PHONE} type="image/webp" srcSet={STILL.webp} sizes={STILL.sizes} />
            <img src={STILL.none} alt="" width={900} height={720} fetchPriority="high" decoding="sync" className="absolute inset-0 h-full w-full object-cover object-[62%_55%]" />
          </picture>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(14_12_10/0.55),transparent_32%,transparent_55%,var(--night))]" />
          <span className="embers" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <i key={i} />
            ))}
          </span>
        </div>
        <div className="hero-copy wrap relative -mt-9 pb-5">
          <p className="t-serif text-[1.2rem] italic leading-tight text-candle">{tagline ?? dict.tagline}</p>
          <h1 className="t-serif mt-1 text-[2.1rem] leading-[1.04] tracking-[-0.012em] text-cream [text-wrap:balance]">{phone.h1}</h1>
          {phone.rating && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[0.92rem] text-cream">
              <Stars value={Number(phone.rating.value.replace(",", "."))} className="text-[0.95rem] text-candle" label={`${phone.rating.value} / 5`} />
              <span className="t-num font-medium">{phone.rating.value}</span>
              <span className="text-cream/80">
                {phone.rating.count} {dict.rating.reviews} {dict.rating.on}
              </span>
            </p>
          )}
          {phone.hours.length > 0 && (
            <div className="mt-2.5 text-[0.84rem] leading-snug text-cream/80">
              <div className="flex h-5 items-center text-cream">
                <OpenBadge dict={dict} kitchen={false} />
              </div>
              <p className="t-num mt-1">
                {phone.hours.map((h, i) => (
                  <span key={h}>
                    {i > 0 && " · "}
                    <span className="whitespace-nowrap">{h}</span>
                  </span>
                ))}
              </p>
            </div>
          )}
          {phone.tel ? (
            <a href={`tel:${phone.tel}`} className="mt-3.5 flex h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-candle font-medium text-night">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              <span className="t-num">
                {dict.call} {phone.telDisplay}
              </span>
            </a>
          ) : (
            <Link href={reserveHref} className="mt-3.5 flex h-[3.25rem] items-center justify-center rounded-full bg-candle font-medium text-night">
              {dict.reserve}
            </Link>
          )}
        </div>
      </div>

      <div className="sticky top-0 h-[100svh] overflow-hidden phone:hidden">
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

        <div data-frame className="absolute inset-0 bg-char will-change-[clip-path]">
          {/* A glass of red on the kitchen counter, the grill behind: a still at once, the live scene over it. */}
          <div data-film className="absolute inset-0">
            <picture>
              <source media={DESKTOP} type="image/avif" srcSet={DESK.avif} sizes="max(100vw, 220vh)" />
              <source media={DESKTOP} type="image/webp" srcSet={DESK.webp} sizes="max(100vw, 220vh)" />
              <img src={STILL.none} alt="" width={2640} height={1200} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[78%_50%]" />
            </picture>
          </div>
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out ${live ? "opacity-100" : "opacity-0"}`}
          />
          <div data-shade className="vignette pointer-events-none absolute inset-0" />
        </div>

        <p
          aria-hidden
          className={`t-eyebrow pointer-events-none absolute right-[10%] top-[17%] z-[2] flex items-center gap-2.5 text-cream/75 transition-opacity duration-700 ${hint === "on" ? "opacity-100" : "opacity-0"}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-[spin_5s_linear_infinite] text-candle" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
          </svg>
          {dict.cursor.swirl}
        </p>

        <div data-title className="wrap relative z-[2] flex h-full flex-col justify-end pb-[max(7rem,14svh)] md:pb-16">
          <p className="t-eyebrow text-cream/85">
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
                <span key={i} className="inline-block">
                  {ch === " " ? "\u00a0" : ch}
                </span>
              ))}
            </span>
          </h1>
          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <p className="t-serif text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-tight text-candle">{tagline ?? dict.tagline}</p>
              <p className="mt-3 text-cream/85">{sub}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
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
          <div className="mt-8 hidden items-center justify-between border-t border-cream/15 pt-5 text-cream/80 md:flex">
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
