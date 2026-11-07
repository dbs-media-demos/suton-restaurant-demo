"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { isPhone, loadKit, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling driven by GSAP's ticker. Desktop only: phones never download it, and reduced motion keeps native scrolling. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || isPhone()) return;
    let dead = false;
    let stop: (() => void) | undefined;
    void Promise.all([loadKit(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisClass }]) => {
      if (dead) return;
      // A slightly heavier lerp than usual: slow, luxurious scrolling.
      const lenis = new LenisClass({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -80 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    });
    return () => {
      dead = true;
      stop?.();
    };
  }, []);

  // New page: re-measure every trigger once the layout settles.
  useEffect(() => {
    if (isPhone()) return;
    window.__lenis?.resize();
    const id = window.setTimeout(() => void loadKit().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
