/*
 * The page loader on a preview with the lead's own logo (components/preview/PageLoader): while it
 * shows, <html> carries `data-loading`, and when it starts to lift a `loader:done` event goes out.
 * The homepage's own entrance (the 3D glass fading in, /v2's pour, the hero letters) waits for it.
 */

export const LOADER_DONE = "loader:done";

/** True while the loader covers the page (never on the concept site or a repeat view). */
export const loaderShowing = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-loading");

/** Runs `cb` once the loader lifts, or at once when there is none. Returns a cancel. */
export function whenLoaderDone(cb: () => void) {
  if (!loaderShowing()) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(LOADER_DONE, on, { once: true });
  return () => window.removeEventListener(LOADER_DONE, on);
}

export const loaderDone = () => new Promise<void>((done) => whenLoaderDone(done));

/** Timings in ms, shared with the CSS in globals.css ("lead loader"). */
export const LOADER_MS = { exitAt: 1550, exit: 700, reducedExitAt: 600, reducedExit: 450, skip: 450, max: 3000 };

/**
 * The inline script that runs as the overlay is parsed, before the first paint: a repeat view of
 * this token in the tab hides it at once; otherwise it times the lift (CSS draws everything) and
 * lets a click, key, wheel or touch skip it. `loader:done` goes out when the overlay's own CSS exit
 * really starts (read off its animation once the first one has started), not 1.55 s after the
 * script: the CSS clock starts at the first paint, a few hundred ms later.
 * Plain ES5, no React needed, so a slow hydration can't hold the page behind it for over 3 s.
 */
export function loaderScript(token: string) {
  const t = LOADER_MS;
  return `(function(){var d=document.documentElement,k=${JSON.stringify(`lead-loader:${token}`)};
try{if(sessionStorage.getItem(k)){d.setAttribute("data-loader","skip");return}sessionStorage.setItem(k,"1")}catch(e){}
var r=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,ended=false,ev=["pointerdown","keydown","wheel","touchstart"],t1,t2;
d.setAttribute("data-loading","");d.setAttribute("data-lead-intro","");
function hide(){d.setAttribute("data-loader","done")}
function sk(){end(true)}
function end(skip){if(ended)return;ended=true;clearTimeout(t1);d.setAttribute("data-loader",skip?"skip-now":"out");d.removeAttribute("data-loading");
for(var i=0;i<ev.length;i++)removeEventListener(ev[i],sk,true);
window.dispatchEvent(new Event(${JSON.stringify(LOADER_DONE)}));t2=setTimeout(hide,skip?${t.skip}:(r?${t.reducedExit}:${t.exit}))}
for(var i=0;i<ev.length;i++)addEventListener(ev[i],sk,{capture:true,passive:true});
var el=document.currentScript&&document.currentScript.previousElementSibling,go=false;
function start(){if(go)return;go=true;var w=r?0:${t.exitAt},a=el&&el.getAnimations&&el.getAnimations()[0];
try{if(a&&a.startTime!=null)w=a.startTime+a.effect.getTiming().delay-performance.now()}catch(e){}
t1=setTimeout(function(){end(false)},Math.max(0,w))}
if(el)el.addEventListener("animationstart",start);
setTimeout(start,r?${t.reducedExitAt + 300}:700);
setTimeout(function(){end(false);clearTimeout(t2);hide()},${t.max});})();`;
}
