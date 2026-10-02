import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BizProvider } from "@/components/preview/BizContext";
import { PreviewGuard } from "@/components/preview/PreviewGuard";
import { Translate, translateGateCss } from "@/components/preview/Translate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { previewBiz } from "@/lib/preview";
import { srPreview } from "@/i18n/sr-preview";

/**
 * A personalised preview made in the Scale by Noon CRM: this homepage with a real restaurant's
 * name, phone, address, hours and rating. Serbian only (dinar menu, Serbian wines), so the CRM
 * offers it to Serbian leads; i18n/sr-preview generalises Suton's Sava and Savamala lines.
 */
export default async function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const found = await previewBiz(token);
  if (!found) notFound();
  const biz = { ...found, lang: "sr" as const };
  return (
    <BizProvider biz={biz}>
      <style>{translateGateCss}</style>
      <Translate dict={srPreview} />
      <SiteChrome locale="sr" biz={biz}>
        {children}
      </SiteChrome>
      <PreviewGuard />
    </BizProvider>
  );
}
