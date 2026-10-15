import type { Metadata } from "next";
import { getDict, htmlLang, languageAlternates, lp } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/types";

type Args = {
  lang: Lang;
  /** Path without language prefix, e.g. "/collections/men" */
  path: string;
  title?: string;
  description?: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  noindex?: boolean;
};

/** Per-page SEO: localized canonical URL, hreflang alternates and social cards. */
export function pageMeta({ lang, path, title, description, image, noindex }: Args): Metadata {
  const t = getDict(lang);
  const desc = description || t.meta.description;
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: lp(lang, path), languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: site.legalName,
      locale: htmlLang[lang].replace("-", "_"),
      alternateLocale: htmlLang[lang === "en" ? "es" : "en"].replace("-", "_"),
      url: lp(lang, path),
      title: title ? `${title} | ${site.name}` : t.meta.title,
      description: desc,
      images: image ? [image] : [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: title ? `${title} | ${site.name}` : t.meta.title, description: desc },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
