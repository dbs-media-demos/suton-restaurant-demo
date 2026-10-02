import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { localeMeta, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dict";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";

/** The <html> document shared by the Serbian and English root layouts. Header, footer and the rest come from SiteChrome. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <body className="theme-night min-h-screen">
        <a
          href="#main"
          className="t-eyebrow fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-candle px-5 py-3 text-night focus:translate-y-0"
        >
          {dict.skip}
        </a>
        <SmoothScroll />
        {children}
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
