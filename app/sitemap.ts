import type { MetadataRoute } from "next";
import { getAllProducts, getCollections } from "@/lib/commerce";
import { lp } from "@/lib/i18n";
import { pages } from "@/lib/pages";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every page in English and Spanish, each listing its other-language version (hreflang). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getAllProducts("en"), getCollections("en")]);

  const entry = (path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) =>
    (["en", "es"] as const).map((lang) => ({
      url: absoluteUrl(lp(lang, path)),
      alternates: { languages: { "en-US": absoluteUrl(lp("en", path)), "es-US": absoluteUrl(lp("es", path)) } },
      ...extra,
    }));

  return [
    ...entry("/", { changeFrequency: "daily", priority: 1 }),
    ...entry("/quiz", { changeFrequency: "monthly", priority: 0.6 }),
    ...collections.flatMap((c) => entry(`/collections/${c.handle}`, { lastModified: c.updatedAt, changeFrequency: "daily", priority: 0.8 })),
    ...products.flatMap((p) =>
      entry(`/products/${p.handle}`, {
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        images: p.featuredImage ? [p.featuredImage.url] : undefined,
      }),
    ),
    ...Object.keys(pages).flatMap((slug) => entry(`/pages/${slug}`, { changeFrequency: "monthly", priority: slug === "privacy" || slug === "terms" ? 0.2 : 0.5 })),
  ];
}
