import type { ReactNode } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";

/** The concept site: Suton's chrome around every page. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome locale="sr">{children}</SiteChrome>;
}
