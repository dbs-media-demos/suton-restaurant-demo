import Image from "next/image";
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
  quality?: 60 | 75 | 85;
};

/** next/image wrapper for the photo registry (dimensions come from src/content/photos.ts). */
export function Photo({ k, alt, sizes, className, fill = true, preload, quality = 75 }: Props) {
  const p = photos[k];
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
