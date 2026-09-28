"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A small candle-flame cursor for mouse users. It grows into a labelled disc
 * over anything marked `data-cursor="Label"`.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.style.opacity = "1";
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onLeave = () => {
      el.style.opacity = "0";
      shown = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[200] opacity-0 transition-opacity duration-300" aria-hidden>
      <div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-candle text-night transition-[width,height,box-shadow] duration-500 ease-[var(--ease-out-expo)]"
        style={{
          width: label ? 92 : 10,
          height: label ? 92 : 10,
          boxShadow: label ? "0 0 0 0 transparent" : "0 0 18px 4px rgb(227 168 87 / 0.45)",
        }}
      >
        <span className={`t-eyebrow text-[0.62rem] tracking-[0.2em] transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
    </div>
  );
}
