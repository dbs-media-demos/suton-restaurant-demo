import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/views/HomePage";
import { PourHero } from "@/components/fx/PourHero";
import { getDictionary } from "@/i18n/dict";

/** /en without any 3D (see app/(sr)/(site)/v2). Canonical to /en, and kept out of search. */
export const metadata: Metadata = { ...homeMetadata("en"), robots: { index: false, follow: true } };

export default function Page() {
  return <HomePage locale="en" flatHero={<PourHero hint={getDictionary("en").cursor.swirl} />} />;
}
