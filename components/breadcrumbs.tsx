import Link from "next/link";
import { getDict, lp } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { JsonLd } from "./json-ld";

export type Crumb = { name: string; href: string };

/** Breadcrumb trail + BreadcrumbList structured data. `href`s are given without the language prefix. */
export function Breadcrumbs({ items, lang }: { items: Crumb[]; lang: Lang }) {
  const t = getDict(lang);
  const all = [{ name: t.breadcrumbHome, href: "/" }, ...items].map((c) => ({ ...c, href: lp(lang, c.href) }));
  return (
    <nav aria-label={t.breadcrumbLabel} className="breadcrumbs">
      <ol>
        {all.map((c, i) => (
          <li key={c.href}>
            {i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
        }}
      />
    </nav>
  );
}
