import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/commerce";
import { pages } from "@/lib/pages";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }).catch(() => []),
    getCollections().catch(() => []),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    ...collections.map((c) => ({
      url: absoluteUrl(`/collections/${c.handle}`),
      lastModified: c.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.handle}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.featuredImage ? [p.featuredImage.url] : undefined,
    })),
    ...Object.keys(pages).map((slug) => ({
      url: absoluteUrl(`/pages/${slug}`),
      changeFrequency: "monthly" as const,
      priority: slug === "privacy" || slug === "terms" ? 0.2 : 0.5,
    })),
  ];
}
