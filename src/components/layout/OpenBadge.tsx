"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus, type OpenStatus } from "@/lib/time";
import { fmtTime } from "@/lib/site";
import type { Dict } from "@/i18n/dict";

/**
 * Live "Open now · closes at 00:00" badge in Belgrade time.
 * Renders a neutral placeholder on the server, then fills in after mount (no hydration mismatch).
 */
export function OpenBadge({ dict, className, detail = true }: { dict: Dict; className?: string; detail?: boolean }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const s = dict.status;
  const open = status?.state === "open";
  let text = "";
  if (status?.state === "open") {
    text = status.kitchenOpen ? `${s.closes} ${fmtTime(status.closesAt)} · ${s.kitchen} ${fmtTime(status.kitchenAt)}` : `${s.kitchenClosed} · ${s.closes} ${fmtTime(status.closesAt)}`;
  } else if (status) {
    text = `${status.opensToday ? s.opens : s.opensTomorrow} ${fmtTime(status.opensAt)}`;
  }

  return (
    <span className={clsx("inline-flex items-center gap-2 whitespace-nowrap", className)} aria-live="polite">
      <span
        className={clsx(
          "h-2 w-2 shrink-0 rounded-full transition-colors duration-500",
          status === null ? "bg-smoke/50" : open ? "pulse-dot bg-candle" : "bg-vranac-2",
        )}
        aria-hidden
      />
      <span className="t-eyebrow tracking-[0.18em]">
        {status === null ? dict.hours : open ? s.open : s.closed}
        {detail && text && <span className="ml-1.5 normal-case tracking-normal opacity-75">· {text}</span>}
      </span>
    </span>
  );
}
