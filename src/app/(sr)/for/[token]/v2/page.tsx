import { notFound } from "next/navigation";
import { HomePage } from "@/views/HomePage";
import { PourHero } from "@/components/fx/PourHero";
import { getDictionary } from "@/i18n/dict";
import { previewBiz } from "@/lib/preview";

export { generateMetadata } from "../page";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

/** The personalised preview without any 3D: /for/<token> with the poured glass (see app/(sr)/(site)/v2). */
export default async function PreviewPageV2({ params }: Props) {
  const found = await previewBiz((await params).token);
  if (!found) notFound();
  return <HomePage locale="sr" biz={{ ...found, lang: "sr" }} flatHero={<PourHero hint={getDictionary("sr").cursor.swirl} />} />;
}
