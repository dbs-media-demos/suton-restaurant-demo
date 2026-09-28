import clsx from "clsx";

export type MapPin = { id: string; x: number; y: number; label: string };

/**
 * A stylised river map of Serbia's wine country (not to scale): the Danube, the Sava and the
 * Morava, Belgrade where they meet, and clickable pins.
 */
export function RiverMap({
  pins,
  active,
  onSelect,
  home,
  className,
  selectLabel,
}: {
  pins: MapPin[];
  active?: string | null;
  onSelect?: (id: string) => void;
  home: string;
  className?: string;
  selectLabel?: string;
}) {
  return (
    <svg viewBox="0 0 300 330" className={clsx("h-auto w-full", className)} role={onSelect ? "group" : "img"} aria-label={selectLabel}>
      <defs>
        <radialGradient id="pinGlow">
          <stop offset="0" stopColor="var(--candle)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--candle)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" className="text-cream/35">
        {/* Danube */}
        <path d="M58 8 C 80 40 100 52 124 66 C 146 80 150 100 150 116 C 180 116 208 106 236 116 C 258 124 268 138 292 148" strokeWidth="2.2" className="river-flow" />
        {/* Sava */}
        <path d="M6 130 C 56 128 104 124 150 116" strokeWidth="1.8" className="river-flow" />
        {/* Velika Morava */}
        <path d="M188 112 C 186 150 176 190 174 234 C 172 262 180 290 176 322" strokeWidth="1.3" className="river-flow" />
        {/* Timok */}
        <path d="M284 148 C 280 176 272 200 266 226" strokeWidth="1" />
      </g>
      <g className="t-eyebrow" fontSize="7" letterSpacing="1.5" fill="currentColor">
        <text x="66" y="28" className="fill-smoke">DUNAV</text>
        <text x="30" y="122" className="fill-smoke">SAVA</text>
        <text x="190" y="190" className="fill-smoke">MORAVA</text>
      </g>
      {/* Belgrade: where Suton is */}
      <g>
        <circle cx="150" cy="116" r="12" fill="url(#pinGlow)" className="flicker" style={{ transformOrigin: "150px 116px" }} />
        <path d="M143 118a7 7 0 0 1 14 0z" fill="var(--candle)" />
        <text x="160" y="132" fontSize="8" className="fill-cream" letterSpacing="1">
          {home}
        </text>
      </g>
      {pins.map((p) => {
        const on = active === p.id;
        const pin = (
          <>
            <circle cx={p.x} cy={p.y} r={on ? 22 : 0} fill="url(#pinGlow)" style={{ transition: "r .7s var(--ease-out-expo)" }} />
            <circle cx={p.x} cy={p.y} r={on ? 6 : 4.5} fill={on ? "var(--candle)" : "var(--night)"} stroke="var(--candle)" strokeWidth="1.5" style={{ transition: "r .5s var(--ease-out-expo), fill .3s" }} />
            <text x={p.x + 10} y={p.y + 3} fontSize="9" className={on ? "fill-candle" : "fill-cream"} style={{ fontFamily: "var(--font-serif)" }}>
              {p.label}
            </text>
          </>
        );
        return onSelect ? (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={p.label}
            className="cursor-pointer"
            onClick={() => onSelect(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.id);
              }
            }}
          >
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            {pin}
          </g>
        ) : (
          <g key={p.id}>{pin}</g>
        );
      })}
    </svg>
  );
}
