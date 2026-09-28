import { ScrubWords, Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { PhotoKey } from "@/content/photos";

const Pill = ({ k, video }: { k: PhotoKey; video?: boolean }) => (
  <span className="relative mx-[0.12em] inline-block h-[0.78em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline" aria-hidden>
    <Photo k={k} alt="" sizes="160px" quality={60} />
    {video && <span className="flicker absolute inset-0 bg-candle/20 mix-blend-overlay" />}
  </span>
);

/** Big serif manifesto whose words light up as you scroll, with photo pills set into the text. */
export function Manifesto({ eyebrow, text, pills, footnotes }: { eyebrow: string; text: string; pills: Record<number, PhotoKey>; footnotes: { n: string; label: string }[] }) {
  const inserts = Object.fromEntries(Object.entries(pills).map(([i, k]) => [Number(i), <Pill key={i} k={k} video={k.startsWith("fire")} />]));
  return (
    <section className="relative py-[clamp(7rem,16vw,14rem)]">
      <div className="wrap">
        <p className="t-eyebrow text-candle">{eyebrow}</p>
        <ScrubWords
          text={text}
          inserts={inserts}
          className="t-serif mt-8 max-w-[22ch] text-[clamp(2.1rem,5.6vw,5.9rem)] leading-[1.04] tracking-[-0.025em] md:max-w-[20ch]"
        />
        <Reveal stagger={0.1} className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
          {footnotes.map((f) => (
            <div key={f.label}>
              <p className="t-serif t-num text-[clamp(2.2rem,4vw,3.6rem)] leading-none text-candle">{f.n}</p>
              <p className="mt-2 text-sm text-smoke">{f.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
