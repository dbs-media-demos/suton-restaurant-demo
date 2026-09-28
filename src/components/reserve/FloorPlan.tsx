import clsx from "clsx";

export type Area = "indoor" | "terrace" | "counter";

const indoorTables = [
  [62, 62], [112, 62], [162, 62], [212, 62],
  [62, 112], [112, 112], [162, 112], [212, 112],
  [62, 160], [112, 160], [162, 160],
];
const terraceTables = [[58, 228], [108, 222], [158, 230], [208, 222], [258, 230], [308, 222], [352, 230]];
const stools = [252, 268, 284, 300, 316, 332, 348, 364];

/**
 * Top-down plan of Suton: the dining room, the kitchen counter by the fire, and the terrace
 * on the Sava. The chosen area lights up; the others fall back into the dark.
 */
export function FloorPlan({ area, labels }: { area: Area | null; labels: Record<Area, string> & { river: string; kitchen: string } }) {
  const on = (a: Area) => area === a;
  const dim = (a: Area) => (area && area !== a ? "opacity-30" : "opacity-100");

  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label={area ? labels[area] : labels.indoor}>
      {/* Building */}
      <rect x="20" y="24" width="360" height="170" rx="14" fill="var(--char)" stroke="currentColor" strokeOpacity="0.25" />

      {/* Dining room */}
      <g className={clsx("transition-opacity duration-700", dim("indoor"))}>
        <rect
          x="34" y="38" width="200" height="146" rx="10"
          fill={on("indoor") ? "rgb(227 168 87 / 0.1)" : "transparent"}
          stroke={on("indoor") ? "var(--candle)" : "currentColor"}
          strokeOpacity={on("indoor") ? 1 : 0.15}
          strokeDasharray={on("indoor") ? "0" : "3 4"}
          style={{ transition: "all .6s var(--ease-out-expo)" }}
        />
        {indoorTables.map(([x, y], i) => (
          <g key={i} style={{ transformOrigin: `${x}px ${y}px`, transition: `transform .6s var(--ease-out-expo) ${i * 30}ms`, transform: on("indoor") ? "scale(1.08)" : "scale(1)" }}>
            <circle cx={x} cy={y} r="11" fill="var(--night)" stroke={on("indoor") ? "var(--candle)" : "currentColor"} strokeOpacity={on("indoor") ? 0.9 : 0.35} />
            {on("indoor") && <circle cx={x} cy={y} r="2.2" fill="var(--candle)" className="flicker" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 170}ms` }} />}
          </g>
        ))}
        <text x="44" y="180" fontSize="8.5" letterSpacing="1.6" className="fill-smoke">{labels.indoor.toUpperCase()}</text>
      </g>

      {/* Kitchen + counter by the fire */}
      <g className={clsx("transition-opacity duration-700", dim("counter"))}>
        <rect x="246" y="38" width="122" height="52" rx="8" fill="var(--night)" stroke="currentColor" strokeOpacity="0.2" />
        <text x="256" y="52" fontSize="7.5" letterSpacing="1.4" className="fill-smoke">{labels.kitchen.toUpperCase()}</text>
        {/* The fire */}
        <circle cx="330" cy="66" r="14" fill="rgb(227 168 87 / 0.25)" className="flicker" style={{ transformOrigin: "330px 66px" }} />
        <path d="M330 56c5 6 7 10 3 16-2-3-4-4-6-2-2-4 0-9 3-14z" fill="var(--candle)" className="flicker" style={{ transformOrigin: "330px 66px" }} />
        <rect
          x="244" y="98" width="126" height="10" rx="5"
          fill={on("counter") ? "var(--oak)" : "var(--night)"}
          stroke={on("counter") ? "var(--candle)" : "currentColor"}
          strokeOpacity={on("counter") ? 1 : 0.3}
          style={{ transition: "all .6s var(--ease-out-expo)" }}
        />
        {stools.map((x, i) => (
          <circle
            key={x}
            cx={x} cy="120" r="4.5"
            fill={on("counter") ? "var(--candle)" : "var(--night)"}
            stroke={on("counter") ? "var(--candle)" : "currentColor"}
            strokeOpacity={on("counter") ? 1 : 0.35}
            style={{ transition: `fill .5s ${i * 40}ms` }}
          />
        ))}
        {on("counter") && <rect x="238" y="30" width="138" height="104" rx="10" fill="none" stroke="var(--candle)" strokeDasharray="4 4" className="river-flow" />}
        <text x="252" y="146" fontSize="8.5" letterSpacing="1.6" className="fill-smoke">{labels.counter.toUpperCase()}</text>
      </g>

      {/* Terrace on the river */}
      <g className={clsx("transition-opacity duration-700", dim("terrace"))}>
        <rect
          x="20" y="200" width="360" height="52" rx="10"
          fill={on("terrace") ? "rgb(227 168 87 / 0.1)" : "transparent"}
          stroke={on("terrace") ? "var(--candle)" : "currentColor"}
          strokeOpacity={on("terrace") ? 1 : 0.2}
          strokeDasharray={on("terrace") ? "0" : "3 4"}
          style={{ transition: "all .6s var(--ease-out-expo)" }}
        />
        {/* String lights */}
        <path d="M24 204 Q 110 214 200 204 T 376 204" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={34 + i * 25} cy={206 + Math.sin(i / 1.4) * 3} r="1.6" fill={on("terrace") ? "var(--candle-2)" : "var(--smoke)"} className={on("terrace") ? "flicker" : undefined} style={{ transformOrigin: `${34 + i * 25}px 206px`, animationDelay: `${i * 120}ms` }} />
        ))}
        {terraceTables.map(([x, y], i) => (
          <g key={i} style={{ transformOrigin: `${x}px ${y}px`, transition: `transform .6s var(--ease-out-expo) ${i * 40}ms`, transform: on("terrace") ? "scale(1.1)" : "scale(1)" }}>
            <circle cx={x} cy={y} r="9" fill="var(--night)" stroke={on("terrace") ? "var(--candle)" : "currentColor"} strokeOpacity={on("terrace") ? 0.9 : 0.35} />
            {on("terrace") && <circle cx={x} cy={y} r="2" fill="var(--candle)" className="flicker" style={{ transformOrigin: `${x}px ${y}px` }} />}
          </g>
        ))}
        <text x="28" y="248" fontSize="8.5" letterSpacing="1.6" className="fill-smoke">{labels.terrace.toUpperCase()}</text>
      </g>

      {/* The Sava */}
      <g fill="none" stroke="var(--candle)" strokeOpacity="0.35" strokeLinecap="round">
        <path d="M0 266 Q 50 260 100 266 T 200 266 T 300 266 T 400 266" className="river-flow" />
        <path d="M0 278 Q 50 272 100 278 T 200 278 T 300 278 T 400 278" className="river-flow" style={{ animationDuration: "3.6s" }} />
        <path d="M0 290 Q 50 284 100 290 T 200 290 T 300 290 T 400 290" className="river-flow" style={{ animationDuration: "4.4s" }} />
      </g>
      <text x="352" y="296" fontSize="8" letterSpacing="2" className="fill-candle" fontStyle="italic">{labels.river}</text>
    </svg>
  );
}
