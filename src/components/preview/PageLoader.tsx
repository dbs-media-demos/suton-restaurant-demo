import { loaderScript } from "@/lib/loader";
import { loaderSvg } from "@/lib/leadLogo";

/**
 * A preview with the lead's own logo opens on it, once per token in the tab: night, a candle glow,
 * the mark's outlines drawn stroke by stroke, their fills, the name sliding out of a mask over a
 * candle-lit horizon line, then the curtain lifts on an arched edge (the site's page transition,
 * the sun reversed) onto the homepage. Server HTML + CSS ("lead loader" in globals.css), so it's in
 * the first paint and draws before any JavaScript; the inline script only times the lift and lets
 * a click or key skip it (lib/loader).
 */
export function PageLoader({ token, svg }: { token: string; svg: string }) {
  return (
    <>
      <div className="lead-loader" aria-hidden data-no-translate>
        <div className="lead-loader__glow" />
        <div className="lead-loader__inner">
          <div className="lead-loader__logo lead-logo" dangerouslySetInnerHTML={{ __html: loaderSvg(svg) }} />
          <div className="lead-loader__line" />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: loaderScript(token) }} />
    </>
  );
}
