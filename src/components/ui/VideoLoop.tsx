"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Photo } from "./Photo";
import type { PhotoKey } from "@/content/photos";

type Props = {
  /** File name in /public/video without extension. */
  name: string;
  poster: PhotoKey;
  posterAlt?: string;
  sizes: string;
  className?: string;
  /** Start loading right after hydration (hero). Otherwise only when near the viewport. */
  eager?: boolean;
  preloadPoster?: boolean;
};

/**
 * Muted, looping background film. The poster is a real <Image> (fast LCP); the video is
 * attached only when it's near the viewport, pauses off-screen, and never autoplays for
 * reduced-motion or Save-Data visitors.
 */
export function VideoLoop({ name, poster, posterAlt = "", sizes, className, eager, preloadPoster }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    let visible = false;
    // Never compete with the first paint: wait for `load`, then an idle moment.
    let ready = document.readyState === "complete" && !eager;
    const attach = () => {
      if (!ready || !visible) return;
      setSrc(`/video/${name}.mp4`);
      v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) attach();
        else v.pause();
      },
      { rootMargin: eager ? "0px" : "300px 0px" },
    );
    io.observe(el);
    let idle: number | undefined;
    let timer: number | undefined;
    const go = () => {
      if (ready) return;
      ready = true;
      attach();
    };
    // Phones: an above-the-fold film waits for the first touch or scroll (or a few seconds),
    // so the poster and title own the first paint and no data is spent up front.
    const interactions = ["pointerdown", "touchstart", "scroll", "keydown"] as const;
    const deferToInteraction = eager && window.matchMedia("(pointer: coarse)").matches;
    const onLoad = () => {
      if (deferToInteraction) {
        interactions.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
        timer = window.setTimeout(go, 6000);
        return;
      }
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle = ric(go, { timeout: 2500 }) as number;
    };
    if (!ready) {
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
    }
    const onVis = () => (document.hidden ? v.pause() : visible && v.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      window.clearTimeout(timer);
      interactions.forEach((e) => window.removeEventListener(e, go));
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [name, eager]);

  useEffect(() => {
    if (src) video.current?.play().catch(() => {});
  }, [src]);

  return (
    <div ref={wrap} className={clsx("absolute inset-0 overflow-hidden", className)}>
      <Photo k={poster} alt={posterAlt} sizes={sizes} preload={preloadPoster} quality={60} />
      <video
        ref={video}
        src={src ?? undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={clsx(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms]",
          playing ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
