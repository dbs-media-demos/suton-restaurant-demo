import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import { Logo, Mark } from "@/components/brand/Logo";
import { getDictionary } from "@/i18n/dict";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "404 · Suton",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const sr = getDictionary("sr").notFound;
  const en = getDictionary("en").notFound;
  return (
    <html lang="sr-Latn" className={fontVariables}>
      <body className="theme-night flex min-h-screen flex-col">
        <header className="wrap flex h-[var(--header-h)] items-center">
          <Link href="/" aria-label={site.fullName} className="text-[0.95rem]">
            <Logo sub />
          </Link>
        </header>
        <main className="wrap relative flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <div className="arch relative flex h-[min(46vh,22rem)] w-[min(60vw,16rem)] items-end justify-center overflow-hidden bg-char">
            <Mark className="anim-fade mb-8 h-24 w-24 text-cream" />
          </div>
          <h1 className="t-display anim-heading -mt-10 text-[clamp(5rem,18vw,12rem)] text-candle">404</h1>
          <div className="mt-8 grid max-w-3xl gap-10 sm:grid-cols-2 sm:text-left">
            <div>
              <p className="t-h3">{sr.title}</p>
              <p className="mt-2 text-smoke">{sr.text}</p>
              <Link href="/" className="mt-5 inline-flex h-12 items-center rounded-full bg-candle px-6 font-medium text-night">
                {sr.home}
              </Link>
            </div>
            <div lang="en">
              <p className="t-h3">{en.title}</p>
              <p className="mt-2 text-smoke">{en.text}</p>
              <Link href="/en" className="mt-5 inline-flex h-12 items-center rounded-full border border-line px-6 hover:border-cream">
                {en.home}
              </Link>
            </div>
          </div>
        </main>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
