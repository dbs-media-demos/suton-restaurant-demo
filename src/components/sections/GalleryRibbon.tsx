"use client";

import { useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Photo } from "@/components/ui/Photo";
import type { PhotoKey } from "@/content/photos";

/**
 * Two rows of photos drifting in opposite directions. Scrolling speeds them up and
 * skews them slightly with the scroll velocity.
 */
export function GalleryRibbon({ rows, title, href, linkLabel, viewLabel }: { rows: { k: PhotoKey; alt: string }[][]; title: string; href: string; linkLabel: string; viewLabel: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tracks = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
      const tweens = tracks.map((t, i) =>
        gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 55 + i * 10, ease: "none", repeat: -1 }),
      );
      const skewTo = tracks.map((t) => gsap.quickTo(t, "skewX", { duration: 0.6, ease: "power3.out" }));
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(v) / 250, 6);
          tweens.forEach((tw) => gsap.to(tw, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(tw, { timeScale: 1, duration: 1.2 }) }));
          skewTo.forEach((fn) => fn(Math.max(-6, Math.min(6, v / -300))));
        },
        onLeave: () => skewTo.forEach((fn) => fn(0)),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)]" aria-labelledby="ribbon-title">
      <div className="wrap mb-12 flex items-end justify-between gap-6">
        <h2 id="ribbon-title" className="t-h2 max-w-[14ch]">
          {title}
        </h2>
        <Link href={href} className="link-underline shrink-0 text-candle">
          {linkLabel} →
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        {rows.map((row, i) => (
          <div key={i} data-row className="flex w-max gap-4 will-change-transform md:gap-6">
            {[0, 1].map((copy) =>
              row.map((p, j) => (
                <Link
                  key={`${copy}-${j}`}
                  href={href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  aria-hidden={copy === 1 || undefined}
                  data-cursor={viewLabel}
                  className={clsx(
                    "group relative block shrink-0 overflow-hidden bg-char",
                    j % 3 === 0 ? "arch aspect-[3/4] w-[46vw] md:w-[19vw]" : j % 3 === 1 ? "aspect-[4/3] w-[62vw] rounded-2xl md:w-[27vw]" : "aspect-square w-[44vw] rounded-full md:w-[18vw]",
                  )}
                >
                  <Photo k={p.k} alt={copy === 1 ? "" : p.alt} sizes="(min-width: 768px) 27vw, 62vw" quality={60} className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
                </Link>
              )),
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
