/**
 * Stylised map of central Belgrade (not to scale): the Sava meeting the Danube below the
 * fortress, the bridges, and Suton's pin in Savamala.
 */
export function CityMap({ labels }: { labels: { sava: string; danube: string; fortress: string; newBelgrade: string; oldTown: string; savamala: string; bridge: string; station: string; label: string } }) {
  return (
    <svg viewBox="0 0 600 440" className="h-auto w-full" role="img" aria-label={labels.label}>
      <defs>
        <radialGradient id="cm-glow">
          <stop offset="0" stopColor="var(--candle)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--candle)" stopOpacity="0" />
        </radialGradient>
        <pattern id="cm-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="var(--cream)" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="600" height="440" fill="url(#cm-grid)" />

      {/* Rivers */}
      <path d="M-10 380 C 90 360 170 330 230 280 C 280 238 300 190 330 150 C 350 124 380 100 420 60" fill="none" stroke="var(--oak)" strokeWidth="46" strokeLinecap="round" opacity="0.85" />
      <path d="M300 -10 C 330 40 370 60 420 60 C 480 60 540 90 610 150" fill="none" stroke="var(--oak)" strokeWidth="64" strokeLinecap="round" opacity="0.85" />
      <path d="M-10 380 C 90 360 170 330 230 280 C 280 238 300 190 330 150 C 350 124 380 100 420 60" fill="none" stroke="var(--candle)" strokeOpacity="0.4" strokeWidth="1.2" className="river-flow" />
      <path d="M300 -10 C 330 40 370 60 420 60 C 480 60 540 90 610 150" fill="none" stroke="var(--candle)" strokeOpacity="0.4" strokeWidth="1.2" className="river-flow" />

      {/* Bridges */}
      <g stroke="var(--cream)" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round">
        <line x1="290" y1="172" x2="352" y2="206" />
        <line x1="222" y1="262" x2="276" y2="306" />
        <line x1="140" y1="322" x2="170" y2="378" />
      </g>
      <text x="356" y="222" fontSize="10" className="fill-smoke" letterSpacing="1">{labels.bridge}</text>

      {/* Streets (Old Town grid) */}
      <g stroke="var(--cream)" strokeOpacity="0.14" strokeWidth="2" fill="none">
        <path d="M340 190 L 470 150 L 560 180" />
        <path d="M350 240 L 480 210 L 590 250" />
        <path d="M320 300 L 450 270 L 600 310" />
        <path d="M420 120 L 440 420" />
        <path d="M500 130 L 520 420" />
        <path d="M300 250 L 310 440" />
      </g>
      {/* Karađorđeva along the Sava */}
      <path d="M268 246 C 300 212 318 180 344 150" fill="none" stroke="var(--cream)" strokeOpacity="0.35" strokeWidth="3" />

      {/* Fortress */}
      <path d="M392 96 l28 -12 l30 10 l6 30 l-24 18 l-32 -6 z" fill="none" stroke="var(--cream)" strokeOpacity="0.5" strokeWidth="1.5" />
      <text x="464" y="112" fontSize="11" className="fill-cream" letterSpacing="1.5">{labels.fortress}</text>

      <text x="70" y="300" fontSize="12" className="fill-smoke" letterSpacing="3">{labels.newBelgrade}</text>
      <text x="470" y="330" fontSize="12" className="fill-smoke" letterSpacing="3">{labels.oldTown}</text>
      <text x="120" y="398" fontSize="11" className="fill-candle" fontStyle="italic" letterSpacing="2" transform="rotate(-14 120 398)">{labels.sava}</text>
      <text x="500" y="70" fontSize="11" className="fill-candle" fontStyle="italic" letterSpacing="2" transform="rotate(18 500 70)">{labels.danube}</text>
      <text x="360" y="284" fontSize="10" className="fill-smoke" letterSpacing="1">{labels.station}</text>
      <circle cx="350" cy="270" r="3" fill="var(--smoke)" />

      {/* Suton */}
      <g>
        <circle cx="296" cy="214" r="34" fill="url(#cm-glow)" className="flicker" style={{ transformOrigin: "296px 214px" }} />
        <path d="M284 218a12 12 0 0 1 24 0z" fill="var(--candle)" />
        <line x1="282" y1="223" x2="310" y2="223" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" />
        <line x1="287" y1="228" x2="305" y2="228" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" />
        <text x="232" y="196" fontSize="15" className="fill-cream" style={{ fontFamily: "var(--font-serif)" }}>Suton</text>
        <text x="232" y="182" fontSize="9" className="fill-smoke" letterSpacing="2">{labels.savamala}</text>
      </g>
    </svg>
  );
}
