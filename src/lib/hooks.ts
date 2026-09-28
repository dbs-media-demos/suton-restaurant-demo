"use client";

import { useSyncExternalStore } from "react";

/** Media query as state; `false` on the server and during hydration. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noop = () => () => {};

/** A value that only exists in the browser (e.g. today's date); `null` on the server. */
export function useClientValue<T extends string | number | boolean>(read: () => T): T | null {
  return useSyncExternalStore(noop, read, () => null);
}
