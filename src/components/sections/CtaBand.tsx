import { VideoLoop } from "@/components/ui/VideoLoop";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { site } from "@/lib/site";
import type { Dict } from "@/i18n/dict";

/** Closing call to action over candlelight. Used at the end of most pages. */
export function CtaBand({ dict, reserveHref }: { dict: Dict; reserveHref: string }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute inset-0">
        <VideoLoop name="candles" poster="poster/candles" sizes="100vw" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_60%,rgb(14_12_10/0.35),rgb(14_12_10/0.92))]" />
      </div>
      <div className="wrap relative flex min-h-[90svh] flex-col items-center justify-center py-28 text-center">
        <p className="t-eyebrow text-candle">{dict.cta.eyebrow}</p>
        <SplitReveal id="cta-title" className="t-h1 mt-6 max-w-[15ch]" words>
          {dict.cta.title}
        </SplitReveal>
        <Reveal className="flex flex-col items-center">
          <p className="t-lead mt-8 max-w-xl text-cream/85">{dict.cta.text}</p>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
            <Button href={reserveHref} magnetic className="h-16 px-10 text-lg">
              {dict.reserve}
            </Button>
            <p className="text-cream/80">
              {dict.cta.call}{" "}
              <a href={`tel:${site.phone}`} className="link-underline text-cream">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <OpenBadge dict={dict} className="mt-10 text-cream/85" />
        </Reveal>
      </div>
    </section>
  );
}
