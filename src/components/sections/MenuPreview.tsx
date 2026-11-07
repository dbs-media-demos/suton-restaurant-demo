import { DishRows } from "@/components/menu/DishRows";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { signatureDishes, menuSeason } from "@/content/menu";
import type { Locale } from "@/lib/i18n";

/** Printed-menu section on paper: signature dishes with the cursor-following photo. */
export function MenuPreview({ locale, eyebrow, title, text, cta, href }: { locale: Locale; eyebrow: string; title: string; text: string; cta: string; href: string }) {
  return (
    <section className="theme-paper relative overflow-hidden py-[clamp(6rem,12vw,11rem)] phone:order-1 phone:py-6" aria-labelledby="menu-title">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 phone:flex phone:flex-col phone:gap-0">
        <div className="lg:sticky lg:top-28 lg:self-start phone:static">
          <p className="t-eyebrow text-accent">
            {eyebrow} · {menuSeason[locale]}
          </p>
          <SplitReveal id="menu-title" className="t-h2 mt-6 max-w-[12ch] phone:mt-2.5 phone:max-w-none">
            {title}
          </SplitReveal>
          <Reveal>
            <p className="t-lead mt-8 max-w-md text-muted phone:mt-2.5 phone:max-w-none phone:text-[0.95rem]! phone:leading-snug!">{text}</p>
            <div className="phone:hidden">
              <Button href={href} variant="ink" className="mt-10" magnetic>
                {cta}
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal className="phone-soon [--later-h:533px] phone:mt-3">
          <DishRows dishes={signatureDishes} locale={locale} theme="paper" />
          <div className="mt-3 hidden phone:block">
            <Button href={href} variant="ink" className="h-11 w-full justify-center">
              {cta}
            </Button>
          </div>
        </Reveal>
      </div>
      <span
        className="deco-word t-serif pointer-events-none absolute -bottom-[0.18em] right-[-0.04em] select-none text-[24vw] italic leading-none text-ink/[0.045] phone:hidden"
        data-word={locale === "sr" ? "jesen" : "autumn"}
        aria-hidden
      />
    </section>
  );
}
