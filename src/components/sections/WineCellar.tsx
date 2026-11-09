"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { SplitReveal, Reveal, Parallax } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { useDesktopGSAP, PHONE, DESKTOP } from "@/lib/motion";
import { inTurn, keepStills, readyFor3D, STILL_EVENT, watchFrames } from "@/lib/live3d";
import type { BottleHandle, BottleWine } from "@/components/fx/bottleScene";
import type { Locale } from "@/lib/i18n";

export type CellarRow = {
  id: string;
  name: string;
  grapes: string;
  count: string;
  pick: BottleWine & { price: string };
};

type Props = {
  locale: Locale;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  rows: CellarRow[];
  start: number;
};

/** Stills of the bottle (scripts/render-3d-stills.mjs): phones and slower setups never load three.js. */
const STILL = {
  desk: "/images/posters/cellar-3d-720.avif 720w, /images/posters/cellar-3d-1080.avif 1080w",
  deskWebp: "/images/posters/cellar-3d-720.webp 720w",
  phone: "/images/posters/cellar-phone-800.avif 800w",
  phoneWebp: "/images/posters/cellar-phone-800.webp 800w",
  none: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
};

const words = {
  sr: { pick: "Preporuka", country: "Srbija", volume: "0,75 l · 13,5 % vol", bottle: "boca", vine: "Vinova loza na zalasku sunca", list: "180 etiketa · samo Srbija i region" },
  en: { pick: "Our pick", country: "Serbia", volume: "0.75 l · 13.5% vol", bottle: "bottle", vine: "Vines at sunset", list: "180 labels · Serbia & the region only" },
};

/**
 * The wine section: four regions, and in the arch the sommelier's bottle from the one you point at.
 * On a desktop with a mouse it is a live 3D bottle that turns with the scroll and spins round to the
 * next region's wine; everywhere else a still of it. Every word on its label is in the row too.
 */
