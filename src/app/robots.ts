import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/site";

/** Concept site: everything is disallowed unless NEXT_PUBLIC_NOINDEX=false. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: noindex ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
