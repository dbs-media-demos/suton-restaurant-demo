"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, belowFold } from "@/lib/gsap";

type Split = { revert: () => void };

/*
 * Scroll-driven reveals. Content is always visible in the HTML; JavaScript only hides
 * elements that start below the fold (with opacity), then animates them in.
 * `immediate` variants are pure CSS for above-the-fold content (fast LCP).
 */

const delayStyle = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
  id?: string;
  /** Split by words (slow luxurious rise) instead of lines. */
  words?: boolean;
};

/** Headline that rises line by line (or word by word) out of a mask. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, immediate, stagger, id, words }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      gsap.set(el, { opacity: 0 });
      let split: Split | null = null;
      let dead = false;
      const io = new IntersectionObserver(
        async ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          // SplitText is only downloaded once the first headline scrolls into view.
          const { SplitText } = await import("gsap/SplitText");
          if (dead) return;
          gsap.registerPlugin(SplitText);
          split = SplitText.create(el, {
            type: words ? "words,lines" : "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              const targets = words ? self.words : self.lines;
              return gsap.from(targets, {
                yPercent: 120,
                rotate: words ? 6 : 2.5,
                duration: 1.6,
                stagger: stagger ?? (words ? 0.05 : 0.1),
                delay,
                ease: "expo.out",
              });
            },
          });
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
      return () => {
        dead = true;
        io.disconnect();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-heading", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  immediate?: boolean;
  id?: string;
};

/** Fade + rise when scrolled into view. `stagger` animates direct children. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 40, stagger, immediate, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      const targets = stagger ? Array.from(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 1.5, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-fade", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

/**
 * Paragraph whose words brighten one by one as you scroll. `inserts` places small
 * inline elements (e.g. photo pills) before the word at the given index.
 */
export function ScrubWords({
  text,
  className,
  as: Tag = "p",
  inserts,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  inserts?: Record<number, ReactNode>;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      // Starts at ~3.5:1 (large text) so it stays readable and accessible before scrolling.
      gsap.fromTo(
        words,
        { opacity: 0.45 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: 0.6 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          {inserts?.[i]}
          <span data-w className="inline">
            {w}
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Image frame that unmasks on enter and drifts with scroll. */
export function Parallax({
  children,
  className,
  amount = 14,
  reveal = true,
  revealFrom = "inset(14% 10% 14% 10%)",
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  revealFrom?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal && belowFold(el)) {
        gsap.fromTo(
          el,
          { clipPath: revealFrom },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
