import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail + BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <>
      <nav aria-label={label} className="t-eyebrow text-smoke">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.map((c, i) => (
            <li key={c.href} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-candle/70">/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-cream/80">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="link-underline hover:text-cream">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(items))} />
    </>
  );
}
