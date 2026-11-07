"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * One small fade-and-rise per section on phones, once. A section is only hidden just before it
 * scrolls into view, so everything stays visible until then: without JS, for crawlers and in
 * reduced-motion mode nothing ever hides.
 */
export function PhoneRise() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPhone() || prefersReducedMotion()) return;
    const show = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          show.unobserve(target);
          target.classList.add("rise-in");
          target.classList.remove("rise-wait");
          target.addEventListener("transitionend", () => target.classList.remove("rise-in"), { once: true });
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    const arm = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting, boundingClientRect } of entries) {
          if (!isIntersecting) continue;
          arm.unobserve(target);
          // Already on screen (first load, a fast flick): leave it alone
          if (boundingClientRect.top < window.innerHeight) continue;
          target.classList.add("rise-wait");
          show.observe(target);
        }
      },
      { rootMargin: "0px 0px 500px 0px" },
    );
    document.querySelectorAll("main section:not([data-hero])").forEach((s) => arm.observe(s));
    return () => {
      arm.disconnect();
      show.disconnect();
      document.querySelectorAll(".rise-wait, .rise-in").forEach((s) => s.classList.remove("rise-wait", "rise-in"));
    };
  }, [pathname]);

  return null;
}
