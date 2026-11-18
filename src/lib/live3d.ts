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
 * - The first 2 s a scene is on screen are watched (its first 5 frames, the GPU's first draws, don't
 *   count). Under about 45 fps, a 3rd frame over 100 ms or one over 400 ms, and every scene on the
 *   page fades back to its still, so the next one never starts. That costs only this page load:
 *   the stills stay for the rest of the visit (sessionStorage) after two slow page loads, or at
 *   once when there's no real GPU. One slow start used to keep them for the whole tab, so on
 *   18 Nov every refresh got the stills.
 */

/** Live 3D only for a big screen with a mouse (and no ask for less motion or data). */
export const LIVE_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** "gpu": no real GPU, stills for the visit. An old "still" here (one slow start) no longer counts. */
const KEY = "suton:3d";
/** Slow page loads in this tab so far: two keep the stills for the visit. */
const SLOW_KEY = "suton:3d-slow";
const SLOW_LIMIT = 2;

// This page load ran slow: the scenes after it stay stills too (counted once per load)
let slowHere = false;
/** Sent when this computer turns out too slow: every live scene fades back to its still. */
export const STILL_EVENT = "suton:3d-still";

export function stillOnly() {
  if (slowHere) return true;
  try {
    return sessionStorage.getItem(KEY) === "gpu" || Number(sessionStorage.getItem(SLOW_KEY) || 0) >= SLOW_LIMIT;
  } catch {
    return false;
  }
}

/**
 * Stills for the rest of this page load, and tell the scenes already running. No real GPU (`"gpu"`)
 * keeps them for the visit; a slow verdict counts one slow load toward the two that do.
 */
export function keepStills(why: "gpu" | "slow" = "slow") {
  try {
    if (why === "gpu") sessionStorage.setItem(KEY, why);
    else if (!slowHere) sessionStorage.setItem(SLOW_KEY, String(Number(sessionStorage.getItem(SLOW_KEY) || 0) + 1));
  } catch {}
  if (why === "slow") slowHere = true;
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
/** The first frames pay one-off costs (a refresh's first draw took 371 ms on a PC that then ran 112 fps). */
const GRACE_FRAMES = 5;
const MIN_FPS = 45;
/** A hitch or two (a font, an image decode, another tab) isn't a slow computer: the 3rd one is, or one over 4x this. */
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
  let warm = GRACE_FRAMES;
  let hitches = 0;
  let stopped = false;
  const reset = () => (last = 0);
  const stop = () => {
    stopped = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", reset);
  };
  const verdict = new Promise<boolean>((resolve) => {
    const done = (slow: boolean, why: string) => {
      stop();
      performance.mark("3d:watch", { detail: { slow, why, fps: time ? Math.round((frames * 1000) / time) : 0, frames } });
      resolve(slow);
    };
    const tick = (now: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(tick);
      if (document.hidden || !onScreen()) return reset();
      if (last) {
        const dt = now - last;
        if (warm > 0) {
          warm--;
          last = now;
          return;
        }
        if (spikes && dt > MAX_FRAME_MS && (++hitches >= 3 || dt > MAX_FRAME_MS * 4)) return done(true, `frame ${Math.round(dt)} ms (hitch ${hitches})`);
        time += dt;
        frames++;
        if (time >= ms) {
          const slow = (frames / time) * 1000 < MIN_FPS;
          return done(slow, slow ? "fps" : "ok");
        }
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
