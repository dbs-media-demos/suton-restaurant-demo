"use client";

import Link from "next/link";
import { useBiz } from "@/components/preview/BizContext";
import type { Dict } from "@/i18n/dict";

const phoneIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

/** Fixed bottom bar on phones, opaque: Menu + Reserve. A preview is one page, so its Menu scrolls there and it offers Call instead. */
export function MobileBar({ dict, menuHref, reserveHref }: { dict: Dict; menuHref: string; reserveHref: string }) {
  const biz = useBiz();
  const left = "flex h-12 items-center justify-center rounded-full border border-line text-[0.95rem] text-cream";
  const right = "flex h-12 items-center justify-center gap-2 rounded-full bg-candle text-[0.95rem] font-medium text-night";
  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] hidden border-t border-line bg-night px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 phone:block">
      <div className="grid grid-cols-[1fr_1.6fr] gap-2.5">
        {biz.preview ? (
          <>
            <a href="#menu-title" className={left}>
              {dict.nav.menu}
            </a>
            {biz.phone ? (
              <a href={`tel:${biz.phone}`} className={`${right} t-num`}>
                {phoneIcon}
                {biz.phoneDisplay}
              </a>
            ) : (
              <a href="#cta-title" className={right}>
                {dict.reserve}
              </a>
            )}
          </>
        ) : (
          <>
            <Link href={menuHref} className={left}>
              {dict.nav.menu}
            </Link>
            <Link href={reserveHref} className={right}>
              {dict.reserve}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
