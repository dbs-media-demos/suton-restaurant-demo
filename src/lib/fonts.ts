import localFont from "next/font/local";
import { Hanken_Grotesk } from "next/font/google";

// DM Serif Display (single weight 400, roman + italic), self-hosted as a subset:
// Basic Latin + Latin-1 + Serbian Latin (č ć š ž đ) + typographic punctuation, kern/liga kept.
// Two ~18 KB woff2 files, small enough to preload with the hero.
export const displaySerif = localFont({
  src: [
    { path: "../fonts/DMSerifDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/DMSerifDisplay-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const hanken = Hanken_Grotesk({
  // Desktop only: phones set the system UI face (globals.css), so nothing here may be preloaded.
  subsets: ["latin"],
  preload: false,
  variable: "--font-hanken",
  display: "swap",
});

export const fontVariables = `${displaySerif.variable} ${hanken.variable}`;
