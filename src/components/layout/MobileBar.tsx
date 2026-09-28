import Link from "next/link";
import { site } from "@/lib/site";
import type { Dict } from "@/i18n/dict";

/** Sticky bottom bar on phones: Call + Book. */
export function MobileBar({ dict, reserveHref }: { dict: Dict; reserveHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-night/85 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_1.6fr] gap-2.5">
        <a
          href={`tel:${site.phone}`}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-[0.95rem] text-cream"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
          </svg>
          {dict.call}
        </a>
        <Link href={reserveHref} className="flex h-12 items-center justify-center rounded-full bg-candle text-[0.95rem] font-medium text-night">
          {dict.reserve}
        </Link>
      </div>
    </div>
  );
}
