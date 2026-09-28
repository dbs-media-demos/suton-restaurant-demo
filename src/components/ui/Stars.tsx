import clsx from "clsx";

const Row = () => (
  <>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} viewBox="0 0 20 20" className="h-[1em] w-[1em] shrink-0" aria-hidden>
        <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" fill="currentColor" />
      </svg>
    ))}
  </>
);

/** Five stars with fractional fill (no SVG ids, so any number can share a page). */
export function Stars({ value, className, label }: { value: number; className?: string; label?: string }) {
  return (
    <span className={clsx("relative inline-flex", className)} role="img" aria-label={label ?? `${value} / 5`}>
      <span className="flex gap-0.5 opacity-25">
        <Row />
      </span>
      <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
        <Row />
      </span>
    </span>
  );
}
