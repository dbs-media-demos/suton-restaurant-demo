import type { ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Photo } from "./Photo";
import { Parallax } from "./Reveal";
import { VideoLoop } from "./VideoLoop";
import type { PhotoKey } from "@/content/photos";

type Props = {
  crumbs: Crumb[];
  crumbLabel: string;
  eyebrow: string;
  title: string;
  intro?: string;
  image?: PhotoKey;
  video?: string;
  imageAlt?: string;
  children?: ReactNode;
  /** Wide banner photo below the title instead of an arch beside it. */
  wide?: boolean;
};

/** Inner-page opening: breadcrumbs, a big serif title (CSS-only intro) and an arch photo. */
export function PageHero({ crumbs, crumbLabel, eyebrow, title, intro, image, video, imageAlt = "", children, wide }: Props) {
  const media =
    video && image ? (
      <VideoLoop name={video} poster={image} posterAlt={imageAlt} sizes={wide ? "100vw" : "(min-width: 768px) 40vw, 90vw"} eager preloadPoster />
    ) : image ? (
      <Photo k={image} alt={imageAlt} sizes={wide ? "100vw" : "(min-width: 768px) 40vw, 90vw"} preload quality={75} className="anim-zoom" />
    ) : null;

  return (
    <header className="relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)]">
      <div className={clsx("wrap grid gap-12 pb-16 md:pb-24", !wide && media && "md:grid-cols-[1.25fr_1fr] md:items-end")}>
        <div>
          <div className="anim-fade">
            <Breadcrumbs items={crumbs} label={crumbLabel} />
          </div>
          <p className="t-eyebrow anim-fade mt-10 text-candle md:mt-16" style={{ "--d": "0.1s" } as React.CSSProperties}>
            {eyebrow}
          </p>
          <h1 className="t-h1 anim-heading mt-6 max-w-[14ch]" style={{ "--d": "0.15s" } as React.CSSProperties}>
            {title}
          </h1>
          {intro && (
            <p className="t-lead anim-fade mt-8 max-w-xl text-cream/80" style={{ "--d": "0.35s" } as React.CSSProperties}>
              {intro}
            </p>
          )}
          {children && (
            <div className="anim-fade mt-10" style={{ "--d": "0.5s" } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {!wide && media && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden arch bg-char md:max-h-[72vh] md:justify-self-end">{media}</div>
        )}
      </div>
      {wide && media && (
        <Parallax className="relative h-[58svh] min-h-[22rem] bg-char md:h-[76svh]" amount={10} reveal={false}>
          <div className="absolute inset-0">{media}</div>
        </Parallax>
      )}
    </header>
  );
}
