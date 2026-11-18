import { PourMotion } from "./PourMotion";

/*
 * The /v2 hero's centrepiece, with no three.js and no WebGL: a crystal glass on the counter in
 * front of the fire pit, and the first glass of the evening being poured into it. SVG + CSS
 * (globals.css, "v2 hero"), so the pour starts before any JavaScript: the stream comes down,
 * the red rises (slowing as the bowl widens, as it would at a steady pour), the light through it
 * turns the counter red, sparks lift off the coals. After load, moving the mouse swirls the wine
 * (a small spring model: circles make it run round the bowl and leave tears on the glass), and
 * the scroll brings the glass to the middle of the arch, as the camera does on /.
 * Phones never see it: the hero shows them the same still and first screen as on /.
 */

/** DESKTOP in src/lib/motion.ts (a client module, so its constants can't be read here). */
const DESKTOP = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

const BG = {
  avif: "/images/posters/fire-v2-1600.avif 1600w, /images/posters/fire-v2-2400.avif 2400w",
  webp: "/images/posters/fire-v2-1600.webp 1600w",
  none: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
};

/** The bowl in the glass's own units (viewBox 0 0 200 490): rim at y 12, widest at 165, stem at 266. */
const BOWL = "M30 12C22 60 6 115 8 165C10 225 50 258 94 266L106 266C150 258 190 225 192 165C194 115 178 60 170 12Z";
/** Tears on the glass after a swirl: x, length. */
const TEARS: [number, number][] = [
  [27, 31],
  [44, 40],
  [61, 33],
  [109, 30],
  [139, 43],
  [158, 32],
  [172, 37],
];
const SPARKS = 18;

