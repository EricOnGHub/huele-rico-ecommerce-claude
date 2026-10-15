// Shopify Storefront API client. Runs at build time (catalog pages) and in the
// browser (cart). The Storefront token is public by design.
import { isShopifyConfigured, shopifyEndpoint, shopifyToken } from "@/lib/config";
import type { Cart, Collection, Gender, Image, Product, ScentNotes } from "@/lib/types";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
  removeFromCartMutation,
  updateCartMutation,
} from "./queries";

export { isShopifyConfigured };

type FetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  /** Cart requests must never be cached. */
  cache?: "no-store";
};

export class ShopifyError extends Error {}

export async function shopifyFetch<T>({ query, variables, cache }: FetchOptions): Promise<T> {
  if (!isShopifyConfigured) throw new ShopifyError("Shopify is not configured.");

  const res = await fetch(shopifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyToken,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { cache } : {}),
  });

  const body = (await res.json().catch(() => null)) as { data?: T; errors?: { message: string }[] } | null;

  if (!res.ok || !body || body.errors?.length) {
    const msg = body?.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new ShopifyError(`Shopify Storefront API error: ${msg}`);
  }
  return body.data as T;
}

/* ───────────── Normalization ───────────── */

type Edges<T> = { edges: { node: T }[] };
const flatten = <T>(c: Edges<T> | undefined | null): T[] => (c ? c.edges.map((e) => e.node) : []);

type MetafieldValue = { value: string } | null;

type ShopifyProduct = Omit<
  Product,
  "variants" | "images" | "options" | "gender" | "notes" | "demoArt"
> & {
  variants: Edges<Product["variants"][number]>;
  images: Edges<Image>;
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  notesTop: MetafieldValue;
  notesHeart: MetafieldValue;
  notesBase: MetafieldValue;
  gender: MetafieldValue;
};

/** Accepts a JSON list metafield (`["Bergamot","Pepper"]`) or a comma-separated text metafield. */
function parseList(m: MetafieldValue): string[] {
  if (!m?.value) return [];
  try {
    const v = JSON.parse(m.value);
    if (Array.isArray(v)) return v.map(String);
  } catch {
    /* plain text */
  }
  return m.value.split(",").map((s) => s.trim()).filter(Boolean);
}

function detectGender(p: ShopifyProduct): Gender {
  const raw = [p.gender?.value || "", ...p.tags].join(" ").toLowerCase();
  if (/\bunisex\b/.test(raw)) return "unisex";
  if (/\b(women|woman|her|ella|mujer|female)\b/.test(raw)) return "women";
  if (/\b(men|man|him|hombre|male)\b/.test(raw)) return "men";
  return "unisex";
}

function reshapeProduct(p: ShopifyProduct | null): Product | null {
  if (!p) return null;
  const top = parseList(p.notesTop);
  const heart = parseList(p.notesHeart);
  const base = parseList(p.notesBase);
  const notes: ScentNotes | null = top.length || heart.length || base.length ? { top, heart, base } : null;
  const images = flatten(p.images).map((img) => ({ ...img, altText: img.altText || `${p.vendor} ${p.title}` }));

  return {
    ...p,
    options: p.options.map((o) => ({ id: o.id, name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants: flatten(p.variants),
    images,
    featuredImage: p.featuredImage
      ? { ...p.featuredImage, altText: p.featuredImage.altText || `${p.vendor} ${p.title}` }
      : images[0] || null,
    gender: detectGender(p),
    notes,
  };
}

const reshapeProducts = (list: ShopifyProduct[]) => list.map(reshapeProduct).filter(Boolean) as Product[];

type ShopifyCart = Omit<Cart, "lines"> & { lines: Edges<Cart["lines"][number]> };

function reshapeCart(c: ShopifyCart): Cart {
  return { ...c, lines: flatten(c.lines) };
}

/* ───────────── Catalog ───────────── */

export type ProductSortKeys = "RELEVANCE" | "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE";
export type CollectionSortKeys = "COLLECTION_DEFAULT" | "BEST_SELLING" | "PRICE" | "CREATED" | "TITLE";

export async function sfGetProduct(handle: string) {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({ query: getProductQuery, variables: { handle } });
  return reshapeProduct(data.product);
}

export async function sfGetProducts(opts: { query?: string; sortKey?: ProductSortKeys; reverse?: boolean; first?: number }) {
  const data = await shopifyFetch<{ products: Edges<ShopifyProduct> }>({
    query: getProductsQuery,
    variables: { query: opts.query, sortKey: opts.sortKey, reverse: opts.reverse, first: opts.first ?? 100 },
  });
  return reshapeProducts(flatten(data.products));
}

export async function sfGetCollection(handle: string): Promise<Collection | null> {
  const data = await shopifyFetch<{ collection: Collection | null }>({ query: getCollectionQuery, variables: { handle } });
  return data.collection;
}

export async function sfGetCollectionProducts(opts: {
  handle: string;
  sortKey?: CollectionSortKeys;
  reverse?: boolean;
  first?: number;
}) {
  const data = await shopifyFetch<{ collection: { products: Edges<ShopifyProduct> } | null }>({
    query: getCollectionProductsQuery,
    variables: { handle: opts.handle, sortKey: opts.sortKey, reverse: opts.reverse, first: opts.first ?? 100 },
  });
  if (!data.collection) return null;
  return reshapeProducts(flatten(data.collection.products));
}

export async function sfGetCollections(): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: Edges<Collection> }>({ query: getCollectionsQuery });
  return flatten(data.collections);
}

export async function sfGetRecommendations(productId: string) {
  const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] | null }>({
    query: getProductRecommendationsQuery,
    variables: { productId },
  });
  return reshapeProducts(data.productRecommendations || []);
}

/* ───────────── Cart ───────────── */

type CartPayload = { cart: ShopifyCart | null; userErrors: { message: string }[] };

function unwrap(payload: CartPayload): Cart {
  if (payload.userErrors?.length) throw new ShopifyError(payload.userErrors.map((e) => e.message).join("; "));
  if (!payload.cart) throw new ShopifyError("Cart not returned by Shopify.");
  return reshapeCart(payload.cart);
}

export async function sfGetCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({ query: getCartQuery, variables: { cartId }, cache: "no-store" });
  return data.cart ? reshapeCart(data.cart) : null;
}

export async function sfCreateCart(lines: { merchandiseId: string; quantity: number }[] = []) {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
  });
  return unwrap(data.cartCreate);
}

export async function sfAddToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return unwrap(data.cartLinesAdd);
}

export async function sfUpdateCart(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return unwrap(data.cartLinesUpdate);
}

export async function sfRemoveFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return unwrap(data.cartLinesRemove);
}