export function WineCellar({ locale, eyebrow, title, text, cta, href, rows, start }: Props) {
  const t = words[locale];
  const stage = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<BottleHandle | null>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(start);
  const activeRef = useRef(start);
  const startPick = rows[start].pick;

  // Built in idle time after the hero's verdict (src/lib/live3d.ts), long before you scroll here:
  // the still stays until it's compiled and drawn once, and it runs only while on screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const el = stage.current;
    if (!canvas || !el) return;

    let alive = true;
    let handle: BottleHandle | null = null;
    let watch: ReturnType<typeof watchFrames> | undefined;
    let onScreen = false;
    let leaving: { handle: BottleHandle; timer: number } | undefined;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      handle?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => handle?.setPointer(0, 0);
    const onResize = () => handle?.resize();
    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        handle?.setVisible(onScreen);
      },
      { rootMargin: "100px 0px" },
    );

    // Too slow for this computer: back to the still, the loop stops, the renderer goes.
    const fallBack = () => {
      if (!handle) return;
      const h = handle;
      handle = null;
      scene.current = null;
      watch?.stop();
      visible.disconnect();
      h.setVisible(false);
      setLive(false);
      leaving = { handle: h, timer: window.setTimeout(() => (h.dispose(true), (leaving = undefined)), 1100) };
    };
    window.addEventListener(STILL_EVENT, fallBack);

    void inTurn(async () => {
      if (!(await readyFor3D()) || !alive) return;
      const [{ createBottleScene }] = await Promise.all([import("@/components/fx/bottleScene"), document.fonts.ready]);
      if (!alive) return;
      const css = getComputedStyle(document.documentElement);
      const first = activeRef.current;
      try {
        handle = await createBottleScene(canvas, {
          wines: rows.map((r) => r.pick),
          start: first,
          serif: css.getPropertyValue("--font-display-serif").trim() || "Georgia, serif",
          sans: css.getPropertyValue("--font-hanken").trim() || "sans-serif",
          labels: { country: t.country, volume: t.volume },
        });
      } catch (e) {
        if ((e as Error).name === "NoGpu") keepStills();
        return; // the still stays
      }
      if (!alive) return handle.dispose();
      // A region picked while it was warming up.
      if (activeRef.current !== first) handle.show(activeRef.current);
      scene.current = handle;
      visible.observe(el);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", onResize);
      setLive(true);
      watch = watchFrames(() => onScreen);
      void watch.verdict.then((slow) => slow && keepStills());
    });

    return () => {
      alive = false;
      window.removeEventListener(STILL_EVENT, fallBack);
      visible.disconnect();
      watch?.stop();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      handle?.dispose();
      if (leaving) {
        window.clearTimeout(leaving.timer);
        leaving.handle.dispose(true);
      }
      scene.current = null;
    };
    // Built once; `rows` and the labels are read at that moment and driven by show() afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The bottle turns a little as the section passes.
  useDesktopGSAP(
    ({ ScrollTrigger }) => {
      const el = stage.current;
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onUpdate: (self) => scene.current?.setProgress(self.progress) });
    },
    { scope: stage },
  );

  const pick = (i: number) => {
    activeRef.current = i;
    setActive(i);
    scene.current?.show(i);
  };

  return (
    <div className="wrap grid items-center gap-16 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr] phone:flex phone:flex-col phone:items-stretch phone:gap-5">
      <div className="relative mx-auto w-full max-w-[30rem] phone:max-w-none">
        <Parallax className="arch aspect-[3/4.6] bg-night phone:aspect-[5/3]" amount={8} revealFrom="inset(40% 0% 0% 0%)">
          <div ref={stage} className="absolute inset-0">
            <picture>
              <source media={PHONE} type="image/avif" srcSet={STILL.phone} sizes="100vw" />
              <source media={PHONE} type="image/webp" srcSet={STILL.phoneWebp} sizes="100vw" />
              <source media={DESKTOP} type="image/avif" srcSet={STILL.desk} sizes="30rem" />
              <source media={DESKTOP} type="image/webp" srcSet={STILL.deskWebp} sizes="30rem" />
              <img
                src={STILL.none}
                alt={`${startPick.name} ${startPick.vintage}, ${startPick.producer}`}
                width={720}
                height={1104}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            <canvas ref={canvasRef} aria-hidden className={clsx("absolute inset-0 h-full w-full transition-opacity duration-1000", live ? "opacity-100" : "opacity-0")} />
          </div>
        </Parallax>
        <div className="absolute -bottom-10 -right-4 hidden aspect-square w-40 overflow-hidden rounded-full border-[6px] border-night sm:block md:-right-12 md:w-48 phone:-bottom-3 phone:right-0 phone:block phone:w-24">
          <Photo k="wine/vine-sunset" alt={t.vine} sizes="12rem" />
        </div>
        <p className="t-eyebrow absolute -left-2 top-1/2 hidden origin-left -translate-y-1/2 -rotate-90 text-smoke lg:block" aria-hidden>
          {t.list}
        </p>
      </div>

      <div>
        <p className="t-eyebrow text-candle">{eyebrow}</p>
        <SplitReveal id="wine-title" className="t-h1 mt-6 phone:mt-2.5 phone:pr-16">
          {title}
        </SplitReveal>
        <Reveal>
          <p className="t-lead mt-8 max-w-lg text-smoke phone:mt-2.5 phone:max-w-none">{text}</p>
        </Reveal>
        <Reveal as="ul" stagger={0.08} className="mt-12 border-t border-line phone:mt-4">
          {rows.map((r, i) => {
            const on = i === active;
            return (
              <li key={r.id} className="border-b border-line">
                <button
                  type="button"
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  aria-pressed={on}
                  className="group grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 text-left phone:grid-cols-[1.75rem_1fr_auto] phone:gap-2.5 phone:py-2.5"
                >
                  <span className={clsx("t-eyebrow t-num transition-colors duration-500", on ? "text-candle" : "text-candle/60")}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span
                      className={clsx(
                        "t-serif block text-[clamp(1.4rem,2.2vw,2rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] phone:translate-x-0 phone:not-italic",
                        on ? "translate-x-2 italic text-cream" : "text-cream/80 group-hover:translate-x-2",
                      )}
                    >
                      {r.name}
                    </span>
                    <span className="mt-1 block text-sm text-smoke phone:mt-0 phone:text-[0.82rem] phone:leading-snug">{r.grapes}</span>
                    <span className={clsx("mt-1.5 block text-[0.86rem] transition-colors duration-500 phone:mt-0.5 phone:text-[0.8rem] phone:leading-snug", on ? "text-candle" : "text-cream/65")}>
                      {t.pick}: {r.pick.name}, {r.pick.grape} {r.pick.vintage}
                    </span>
                  </span>
                  <span className="text-right phone:text-[0.78rem]">
                    <span className="t-num block text-[0.95rem] text-cream phone:text-[0.82rem]">{r.pick.price}</span>
                    <span className="t-num mt-1 block text-sm text-smoke phone:mt-0 phone:text-[0.74rem]">
                      {t.bottle} · {r.count}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </Reveal>
        <Reveal>
          <Button href={href} className="mt-10 phone:mt-4 phone:h-12 phone:w-full phone:justify-center" magnetic>
            {cta}
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
