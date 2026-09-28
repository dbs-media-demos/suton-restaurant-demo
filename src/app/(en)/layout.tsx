import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/layout-meta";

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
