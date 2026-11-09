import { WineCellar, type CellarRow } from "./WineCellar";
import { cellarPicks, regions, wines } from "@/content/wines";
import { formatRsd } from "@/content/menu";
import type { Locale } from "@/lib/i18n";

/** The wine section: the four regions, and the sommelier's bottle from each in the arch. */
export function WineTeaser({ locale, eyebrow, title, text, cta, href }: { locale: Locale; eyebrow: string; title: string; text: string; cta: string; href: string }) {
  const rows: CellarRow[] = regions.map((r) => {
    const w = wines.find((x) => x.id === cellarPicks[r.id])!;
    return {
      id: r.id,
      name: r.name[locale],
      grapes: r.grapes.join(" · "),
      count: `${wines.filter((x) => x.region === r.id).length} ${locale === "sr" ? "na karti" : "on the list"}`,
      pick: { name: w.name, producer: w.producer, grape: w.grape, vintage: w.vintage, region: r.name[locale], kind: w.color, price: formatRsd(w.bottle, locale) },
    };
  });
  return (
    <section className="relative py-[clamp(6rem,12vw,11rem)] phone-later [--later-h:970px] phone:order-[9] phone:py-8" aria-labelledby="wine-title">
      <WineCellar locale={locale} eyebrow={eyebrow} title={title} text={text} cta={cta} href={href} rows={rows} start={regions.findIndex((r) => r.id === "zupa")} />
    </section>
  );
}
