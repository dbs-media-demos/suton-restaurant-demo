import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

export const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
  // Four files (roman/italic × latin/latin-ext): let the CSS discover them instead of
  // preloading, so they don't compete with the hero image and body font.
  preload: false,
});

export const hanken = Hanken_Grotesk({
  // Only the Latin file is preloaded; Latin Extended (č, ć, š, ž, đ) loads via unicode-range.
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const fontVariables = `${bodoni.variable} ${hanken.variable}`;
