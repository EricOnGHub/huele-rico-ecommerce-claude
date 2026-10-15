// Catalog API used at build time. Reads Shopify when configured, otherwise the
// sample catalog. Every page is pre-built, so these run during `npm run build`.

import { cache } from "react";
import { isDemoMode } from "./config";
import { demoCollections, demoProductsFor, demoRank } from "./demo-data";
import { collectionCopy } from "./i18n";
import { similarScents, toSummary } from "./scent";
import {
  sfGetCollection,
  sfGetCollectionProducts,
  sfGetCollections,
  sfGetProduct,
  sfGetProducts,
  sfGetRecommendations,
  type ProductSortKeys,
} from "./shopify/client";
import type { Collection, Lang, Product, ProductSummary } from "./types";

export { isDemoMode };

/**
 * Collections the site navigation links to. If you create a collection with the
 * same handle in Shopify, its title/description/products are used. If you don't,
 * the storefront falls back to the product search below, so the menu always works.
 *
 * Tag your Shopify products with `men`, `women`, `unisex` and `gift-set`.
 */
const virtualCollections: Record<string, { query?: string; sort: ProductSortKeys }> = {
  all: { sort: "BEST_SELLING" },
  men: { query: "tag:men OR tag:unisex", sort: "BEST_SELLING" },
  women: { query: "tag:women OR tag:unisex", sort: "BEST_SELLING" },
  unisex: { query: "tag:unisex", sort: "BEST_SELLING" },
  "best-sellers": { sort: "BEST_SELLING" },
  "gift-sets": { query: "tag:gift-set OR product_type:'Gift Set'", sort: "BEST_SELLING" },
};

/* ───────────── Demo helpers ───────────── */

const byRank = (list: Product[]) => [...list].sort((a, b) => demoRank(a) - demoRank(b));

function demoFilter(handle: string, lang: Lang): Product[] | null {
  const all = byRank(demoProductsFor(lang));
  switch (handle) {
    case "all":
    case "best-sellers": return all.filter((p) => !p.tags.includes("gift-set"));
    case "men": return all.filter((p) => p.gender === "men" || p.gender === "unisex");
    case "women": return all.filter((p) => p.gender === "women" || p.gender === "unisex");
    case "unisex": return all.filter((p) => p.gender === "unisex");
    case "gift-sets": return all.filter((p) => p.tags.includes("gift-set"));
    default: return null;
  }
}

/* ───────────── Public API ───────────── */

/** The whole catalog (best sellers first), fetched once per language per build. */
const allProducts: Partial<Record<Lang, Promise<Product[]>>> = {};
export function getAllProducts(lang: Lang = "en"): Promise<Product[]> {
  allProducts[lang] ??= isDemoMode
    ? Promise.resolve(byRank(demoProductsFor(lang)))
    : sfGetProducts({ sortKey: "BEST_SELLING", first: 250, lang });
  return allProducts[lang]!;
}

export async function getAllSummaries(lang: Lang = "en"): Promise<ProductSummary[]> {
  return (await getAllProducts(lang)).map(toSummary);
}

export const getProduct = cache(async (handle: string, lang: Lang = "en"): Promise<Product | null> => {
  if (isDemoMode) return demoProductsFor(lang).find((p) => p.handle === handle) || null;
  return sfGetProduct(handle, lang);
});

export async function getNewest(lang: Lang, first = 4): Promise<Product[]> {
  const all = await getAllProducts(lang);
  return [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, first);
}

export const getCollection = cache(async (handle: string, lang: Lang = "en"): Promise<Collection | null> => {
  const base = demoCollections.find((c) => c.handle === handle) || null;
  const copy = collectionCopy[lang][handle];
  const fallback = base && copy ? { ...base, ...copy } : base;
  if (isDemoMode) return fallback;
  const live = handle === "all" ? null : await sfGetCollection(handle, lang);
  return live || fallback;
});

export async function getCollectionProducts(handle: string, lang: Lang = "en", first = 100): Promise<Product[] | null> {
  if (isDemoMode) return demoFilter(handle, lang)?.slice(0, first) ?? null;
  if (handle !== "all") {
    const products = await sfGetCollectionProducts({ handle, sortKey: "COLLECTION_DEFAULT", first, lang });
    if (products) return products;
  }
  const virtual = virtualCollections[handle];
  if (!virtual) return null;
  return sfGetProducts({ query: virtual.query, sortKey: virtual.sort, first, lang });
}

export async function getCollections(lang: Lang = "en"): Promise<Collection[]> {
  const fallbacks = await Promise.all(demoCollections.map((c) => getCollection(c.handle, lang)));
  const virtual = fallbacks.filter((c): c is Collection => !!c);
  if (isDemoMode) return virtual;
  const live = await sfGetCollections(lang);
  const handles = new Set(live.map((c) => c.handle));
  return [...virtual.filter((c) => !handles.has(c.handle)), ...live];
}

/** "Smells similar" (shared notes and scent family) plus Shopify's own recommendations. */
export async function getRelated(product: Product, lang: Lang = "en") {
  const catalog = await getAllProducts(lang);
  const similar = similarScents(product, catalog, 4);
  let alsoLike: Product[] = [];
  if (!isDemoMode) alsoLike = await sfGetRecommendations(product.id, lang).catch(() => []);
  const taken = new Set([product.handle, ...similar.map((s) => s.product.handle)]);
  if (alsoLike.length < 4) {
    alsoLike = [
      ...alsoLike,
      ...catalog.filter((p) => !taken.has(p.handle) && (p.gender === product.gender || p.gender === "unisex" || product.gender === "unisex")),
    ];
  }
  alsoLike = alsoLike.filter((p, i, arr) => !taken.has(p.handle) && arr.findIndex((x) => x.handle === p.handle) === i).slice(0, 4);
  return { similar, alsoLike };
}