export function PourHero({ hint }: { hint: string }) {
  return (
    <div className="pour absolute inset-0 overflow-hidden" aria-hidden>
      <link rel="preload" as="image" type="image/avif" imageSrcSet={BG.avif} imageSizes="100vw" media={DESKTOP} fetchPriority="high" />

      {/* The fire pit, out of focus behind the counter */}
      <div data-pour-bg className="pour-bg absolute inset-0">
        <picture>
          <source media={DESKTOP} type="image/avif" srcSet={BG.avif} sizes="100vw" />
          <source media={DESKTOP} type="image/webp" srcSet={BG.webp} sizes="100vw" />
          <img src={BG.none} alt="" width={2400} height={1602} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div className="pour-flicker absolute inset-0" />
        <div className="pour-sparks absolute inset-0">
          {Array.from({ length: SPARKS }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>

      {/* The counter: dark oak, the fire's glow along its edge */}
      <div data-pour-counter className="pour-counter absolute inset-x-0 bottom-0" />

      <div data-glass className="pour-glass absolute">
        <svg viewBox="0 0 200 490" overflow="visible" className="h-full w-full">
          <defs>
            <clipPath id="pour-bowl">
              <path d={BOWL} />
            </clipPath>
            <linearGradient id="pour-crystal" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff1e0" stopOpacity="0.26" />
              <stop offset="0.1" stopColor="#fff1e0" stopOpacity="0.06" />
              <stop offset="0.5" stopColor="#fff1e0" stopOpacity="0.015" />
              <stop offset="0.88" stopColor="#ffd9a8" stopOpacity="0.08" />
              <stop offset="1" stopColor="#ffd9a8" stopOpacity="0.3" />
            </linearGradient>
            {/* Deep garnet in the middle, where the light goes through the most wine */}
            <linearGradient id="pour-wine" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#52061a" />
              <stop offset="0.14" stopColor="#30020c" />
              <stop offset="0.32" stopColor="#170006" />
              <stop offset="1" stopColor="#100004" />
            </linearGradient>
            {/* Ruby at the edges, where it's thin (the bowl spans 0.21-0.79 of this rect) */}
            <linearGradient id="pour-rim" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0.2" stopColor="#c4243c" stopOpacity="0.75" />
              <stop offset="0.27" stopColor="#a0142c" stopOpacity="0.32" />
              <stop offset="0.4" stopColor="#80101f" stopOpacity="0" />
              <stop offset="0.62" stopColor="#80101f" stopOpacity="0" />
              <stop offset="0.73" stopColor="#b81c34" stopOpacity="0.38" />
              <stop offset="0.8" stopColor="#e0384a" stopOpacity="0.8" />
            </linearGradient>
            {/* The fire behind lights it from the back-left */}
            <radialGradient id="pour-backlight" cx="0.4" cy="0.12" r="0.3">
              <stop offset="0" stopColor="#ff4a36" stopOpacity="0.42" />
              <stop offset="0.6" stopColor="#c01428" stopOpacity="0.12" />
              <stop offset="1" stopColor="#c01428" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pour-coat" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#8a1226" stopOpacity="0" />
              <stop offset="0.62" stopColor="#8a1226" stopOpacity="0.3" />
              <stop offset="1" stopColor="#8a1226" stopOpacity="0.34" />
            </linearGradient>
            <linearGradient id="pour-tear" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#a8182e" stopOpacity="0.15" />
              <stop offset="0.6" stopColor="#a8182e" stopOpacity="0.55" />
              <stop offset="1" stopColor="#8a1226" stopOpacity="0.75" />
            </linearGradient>
            {/* The surface seen from just above: the far side catches the light */}
            <linearGradient id="pour-surface" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b8243a" />
              <stop offset="0.5" stopColor="#6e0b1e" />
              <stop offset="1" stopColor="#3a030e" />
            </linearGradient>
            <linearGradient id="pour-stream" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#3d0410" />
              <stop offset="0.5" stopColor="#7d0f22" />
              <stop offset="1" stopColor="#b1263a" />
            </linearGradient>
            <linearGradient id="pour-stem" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff1e0" stopOpacity="0.5" />
              <stop offset="0.45" stopColor="#fff1e0" stopOpacity="0.08" />
              <stop offset="1" stopColor="#ffcf96" stopOpacity="0.45" />
            </linearGradient>
            <radialGradient id="pour-foot" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.7" stopColor="#fff1e0" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffe2bc" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id="pour-caustic" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ff3048" stopOpacity="0.75" />
              <stop offset="0.45" stopColor="#b0102a" stopOpacity="0.4" />
              <stop offset="1" stopColor="#6a0414" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pour-shadow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#000" stopOpacity="0.55" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* On the counter: the foot's shadow and the red light through the wine */}
          <ellipse cx="100" cy="470" rx="96" ry="13" fill="url(#pour-shadow)" />
          <ellipse className="pour-caustic" cx="56" cy="498" rx="78" ry="15" fill="url(#pour-caustic)" />

          {/* The pour, from a bottle above the frame */}
          <g className="pour-stream">
            <path d="M119 -420 C119 -200 118.6 0 118.4 262" pathLength={1} stroke="url(#pour-stream)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M120.6 -420 C120.6 -200 120.2 0 120 262" pathLength={1} stroke="#ff9a90" strokeOpacity="0.5" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </g>

          {/* The wine, inside the bowl */}
          <g clipPath="url(#pour-bowl)">
            <g className="pour-level">
              {/* After a swirl: a film of wine on the glass, and tears running back down it */}
              <g className="pour-tears">
                <path d="M0 -27Q20 -37 40 -29T80 -31T120 -26T160 -34T200 -27L200 22L0 22Z" fill="url(#pour-coat)" />
                {TEARS.map(([tx, len]) => (
                  <path key={tx} d={`M${tx - 0.45} ${-len}L${tx + 0.45} ${-len}L${tx + 1} ${-len * 0.3}a1.6 1.6 0 1 1 -2 0Z`} fill="url(#pour-tear)" />
                ))}
              </g>
              <g data-slosh className="pour-slosh">
                <rect x="-60" y="0" width="320" height="300" fill="url(#pour-wine)" />
                <rect x="-60" y="0" width="320" height="300" fill="url(#pour-rim)" />
                <rect x="-60" y="0" width="320" height="300" fill="url(#pour-backlight)" />
                <g data-tilt>
                <g className="pour-surface">
                  <ellipse cx="100" cy="0" rx="94" ry="8.5" fill="url(#pour-surface)" />
                  <ellipse className="pour-froth" cx="100" cy="0" rx="92" ry="7.8" fill="none" stroke="#e8a0a4" strokeWidth="1.4" />
                  <path className="pour-sheen" d="M118 -6.5 Q160 -5.5 186 -1.5" stroke="#ffd2c0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </g>
                </g>
                <ellipse className="pour-ripple" cx="118" cy="0" rx="22" ry="2.4" fill="none" stroke="#f2b0b4" strokeWidth="0.9" />
                <ellipse className="pour-ripple pour-ripple-2" cx="118" cy="0" rx="22" ry="2.4" fill="none" stroke="#f2b0b4" strokeWidth="0.9" />
              </g>
            </g>
          </g>

          {/* The crystal over it */}
          <path d={BOWL} fill="url(#pour-crystal)" stroke="#ffe9d2" strokeOpacity="0.42" strokeWidth="1.1" />
          <ellipse cx="100" cy="12" rx="70" ry="4.6" fill="none" stroke="#fff3e4" strokeOpacity="0.62" strokeWidth="1.1" />
          <path d="M42 34 C34 86 31 138 38 196" stroke="#fffaf2" strokeOpacity="0.55" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M52 30 C47 60 45 84 45 104" stroke="#fffaf2" strokeOpacity="0.3" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path className="pour-glint" d="M160 26 C170 72 176 120 174 172" stroke="#ffc985" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="96.6" y="264" width="6.8" height="196" rx="3" fill="url(#pour-stem)" />
          <path d="M94 266 Q100 270 106 266" stroke="#ffe9d2" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <path d="M96.6 452 Q98 462 62 466 L138 466 Q102 462 103.4 452z" fill="#fff1e0" fillOpacity="0.16" />
          <ellipse cx="100" cy="467" rx="68" ry="8" fill="url(#pour-foot)" stroke="#ffe9d2" strokeOpacity="0.4" strokeWidth="1" />
        </svg>
      </div>

      <PourMotion hint={hint} />
    </div>
  );
}
