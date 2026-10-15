import type { Money, Product, ProductVariant } from "./types";

export function formatMoney({ amount, currencyCode }: Money) {
  const n = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Percent saved versus the retail (compare-at) price, or 0. */
export function savingsPercent(price: Money, compareAt: Money | null | undefined) {
  if (!compareAt) return 0;
  const p = Number(price.amount);
  const c = Number(compareAt.amount);
  if (!(c > p) || !(p > 0)) return 0;
  return Math.round(((c - p) / c) * 100);
}

/** The variant shown on cards: cheapest available, or the first one. */
export function defaultVariant(product: Product): ProductVariant | undefined {
  const available = product.variants.filter((v) => v.availableForSale);
  const pool = available.length ? available : product.variants;
  return [...pool].sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0];
}

export function genderLabel(g: Product["gender"]) {
  return g === "men" ? "Para Él · Men" : g === "women" ? "Para Ella · Women" : "Unisex";
}

export function truncate(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`;
}
