"use client";

import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { MARK } from "./mark";

export function Mark({ className, animated }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={clsx("shrink-0", className)} aria-hidden focusable="false">
      <path d={MARK.sun} fill="var(--candle)" className={animated ? "origin-[32px_37px] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-[3px]" : undefined} />
      {MARK.lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          x2={l.x2}
          y1={l.y}
          y2={l.y}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={animated ? "transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-110" : undefined}
          style={animated ? { transformOrigin: "32px 0", transitionDelay: `${i * 60}ms` } : undefined}
        />
      ))}
    </svg>
  );
}

/** Mark + wordmark. `sub` adds the "kuhinja & vino" line. */
export function Logo({ className, sub, subText = "kuhinja & vino" }: { className?: string; sub?: boolean; subText?: string }) {
  const biz = useBiz();
  return (
    <span className={clsx("group inline-flex items-center gap-2.5", className)}>
      <Mark className="h-[1.9em] w-[1.9em]" animated />
      <span className="flex flex-col leading-none">
        <span
          className={clsx("t-serif text-[1.35em]", biz.preview ? "block max-w-[11rem] truncate pb-0.5 tracking-[0.12em] sm:max-w-[16rem]" : "tracking-[0.28em]")}
        >
          {biz.preview ? biz.shortName.toUpperCase() : "SUTON"}
        </span>
        {sub && <span className="t-eyebrow mt-1 whitespace-nowrap text-[0.5em] tracking-[0.34em] opacity-70">{biz.preview ? "restoran" : subText}</span>}
      </span>
    </span>
  );
}
