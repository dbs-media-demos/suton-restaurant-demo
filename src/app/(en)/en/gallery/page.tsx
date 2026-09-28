import { GalleryPage, galleryMetadata } from "@/views/GalleryPage";

export const metadata = galleryMetadata("en");

export default function Page() {
  return <GalleryPage locale="en" />;
}
