"use client";

import { useState } from "react";
import { useClientValue } from "@/lib/hooks";
import type { Dict } from "@/i18n/dict";
import { site } from "@/lib/site";

const KEY = "suton-demo-badge-hidden";

/** Small fixed "Concept site by Scale by Noon ↗" pill with a dismiss button. */
export function DemoBadge({ dict }: { dict: Dict }) {
  const [dismissed, setHidden] = useState(false);
  const stored = useClientValue(() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });

  if (dismissed || stored) return null;

  return (
    <div className="anim-fade fixed bottom-[5.6rem] left-3 z-[150] flex items-center rounded-full border border-cream/15 bg-night/80 pl-4 text-[0.78rem] text-cream shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md md:bottom-5 md:left-5" style={{ "--d": "2.2s" } as React.CSSProperties}>
      <a href={site.agencyUrl} target="_blank" rel="noopener" className="flex h-9 items-center gap-2 hover:text-candle">
        <span className="h-1.5 w-1.5 rounded-full bg-candle" aria-hidden />
        {dict.badge.text} <span aria-hidden>↗</span>
      </a>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="ml-1 grid h-9 w-9 place-items-center rounded-full text-cream/60 hover:text-cream"
        aria-label={dict.badge.dismiss}
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
    </div>
  );
}
