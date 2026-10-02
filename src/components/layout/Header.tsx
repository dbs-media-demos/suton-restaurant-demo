"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { OpenBadge } from "./OpenBadge";
import type { Dict } from "@/i18n/dict";
import { localeMeta, otherLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { useBiz } from "@/components/preview/BizContext";

export type NavLink = { key: string; label: string; href: string; image: string };

type Props = {
  locale: Locale;
  dict: Dict;
  primary: NavLink[];
  all: NavLink[];
  homeHref: string;
  reserveHref: string;
  altMap: Record<string, string>;
  otherLocaleHome: string;
  address: string;
};

export function Header({ locale, dict, primary, all, homeHref, reserveHref, altMap, otherLocaleHome, address }: Props) {
  const biz = useBiz();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(0);
  // The overlay's links and photos are only mounted once it has been opened.
  const [mounted, setMounted] = useState(false);
  const lastY = useRef(0);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const other = otherLocale(locale);
  const altHref = altMap[pathname] ?? otherLocaleHome;

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 240) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay when the route changes.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const id = window.setTimeout(() => firstLink.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[120] transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open ? "border-b border-line bg-night/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href={homeHref} className="relative z-[2] text-[0.95rem] text-cream" aria-label={`${biz.preview ? biz.name : site.fullName}, ${dict.nav.home}`}>
            <Logo sub subText={locale === "sr" ? "kuhinja & vino" : "kitchen & wine"} />
          </Link>

          <nav aria-label={dict.navLabel} className={clsx("hidden items-center gap-9 lg:flex", open && "invisible")}>
            {primary.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={clsx("link-underline text-[0.95rem] text-cream/85 hover:text-cream", pathname.startsWith(l.href) && "text-cream")}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-[2] flex items-center gap-2 sm:gap-3">
            <span className="mr-2 hidden text-cream/80 xl:block">
              <OpenBadge dict={dict} detail={false} />
            </span>
            <a
              href={altHref}
              hrefLang={localeMeta[other].hreflang}
              lang={localeMeta[other].htmlLang}
              className="t-eyebrow grid h-11 min-w-11 place-items-center rounded-full border border-line px-3 text-cream/85 transition-colors hover:border-cream hover:text-cream"
              aria-label={dict.langSwitch}
            >
              {localeMeta[other].short}
            </a>
            <Link
              href={reserveHref}
              className="hidden h-11 items-center gap-2 rounded-full bg-candle px-5 text-[0.95rem] font-medium text-night transition-colors duration-500 hover:bg-candle-2 sm:inline-flex"
            >
              {dict.reserve}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => {
                setMounted(true);
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? dict.navClose : dict.navOpen}
              className="group grid h-11 w-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-cream"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={clsx(
                    "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={clsx(
                    "absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                    open ? "w-full -translate-y-1.5 -rotate-45" : "w-3 group-hover:w-full",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen navigation: a curtain that drops from the top, with a photo in an arch. */}
      <div
        id="site-nav"
        role="dialog"
        aria-modal="true"
        aria-label={dict.navLabel}
        className={clsx(
          "theme-night fixed inset-0 z-[110] flex flex-col transition-[clip-path] duration-[1100ms] ease-[var(--ease-in-out-quart)]",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
        inert={!open}
      >
        {mounted && (
          <>
            <div className="wrap grid flex-1 grid-cols-1 items-center gap-10 overflow-y-auto pb-8 pt-[calc(var(--header-h)+2rem)] lg:grid-cols-[1.15fr_1fr]">
              <nav aria-label={dict.navLabel}>
                <ul className="flex flex-col">
                  {all.map((l, i) => (
                    <li key={l.key} className="overflow-hidden">
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        href={l.href}
                        onMouseEnter={() => setHover(i)}
                        onFocus={() => setHover(i)}
                        className={clsx(
                          "group flex items-baseline gap-4 py-1 transition-[transform,opacity,color] duration-[900ms] ease-[var(--ease-out-expo)]",
                          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
                          hover === i ? "text-cream" : "text-cream/55",
                        )}
                        style={{ transitionDelay: open ? `${250 + i * 45}ms` : "0ms" }}
                        aria-current={pathname === l.href ? "page" : undefined}
                      >
                        <span className="t-eyebrow t-num w-7 text-candle/80">{String(i + 1).padStart(2, "0")}</span>
                        <span className="t-serif text-[clamp(1.7rem,3.3vw,2.75rem)] leading-[1.08] tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:italic">
                          {l.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="relative hidden h-[min(72vh,44rem)] lg:block" aria-hidden>
                <div
                  className={clsx(
                    "arch absolute inset-y-0 right-0 w-[min(100%,30rem)] overflow-hidden bg-char transition-[transform,opacity] duration-[1200ms] ease-[var(--ease-out-expo)]",
                    open ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
                  )}
                  style={{ transitionDelay: open ? "300ms" : "0ms" }}
                >
                  {all.map((l, i) => (
                    <Image
                      key={l.key}
                      src={l.image}
                      alt=""
                      fill
                      sizes="30rem"
                      quality={60}
                      loading="lazy"
                      className={clsx(
                        "object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)]",
                        hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
                      )}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
                </div>
              </div>
            </div>

            <div
              className={clsx(
                "wrap grid gap-4 border-t border-line py-6 text-sm text-smoke transition-opacity duration-700 sm:grid-cols-3",
                open ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionDelay: open ? "700ms" : "0ms" }}
            >
              <OpenBadge dict={dict} className="text-cream" />
              <p>{address}</p>
              <a href={`tel:${biz.phone}`} className="link-underline w-fit text-cream sm:justify-self-end">
                {biz.phoneDisplay}
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
