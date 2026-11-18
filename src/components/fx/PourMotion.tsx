"use client";

import { useEffect, useRef, useState } from "react";
import { isPhone, prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";

/**
 * What moves the /v2 glass once the page has loaded (the pour itself is CSS, PourHero.tsx).
 * - The mouse swirls the wine: the surface is a 2D spring (tilt left-right and front-back) pushed
 *   by the hand's speed, so moving in circles makes it run round the bowl, and wine thrown up the
 *   side leaves tears that run back down. It only draws while the wine is moving.
 * - The scroll brings the glass to the middle of the arch the frame closes into, as the camera
 *   does on /, and the fire drifts behind it.
 * Renders only the "swirl the glass" hint. Desktop with a mouse only; nothing under reduced motion.
 */
export function PourMotion({ hint }: { hint: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [hintOn, setHintOn] = useState<"off" | "on" | "done">("off");

  useEffect(() => {
    const el = ref.current?.closest<HTMLElement>(".pour");
    const g = el?.querySelector<SVGGElement>("[data-slosh]");
    const tilt = el?.querySelector<SVGGElement>("[data-tilt]");
    const glassBox = el?.querySelector<HTMLElement>("[data-glass]");
    if (!el || !g || !tilt || !glassBox || isPhone() || prefersReducedMotion()) return;

    let x = 0, y = 0, vx = 0, vy = 0; // the surface's tilt, degrees
    let tears = 0;
    let raf = 0;
    let last = 0;
    let lastPointer: { x: number; y: number; t: number } | null = null;
    let onScreen = true;
    let swirled = 0;

    const frame = (t: number) => {
      const dt = Math.min(0.033, last ? (t - last) / 1000 : 0.016);
      last = t;
      // About 1.4 Hz, as wine in a glass this size; settles in a few seconds
      const k = 78;
      const c = 1.5;
      vx += (-k * x - c * vx) * dt;
      vy += (-k * y - c * vy) * dt;
      // Never over the rim
      x += vx * dt;
      y += vy * dt;
      if (Math.abs(x) > 9) {
        x = Math.sign(x) * 9;
        vx *= -0.3;
      }
      if (Math.abs(y) > 8) {
        y = Math.sign(y) * 8;
        vy *= -0.3;
      }
      const energy = x * x + y * y + (vx * vx + vy * vy) / k;
      tears = Math.max(tears - dt * 0.16, Math.min(1, energy / 90));
      // Left-right: the surface tilts (and climbs the far side); front-back: it opens or closes to the eye
      g.setAttribute("transform", `rotate(${(x * 1.7).toFixed(2)} 100 0)`);
      tilt.setAttribute("transform", `scale(1 ${(1 + y * 0.06).toFixed(3)})`);
      el.style.setProperty("--tears", tears.toFixed(3));
      el.style.setProperty("--sheen", (0.5 + Math.max(-0.4, Math.min(0.4, y * 0.04))).toFixed(3));
      if (energy > 0.002 || tears > 0.003) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
        x = y = vx = vy = 0;
        g.removeAttribute("transform");
        tilt.removeAttribute("transform");
      }
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastPointer && now - lastPointer.t < 100) {
        const dx = e.clientX - lastPointer.x;
        const dy = e.clientY - lastPointer.y;
        // The glass follows the hand, harder the closer it is; the wine lags behind it
        const r = glassBox.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height * 0.3));
        const gain = 0.2 + 0.5 * Math.max(0, Math.min(1, (700 - d) / 450));
        vx += Math.max(-60, Math.min(60, dx * gain));
        vy += Math.max(-60, Math.min(60, -dy * gain));
        swirled += Math.hypot(dx, dy);
        if (swirled > 900) setHintOn("done");
        if (!raf && onScreen) raf = requestAnimationFrame(frame);
      }
      lastPointer = { x: e.clientX, y: e.clientY, t: now };
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (!onScreen && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    // The hint comes once the glass is poured.
    const timer = window.setTimeout(() => setHintOn((h) => (h === "off" ? "on" : h)), 3300);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useDesktopGSAP(({ gsap }) => {
    const el = ref.current?.closest<HTMLElement>(".pour");
    const hero = el?.closest<HTMLElement>("[data-hero]");
    if (!el || !hero || prefersReducedMotion()) return;
    const glass = el.querySelector<HTMLElement>("[data-glass]")!;
    // Where the glass's foot is, and where it goes: low in the arch (its sizes: src/components/sections/Hero.tsx)
    const target = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = glass.getBoundingClientRect();
      const footX = r.left + r.width / 2;
      const footY = r.bottom - r.height * 0.05;
      const w = Math.min(vw * 0.3, 470);
      const archH = Math.min(vh * 0.74, w * 1.55);
      const archTop = (vh - archH) / 2 + vh * 0.03;
      const s = Math.min(0.86, (archH * 0.72) / r.height);
      return { x: vw / 2 - footX, y: archTop + archH * 0.9 - footY, s };
    };
    let t = target();
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          gsap.set(glass, { clearProps: "transform" });
          t = target();
        },
        onUpdate: (self) => {
          if (self.progress > 0.04) setHintOn((h) => (h === "on" ? "done" : h));
        },
      },
    });
    tl.to(glass, { x: () => t.x, y: () => t.y, scale: () => t.s, transformOrigin: "50% 95%", duration: 1, ease: "power2.inOut" }, 0)
      .to(el.querySelector("[data-pour-bg]"), { x: () => t.x * 0.35, scale: 1.08, duration: 1, ease: "power2.inOut" }, 0)
      .to(el.querySelector("[data-pour-counter]"), { y: () => t.y, duration: 1, ease: "power2.inOut" }, 0)
      .to({}, { duration: 0.5 });
  });

  return (
    <p
      ref={ref}
      className={`pour-hint t-eyebrow pointer-events-none absolute z-[2] flex items-center gap-2.5 text-cream/75 transition-opacity duration-700 ${hintOn === "on" ? "opacity-100" : "opacity-0"}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 animate-[spin_5s_linear_infinite] text-candle" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
      </svg>
      {hint}
    </p>
  );
}
