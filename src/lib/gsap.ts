"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Slow, luxurious defaults: long expo ease-outs.
  gsap.defaults({ ease: "expo.out", duration: 1.3 });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

/** Element starts below the fold — safe to hide it for an entrance animation. */
export const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

export { gsap, ScrollTrigger, useGSAP };
