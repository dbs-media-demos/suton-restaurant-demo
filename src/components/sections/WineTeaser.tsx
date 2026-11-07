import { SplitReveal, Reveal, Parallax } from "@/components/ui/Reveal";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { regions, wines } from "@/content/wines";
import type { Locale } from "@/lib/i18n";

/** The wine section: a tall arch with the pour, and the four regions. */
export function WineTeaser({ locale, eyebrow, title, text, cta, href }: { locale: Locale; eyebrow: string; title: string; text: string; cta: string; href: string }) {
  return (
    <section className="relative py-[clamp(6rem,12vw,11rem)] phone-later [--later-h:821px] phone:order-[9] phone:py-8" aria-labelledby="wine-title">
      <div className="wrap grid items-center gap-16 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr] phone:flex phone:flex-col phone:items-stretch phone:gap-5">
        <div className="relative mx-auto w-full max-w-[30rem] phone:max-w-none">
          <Parallax className="arch aspect-[3/4.6] bg-char phone:aspect-[5/3]" amount={8} revealFrom="inset(40% 0% 0% 0%)">
            <div className="absolute inset-0">
              <VideoLoop name="wine-pour" poster="poster/wine-pour" posterAlt="" sizes="(min-width: 768px) 30rem, 90vw" />
            </div>
          </Parallax>
          <div className="absolute -bottom-10 -right-4 hidden aspect-square w-40 overflow-hidden rounded-full border-[6px] border-night sm:block md:-right-12 md:w-48 phone:-bottom-3 phone:right-0 phone:block phone:w-24">
            <Photo k="wine/vine-sunset" alt={locale === "sr" ? "Vinova loza na zalasku sunca" : "Vines at sunset"} sizes="12rem" />
          </div>
          <p className="t-eyebrow absolute -left-2 top-1/2 hidden origin-left -translate-y-1/2 -rotate-90 text-smoke lg:block" aria-hidden>
            180 {locale === "sr" ? "etiketa · samo Srbija i region" : "labels · Serbia & the region only"}
          </p>
        </div>

        <div>
          <p className="t-eyebrow text-candle">{eyebrow}</p>
          <SplitReveal id="wine-title" className="t-h1 mt-6 phone:mt-2.5 phone:pr-16">
            {title}
          </SplitReveal>
          <Reveal>
            <p className="t-lead mt-8 max-w-lg text-smoke phone:mt-2.5 phone:max-w-none">{text}</p>
          </Reveal>
          <Reveal as="ul" stagger={0.08} className="mt-12 border-t border-line phone:mt-4">
            {regions.map((r, i) => (
              <li key={r.id} className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-line py-5 phone:grid-cols-[1.75rem_1fr_auto] phone:gap-2.5 phone:py-2.5">
                <span className="t-eyebrow t-num text-candle/80">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-serif block text-[clamp(1.4rem,2.2vw,2rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:italic">
                    {r.name[locale]}
                  </span>
                  <span className="mt-1 block text-sm text-smoke phone:mt-0 phone:text-[0.82rem] phone:leading-snug">{r.grapes.join(" · ")}</span>
                </span>
                <span className="t-num text-sm text-smoke phone:text-[0.78rem]">
                  {wines.filter((w) => w.region === r.id).length} {locale === "sr" ? "na karti" : "on the list"}
                </span>
              </li>
            ))}
          </Reveal>
          <Reveal>
            <Button href={href} className="mt-10 phone:mt-4 phone:h-12 phone:w-full phone:justify-center" magnetic>
              {cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
