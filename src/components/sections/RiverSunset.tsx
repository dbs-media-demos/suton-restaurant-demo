import { Photo } from "@/components/ui/Photo";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { RiverWater } from "@/components/fx/RiverWater";
import { SunsetCountdown } from "./SunsetCountdown";
import { photos } from "@/content/photos";
import type { Locale } from "@/lib/i18n";

const P = photos["river/bridge-night"];

/** The terrace on the Sava: a live WebGL river under the Ada bridge and today's sunset time. */
export function RiverSunset({
  locale,
  eyebrow,
  title,
  cta,
  href,
  facts,
  alt,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  facts: string[];
  alt: string;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden phone-later [--later-h:500px] phone:order-10 phone:min-h-0" aria-labelledby="river-title">
      <div className="absolute inset-0">
        <Photo k="river/bridge-night" alt={alt} sizes="100vw" quality={75} />
        <RiverWater src={P.src} aspect={P.w / P.h} waterline={0.52} />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/30 to-night/70 phone:via-night/60 phone:to-night/85" />
      </div>
      <div className="wrap relative flex min-h-[100svh] flex-col justify-between gap-16 py-[clamp(6rem,10vw,9rem)] phone:min-h-0 phone:gap-5 phone:py-9">
        <div className="grid gap-10 md:grid-cols-2 md:items-end phone:grid-cols-1 phone:gap-5">
          <div>
            <p className="t-eyebrow text-candle">{eyebrow}</p>
            <SplitReveal id="river-title" className="t-h1 mt-6 max-w-[11ch] phone:mt-2.5 phone:max-w-none">
              {title}
            </SplitReveal>
          </div>
          <Reveal className="md:justify-self-end md:text-right phone:justify-self-stretch phone:text-left">
            <SunsetCountdown locale={locale} />
            <Button href={href} className="mt-8 phone:mt-4 phone:h-12 phone:w-full phone:justify-center" magnetic>
              {cta}
            </Button>
          </Reveal>
        </div>
        <Reveal as="ul" stagger={0.1} className="flex flex-wrap gap-x-10 gap-y-3 border-t border-cream/20 pt-6 text-sm text-cream/85 phone:grid phone:grid-cols-2 phone:gap-x-4 phone:gap-y-2 phone:pt-4 phone:leading-snug">
          {facts.map((f) => (
            <li key={f} className="flex items-center gap-2.5 phone:items-baseline phone:gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-candle phone:translate-y-[-0.1em]" aria-hidden />
              {f}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
