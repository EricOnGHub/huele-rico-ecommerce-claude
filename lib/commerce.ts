import { cache } from "react";
import { demoCollections, demoProducts, demoRank } from "./demo-data";
import { isDemoMode } from "./config";
import {
  sfGetCollection,
  sfGetCollectionProducts,
  sfGetCollections,
  sfGetProduct,
  sfGetProducts,
  sfGetRecommendations,
  type CollectionSortKeys,
  type ProductSortKeys,
} from "./shopify/client";
import { searchProducts } from "./catalog-utils";
import type { Collection, Product, SortKey } from "./types";

export { isDemoMode };

/**
 * Collections the site navigation links to. If you create a collection with the
 * same handle in Shopify, its title/description/products are used. If you don't,
 * the storefront falls back to the product search below, so the menu always works.
 *
 * Tag your Shopify products with `men`, `women`, `unisex` and `gift-set`.
 */
const virtualCollections: Record<string, { query?: string; sort: ProductSortKeys; reverse?: boolean }> = {
  all: { sort: "BEST_SELLING" },
  men: { query: "tag:men OR tag:unisex", sort: "BEST_SELLING" },
  women: { query: "tag:women OR tag:unisex", sort: "BEST_SELLING" },
  unisex: { query: "tag:unisex", sort: "BEST_SELLING" },
  "best-sellers": { sort: "BEST_SELLING" },
  "gift-sets": { query: "tag:gift-set OR product_type:'Gift Set'", sort: "BEST_SELLING" },
};

function productSort(sort: SortKey, fallback: ProductSortKeys = "BEST_SELLING"): { sortKey: ProductSortKeys; reverse: boolean } {
  switch (sort) {
    case "best-selling": return { sortKey: "BEST_SELLING", reverse: false };
    case "price-asc": return { sortKey: "PRICE", reverse: false };
    case "price-desc": return { sortKey: "PRICE", reverse: true };
    case "newest": return { sortKey: "CREATED_AT", reverse: true };
    case "title": return { sortKey: "TITLE", reverse: false };
    default: return { sortKey: fallback, reverse: false };
  }
}

function collectionSort(sort: SortKey): { sortKey: CollectionSortKeys; reverse: boolean } {
  switch (sort) {
    case "best-selling": return { sortKey: "BEST_SELLING", reverse: false };
    case "price-asc": return { sortKey: "PRICE", reverse: false };
    case "price-desc": return { sortKey: "PRICE", reverse: true };
    case "newest": return { sortKey: "CREATED", reverse: true };
    case "title": return { sortKey: "TITLE", reverse: false };
    default: return { sortKey: "COLLECTION_DEFAULT", reverse: false };
  }
}

/* ───────────── Demo helpers ───────────── */

const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);

function demoSort(list: Product[], sort: SortKey) {
  const out = [...list];
  switch (sort) {
    case "price-asc": return out.sort((a, b) => price(a) - price(b));
    case "price-desc": return out.sort((a, b) => price(b) - price(a));
    case "newest": return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "title": return out.sort((a, b) => a.title.localeCompare(b.title));
    default: return out.sort((a, b) => demoRank(a) - demoRank(b));
  }
}

function demoFilter(handle: string): Product[] | null {
  switch (handle) {
    case "all":
    case "best-sellers": return demoProducts.filter((p) => !p.tags.includes("gift-set"));
    case "men": return demoProducts.filter((p) => p.gender === "men" || p.gender === "unisex");
    case "women": return demoProducts.filter((p) => p.gender === "women" || p.gender === "unisex");
    case "unisex": return demoProducts.filter((p) => p.gender === "unisex");
    case "gift-sets": return demoProducts.filter((p) => p.tags.includes("gift-set"));
    default: return null;
  }
}

const demoSearch = (q: string) => searchProducts(demoProducts, q);

/* ───────────── Public API ───────────── */

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  if (isDemoMode) return demoProducts.find((p) => p.handle === handle) || null;
  return sfGetProduct(handle);
});

export async function getProducts(opts: { search?: string; sort?: SortKey; first?: number } = {}): Promise<Product[]> {
  const sort = opts.sort || "featured";
  if (isDemoMode) {
    const list = opts.search ? demoSearch(opts.search) : demoProducts;
    return demoSort(list, sort).slice(0, opts.first ?? 100);
  }
  const { sortKey, reverse } = productSort(sort, opts.search ? "RELEVANCE" : "BEST_SELLING");
  return sfGetProducts({ query: opts.search, sortKey, reverse, first: opts.first });
}

export const getCollection = cache(async (handle: string): Promise<Collection | null> => {
  const fallback = demoCollections.find((c) => c.handle === handle) || null;
  if (isDemoMode) return fallback;
  const live = handle === "all" ? null : await sfGetCollection(handle);
  return live || fallback;
});

export async function getCollectionProducts(handle: string, sort: SortKey = "featured", first = 100): Promise<Product[] | null> {
  if (isDemoMode) {
    const list = demoFilter(handle);
    return list ? demoSort(list, sort).slice(0, first) : null;
  }
  if (handle !== "all") {
    const { sortKey, reverse } = collectionSort(sort);
    const products = await sfGetCollectionProducts({ handle, sortKey, reverse, first });
    if (products) return products;
  }
  const virtual = virtualCollections[handle];
  if (!virtual) return null;
  const { sortKey, reverse } = sort === "featured" ? { sortKey: virtual.sort, reverse: !!virtual.reverse } : productSort(sort);
  return sfGetProducts({ query: virtual.query, sortKey, reverse, first });
}

export async function getCollections(): Promise<Collection[]> {
  if (isDemoMode) return demoCollections;
  const live = await sfGetCollections();
  const handles = new Set(live.map((c) => c.handle));
  return [...demoCollections.filter((c) => !handles.has(c.handle)), ...live];
}

export async function getRecommendations(product: Product): Promise<Product[]> {
  if (isDemoMode) {
    return demoSort(
      demoProducts.filter((p) => p.handle !== product.handle && (p.gender === product.gender || p.gender === "unisex")),
      "featured",
    ).slice(0, 4);
  }
  const recs = await sfGetRecommendations(product.id).catch(() => []);
  return recs.filter((p) => p.handle !== product.handle).slice(0, 4);
}
