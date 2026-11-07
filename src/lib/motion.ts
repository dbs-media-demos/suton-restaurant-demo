"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Phones and touch screens get no pinning, scrubbing, parallax or smooth scrolling, so GSAP and
 * Lenis aren't even downloaded there. Keep this in sync with the `phone` variant and the phone
 * block in globals.css.
 */
export const PHONE = "(max-width: 767.98px), (hover: none), (pointer: coarse)";

export const DESKTOP = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE).matches;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

/** Element starts below the fold — safe to hide it for an entrance animation. */
export const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

export type MotionKit = typeof import("./gsap");

let kit: Promise<MotionKit> | null = null;
export const loadKit = () => (kit ??= import("./gsap"));

export const loadFlip = () => import("./flip");

// Desktop starts fetching as soon as this module runs, so the motion is ready at hydration.
if (typeof window !== "undefined" && !isPhone()) void loadKit();

/**
 * useGSAP for desktop only: nothing runs (or loads) on a phone. Everything is reverted when the
 * window crosses into phone width, and set up again on the way back.
 */
export function useDesktopGSAP(setup: (kit: MotionKit) => void | (() => void), { scope }: { scope?: RefObject<Element | null> } = {}) {
  useEffect(() => {
    let run = 0;
    let revert: (() => void) | undefined;
    const sync = () => {
      const id = ++run;
      revert?.();
      revert = undefined;
      if (isPhone()) return;
      void loadKit().then((k) => {
        if (id !== run) return;
        const ctx = k.gsap.context(() => setup(k), scope?.current ?? undefined);
        revert = () => ctx.revert();
      });
    };
    sync();
    const mq = window.matchMedia(PHONE);
    mq.addEventListener("change", sync);
    return () => {
      run++;
      mq.removeEventListener("change", sync);
      revert?.();
    };
    // Runs once per mount, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** For tweens started by a click or a filter: filled on desktop, stays null on a phone (the change just happens). */
export function useDesktopModule<T>(load: () => Promise<T>) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (isPhone()) return;
    let alive = true;
    void load().then((m) => {
      if (alive) ref.current = m;
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
