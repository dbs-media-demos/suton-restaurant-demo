import { VideoLoop } from "@/components/ui/VideoLoop";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { TablePicker } from "@/components/reserve/TablePicker";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n/dict";
import type { Biz } from "@/lib/biz-core";

/** Closing call to action over candlelight. Used at the end of most pages. */
export function CtaBand({ dict, reserveHref, biz, locale }: { dict: Dict; reserveHref: string; biz?: Biz; locale?: Locale }) {
  return (
    <section className="relative overflow-hidden phone:order-4" aria-labelledby="cta-title">
      <div className="absolute inset-0">
        <VideoLoop name="candles" poster="poster/candles" sizes="100vw" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_60%,rgb(14_12_10/0.35),rgb(14_12_10/0.92))]" />
      </div>
      <div className="wrap relative flex min-h-[90svh] flex-col items-center justify-center py-28 text-center phone:min-h-0 phone:py-6">
        <p className="t-eyebrow text-candle">{dict.cta.eyebrow}</p>
        <SplitReveal id="cta-title" className="t-h1 mt-6 max-w-[15ch] phone:mt-2 phone:max-w-none phone:text-[1.55rem]! phone:leading-[1.08]!" words>
          {dict.cta.title}
        </SplitReveal>
        <Reveal className="flex flex-col items-center phone:w-full">
          <p className="t-lead mt-8 max-w-xl text-cream/85 phone:mt-2 phone:text-[0.92rem]! phone:leading-snug!">{dict.cta.text}</p>
          {locale && <TablePicker locale={locale} reserveHref={reserveHref} tel={biz ? biz.phone : undefined} />}
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row phone:mt-2.5">
            <div className={locale ? "phone:hidden" : undefined}>
              <Button href={reserveHref} magnetic className="h-16 px-10 text-lg">
                {dict.reserve}
              </Button>
            </div>
            <p className="text-cream/80 phone:text-[0.92rem]">
              {dict.cta.call}{" "}
              <a href={`tel:${biz ? biz.phone : site.phone}`} className="link-underline text-cream">
                {biz ? biz.phoneDisplay : site.phoneDisplay}
              </a>
            </p>
          </div>
          <OpenBadge dict={dict} className="mt-10 text-cream/85 phone:hidden" />
        </Reveal>
      </div>
    </section>
  );
}
