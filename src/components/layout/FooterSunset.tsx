"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useBiz } from "@/components/preview/BizContext";

/** Giant footer wordmark; the sun behind it sets as you reach the end of the page. */
export function FooterSunset() {
  const biz = useBiz();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-sun]",
        { yPercent: -38 },
        { yPercent: 22, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.8 } },
      );
      gsap.fromTo(
        "[data-glow]",
        { opacity: 0.25 },
        { opacity: 0.85, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.8 } },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative overflow-hidden pt-10" aria-hidden>
      <div data-glow className="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(110_31_42/0.55),transparent_70%)]" />
      <div className="relative mx-auto flex w-full max-w-[100rem] justify-center">
        <div data-sun className="absolute left-1/2 top-[18%] aspect-square w-[34vw] max-w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--candle-2),var(--candle)_55%,#c9793a)] opacity-90 blur-[1px]" />
        <p
          className={
            biz.preview
              ? "t-serif relative select-none px-4 text-center text-[clamp(3rem,11vw,11rem)] leading-[0.9] tracking-[-0.03em] text-cream [overflow-wrap:anywhere]"
              : "t-serif relative select-none text-center text-[27vw] leading-[0.78] tracking-[-0.04em] text-cream md:text-[24vw]"
          }
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          {biz.preview ? biz.shortName : "Suton"}
        </p>
      </div>
      <div className="relative -mt-[3vw] space-y-[1.2vw] pb-4">
        {[100, 72, 44].map((w) => (
          <div key={w} className="mx-auto h-[max(2px,0.35vw)] rounded-full bg-cream/80" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
