"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Slow, luxurious defaults: long expo ease-outs.
  gsap.defaults({ ease: "expo.out", duration: 1.3 });
}

export { gsap, ScrollTrigger };
