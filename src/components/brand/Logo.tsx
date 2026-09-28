import clsx from "clsx";

/** Mark geometry, shared with the favicon and OG image. A half sun sinking into three river lines. */
export const MARK = {
  sun: "M14 37a18 18 0 0 1 36 0z",
  lines: [
    { x1: 9, x2: 55, y: 44 },
    { x1: 17, x2: 47, y: 50.5 },
    { x1: 25, x2: 39, y: 57 },
  ],
};

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
  return (
    <span className={clsx("group inline-flex items-center gap-2.5", className)}>
      <Mark className="h-[1.9em] w-[1.9em]" animated />
      <span className="flex flex-col leading-none">
        <span className="t-serif text-[1.35em] tracking-[0.28em]" style={{ fontVariationSettings: '"opsz" 60' }}>
          SUTON
        </span>
        {sub && <span className="t-eyebrow mt-1 whitespace-nowrap text-[0.5em] tracking-[0.34em] opacity-70">{subText}</span>}
      </span>
    </span>
  );
}
