import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/views/HomePage";
import { PourHero } from "@/components/fx/PourHero";
import { getDictionary } from "@/i18n/dict";

/**
 * The homepage without any 3D, for a slow laptop or a lead who'd rather not have it: the same
 * sections, words and photos as /, only the hero's centrepiece is the glass poured in SVG + CSS.
 * Zero bytes of three.js. Canonical to /, and kept out of search.
 */
export const metadata: Metadata = { ...homeMetadata("sr"), robots: { index: false, follow: true } };

export default function Page() {
  return <HomePage locale="sr" flatHero={<PourHero hint={getDictionary("sr").cursor.swirl} />} />;
}
