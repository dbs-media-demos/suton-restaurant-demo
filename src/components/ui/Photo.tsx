import Image, { getImageProps } from "next/image";
import clsx from "clsx";
import { photos, type PhotoKey } from "@/content/photos";

type Props = {
  k: PhotoKey;
  alt: string;
  sizes: string;
  className?: string;
  /** Fill the parent (parent must be positioned). Default true. */
  fill?: boolean;
  preload?: boolean;
  /** Preload on screens matching this media query only; elsewhere nothing is fetched while it's hidden. */
  preloadMedia?: string;
  quality?: 60 | 75 | 85;
};

/** next/image wrapper for the photo registry (dimensions come from src/content/photos.ts). */
export function Photo({ k, alt, sizes, className, fill = true, preload, preloadMedia, quality = 75 }: Props) {
  const p = photos[k];
  if (preloadMedia) {
    const { props } = getImageProps({ src: p.src, alt, fill: true, sizes, quality });
    return (
      <>
        <link rel="preload" as="image" imageSrcSet={props.srcSet} imageSizes={props.sizes} media={preloadMedia} fetchPriority="high" />
        <Image src={p.src} alt={alt} fill sizes={sizes} quality={quality} loading="lazy" fetchPriority="high" className={clsx("object-cover", className)} />
      </>
    );
  }
  if (fill) {
    return (
      <Image
        src={p.src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        loading={preload ? undefined : "lazy"}
        className={clsx("object-cover", className)}
      />
    );
  }
  return (
    <Image
      src={p.src}
      alt={alt}
      width={p.w}
      height={p.h}
      sizes={sizes}
      quality={quality}
      preload={preload}
      loading={preload ? undefined : "lazy"}
      className={className}
    />
  );
}
