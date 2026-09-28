import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "candle" | "ghost" | "cream" | "ink";

const styles: Record<Variant, string> = {
  candle: "bg-candle text-night hover:bg-candle-2",
  cream: "bg-cream text-night hover:bg-candle",
  ghost: "border border-current/30 text-current hover:border-current",
  ink: "bg-ink text-paper hover:bg-vranac",
};

/** Pill link with a sliding arrow. `magnetic` adds the cursor pull on desktop. */
export function Button({
  href,
  children,
  variant = "candle",
  className,
  magnetic,
  arrow = true,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  external?: boolean;
}) {
  const cls = clsx(
    "group inline-flex h-13 min-h-12 items-center gap-3 rounded-full px-7 text-[0.98rem] font-medium transition-colors duration-500",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="relative -mr-1 inline-block h-4 w-4 overflow-hidden" aria-hidden>
          <span className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-full">→</span>
          <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0">→</span>
        </span>
      )}
    </>
  );
  const el = external || href.startsWith("tel:") || href.startsWith("mailto:") ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
