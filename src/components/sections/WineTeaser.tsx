import { SplitReveal, Reveal, Parallax } from "@/components/ui/Reveal";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { regions, wines } from "@/content/wines";
import type { Locale } from "@/lib/i18n";

/** The wine section: a tall arch with the pour, and the four regions. */
export function WineTeaser({ locale, eyebrow, title, text, cta, href }: { locale: Locale; eyebrow: string; title: string; text: string; cta: string; href: string }) {
  return (
    <section className="relative py-[clamp(6rem,12vw,11rem)]" aria-labelledby="wine-title">
      <div className="wrap grid items-center gap-16 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-[30rem]">
          <Parallax className="arch aspect-[3/4.6] bg-char" amount={8} revealFrom="inset(40% 0% 0% 0%)">
            <div className="absolute inset-0">
              <VideoLoop name="wine-pour" poster="poster/wine-pour" posterAlt="" sizes="(min-width: 768px) 30rem, 90vw" />
            </div>
          </Parallax>
          <div className="absolute -bottom-10 -right-4 hidden aspect-square w-40 overflow-hidden rounded-full border-[6px] border-night sm:block md:-right-12 md:w-48">
            <Photo k="wine/vine-sunset" alt={locale === "sr" ? "Vinova loza na zalasku sunca" : "Vines at sunset"} sizes="12rem" />
          </div>
          <p className="t-eyebrow absolute -left-2 top-1/2 hidden origin-left -translate-y-1/2 -rotate-90 text-smoke lg:block" aria-hidden>
            180 {locale === "sr" ? "etiketa · samo Srbija i region" : "labels · Serbia & the region only"}
          </p>
        </div>

        <div>
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <SplitReveal id="wine-title" className="t-h1 mt-6">
            {title}
          </SplitReveal>
          <Reveal>
            <p className="t-lead mt-8 max-w-lg text-smoke">{text}</p>
          </Reveal>
          <Reveal as="ul" stagger={0.08} className="mt-12 border-t border-line">
            {regions.map((r, i) => (
              <li key={r.id} className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-line py-5">
                <span className="t-eyebrow t-num text-candle/80">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-serif block text-[clamp(1.4rem,2.2vw,2rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:italic">
                    {r.name[locale]}
                  </span>
                  <span className="mt-1 block text-sm text-smoke">{r.grapes.join(" · ")}</span>
                </span>
                <span className="t-num text-sm text-smoke">
                  {wines.filter((w) => w.region === r.id).length} {locale === "sr" ? "na karti" : "on the list"}
                </span>
              </li>
            ))}
          </Reveal>
          <Reveal>
            <Button href={href} className="mt-10" magnetic>
              {cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
