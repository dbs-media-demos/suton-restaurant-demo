"use client";

import { prefersReducedMotion } from "@/lib/motion";

/*
 * The gate and the guard for the desktop 3D (the hero's glass, the cellar's bottle). Nothing here
 * imports three.js: the scenes themselves are only imported once `canRun3D()` has passed.
 *
 * - One scene warms up at a time, the hero first, in idle time after load: the still stays on
 *   screen until a scene's shaders are compiled and a frame has been drawn off screen.
 * - Before three.js is even imported, a second of the page's own frames: a computer that can't
 *   hold 45 fps without the 3D keeps the stills and never downloads it.
 * - The first 2 s a scene is on screen are watched. Under about 45 fps, or a frame over 100 ms
 *   after the first quarter second, and every scene fades back to its still for the rest of the
 *   visit (sessionStorage), so the next one never starts.
 */

/** Live 3D only for a big screen with a mouse (and no ask for less motion or data). */
export const LIVE_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const KEY = "suton:3d";
/** Sent when this computer turns out too slow: every live scene fades back to its still. */
export const STILL_EVENT = "suton:3d-still";

export function stillOnly() {
  try {
    return sessionStorage.getItem(KEY) === "still";
  } catch {
    return false;
  }
}

/** Remember for the visit that this computer keeps the stills, and tell the scenes already running. */
export function keepStills() {
  try {
    sessionStorage.setItem(KEY, "still");
  } catch {}
  window.dispatchEvent(new Event(STILL_EVENT));
}

export function canRun3D() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return window.matchMedia(LIVE_3D).matches && !prefersReducedMotion() && !saveData && !stillOnly();
}

export const afterLoad = () =>
  new Promise<void>((done) => {
    if (document.readyState === "complete") done();
    else window.addEventListener("load", () => done(), { once: true });
  });

/** The browser's next idle moment (or `timeout` ms at the latest). */
export const idle = (timeout = 1500) =>
  new Promise<void>((done) => {
    if (window.requestIdleCallback) window.requestIdleCallback(() => done(), { timeout });
    else window.setTimeout(done, 50);
  });

export const wait = (ms: number) => new Promise<void>((done) => window.setTimeout(done, ms));

let queue: Promise<unknown> = Promise.resolve();
/** Runs scene warm-ups one after another, in the order they were asked for. */
export function inTurn(job: () => Promise<unknown>) {
  const run = queue.then(job);
  queue = run.catch(() => {});
  return run;
}

const WATCH_MS = 2000;
const WARMUP_MS = 250;
const MIN_FPS = 45;
const MAX_FRAME_MS = 100;

/**
 * Watches the page's frames for the first 2 s that `onScreen()` holds (time off screen or in a
 * hidden tab doesn't count). Resolves true if this computer is too slow for the scene. `spikes`
 * off judges the average alone.
 */
export function watchFrames(onScreen: () => boolean, { ms = WATCH_MS, spikes = true } = {}) {
  let raf = 0;
  let last = 0;
  let time = 0;
  let frames = 0;
  let stopped = false;
  const reset = () => (last = 0);
  const stop = () => {
    stopped = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", reset);
  };
  const verdict = new Promise<boolean>((resolve) => {
    const done = (slow: boolean) => {
      stop();
      resolve(slow);
    };
    const tick = (now: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(tick);
      if (document.hidden || !onScreen()) return reset();
      if (last) {
        const dt = now - last;
        if (spikes && time > WARMUP_MS && dt > MAX_FRAME_MS) return done(true);
        time += dt;
        frames++;
        if (time >= ms) return done((frames / time) * 1000 < MIN_FPS);
      }
      last = now;
    };
    document.addEventListener("visibilitychange", reset);
    raf = requestAnimationFrame(tick);
  });
  return { verdict, stop };
}

/**
 * Ready for a scene: the page loaded, the browser idle, the checks passed, and a second of the
 * page's own frames at 45 fps or better (if not, the stills stay for the visit).
 */
export async function readyFor3D() {
  await afterLoad();
  await idle();
  if (!canRun3D()) return false;
  if (await watchFrames(() => true, { ms: 1000, spikes: false }).verdict) {
    keepStills();
    return false;
  }
  return canRun3D();
}
