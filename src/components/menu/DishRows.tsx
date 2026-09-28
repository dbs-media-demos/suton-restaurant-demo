"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/hooks";
import { photos } from "@/content/photos";
import { dietLabels, dietShort, formatRsd, type Dish } from "@/content/menu";
import type { Locale } from "@/lib/i18n";

/**
 * Menu rows. On desktop the dish photo floats after the cursor (tilting with its speed);
 * on touch screens a tap expands the row with the photo.
 */
export function DishRows({ dishes, locale, theme = "night" }: { dishes: Dish[]; locale: Locale; theme?: "night" | "paper" }) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const hoverable = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    const el = floatRef.current;
    if (!el || !hoverable) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!prefersReducedMotion()) rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [hoverable]);

  const muted = theme === "paper" ? "text-[#5e5246]" : "text-smoke";

  return (
    <>
      <ul className="border-t border-line" onPointerLeave={() => setActive(null)}>
        {dishes.map((d) => {
          const isOpen = open === d.id;
          const Row = hoverable ? "div" : "button";
          return (
            <li key={d.id} data-dish={d.id} className="border-b border-line">
              <Row
                type={hoverable ? undefined : "button"}
                onPointerEnter={() => hoverable && setActive(d.id)}
                onClick={() => !hoverable && setOpen(isOpen ? null : d.id)}
                aria-expanded={hoverable ? undefined : isOpen}
                className={clsx(
                  "group grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 py-5 text-left transition-[padding] duration-500 ease-[var(--ease-out-expo)] md:py-6",
                  hoverable ? "md:hover:pl-4" : "",
                )}
              >
                <span className="min-w-0">
                  <span className="t-serif block text-[clamp(1.35rem,2.4vw,2.1rem)] leading-tight tracking-[-0.01em] transition-[font-style] group-hover:italic">
                    {d.name[locale]}
                  </span>
                  <span className={clsx("mt-1.5 block text-[0.95rem]", muted)}>{d.desc[locale]}</span>
                  {d.diet.length > 0 && (
                    <span className="mt-2.5 flex flex-wrap gap-1.5">
                      {d.diet.map((t) => (
                        <span key={t} className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] tracking-wide" title={dietLabels[t][locale]}>
                          <span aria-hidden>{dietShort[t]}</span>
                          <span className="sr-only">{dietLabels[t][locale]}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="t-num whitespace-nowrap text-[1.05rem]">{formatRsd(d.price, locale)}</span>
              </Row>
              {!hoverable && (
                <div className={clsx("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl">
                      {isOpen && <Image src={photos[d.image].src} alt={d.name[locale]} fill sizes="100vw" quality={60} className="object-cover" />}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {hoverable && (
        <div ref={floatRef} className="pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden>
          <div
            className={clsx(
              "arch-soft relative -ml-[8.5rem] -mt-[12rem] h-[17rem] w-[13rem] overflow-hidden shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
              active ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            {dishes.map((d) => (
              <Image
                key={d.id}
                src={photos[d.image].src}
                alt=""
                fill
                sizes="13rem"
                quality={60}
                className={clsx("object-cover transition-[opacity,transform] duration-500", active === d.id ? "scale-100 opacity-100" : "scale-110 opacity-0")}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
