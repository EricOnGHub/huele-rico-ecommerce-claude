// Sorting and filtering for product lists in the browser.
import type { Gender, ProductSummary, ScentFamily, SortKey } from "./types";

const FAMILY_ORDER: ScentFamily[] = ["fresh", "floral", "woody", "sweet", "spicy"];

export const SORT_KEYS: SortKey[] = ["featured", "price-asc", "price-desc", "newest", "title"];

const price = (p: ProductSummary) => Number(p.price.amount);

/** "featured" keeps the incoming order (best sellers first, or your Shopify collection order). */
export function sortSummaries(list: ProductSummary[], sort: SortKey): ProductSummary[] {
  const out = [...list];
  switch (sort) {
    case "price-asc": return out.sort((a, b) => price(a) - price(b));
    case "price-desc": return out.sort((a, b) => price(b) - price(a));
    case "newest": return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "title": return out.sort((a, b) => a.title.localeCompare(b.title));
    default: return out;
  }
}

export type PriceBand = "u50" | "50-100" | "100-200" | "200p";
export type SizeBand = "travel" | "medium" | "large";

export const PRICE_BANDS: { id: PriceBand; min: number; max: number }[] = [
  { id: "u50", min: 0, max: 50 },
  { id: "50-100", min: 50, max: 100 },
  { id: "100-200", min: 100, max: 200 },
  { id: "200p", min: 200, max: Infinity },
];

export const SIZE_BANDS: { id: SizeBand; min: number; max: number }[] = [
  { id: "travel", min: 0, max: 30 },
  { id: "medium", min: 31, max: 75 },
  { id: "large", min: 76, max: Infinity },
];

export type Filters = {
  family: ScentFamily[];
  type: string[];
  size: SizeBand[];
  price: PriceBand[];
  brand: string[];
  for: Gender[];
  inStock: boolean;
};

export const emptyFilters = (): Filters => ({ family: [], type: [], size: [], price: [], brand: [], for: [], inStock: false });

const LIST_KEYS = ["family", "type", "size", "price", "brand", "for"] as const;

export function filtersFromParams(params: URLSearchParams): Filters {
  const f = emptyFilters();
  for (const k of LIST_KEYS) {
    const v = params.get(k);
    if (v) (f[k] as string[]) = v.split(",").filter(Boolean);
  }
  f.inStock = params.get("stock") === "1";
  return f;
}

export function filtersToParams(f: Filters, sort: SortKey): URLSearchParams {
  const p = new URLSearchParams();
  for (const k of LIST_KEYS) if (f[k].length) p.set(k, f[k].join(","));
  if (f.inStock) p.set("stock", "1");
  if (sort !== "featured") p.set("sort", sort);
  return p;
}

export function activeFilterCount(f: Filters) {
  return LIST_KEYS.reduce((n, k) => n + f[k].length, 0) + (f.inStock ? 1 : 0);
}

export function applyFilters(list: ProductSummary[], f: Filters): ProductSummary[] {
  return list.filter((p) => {
    if (f.inStock && !p.available) return false;
    if (f.family.length && !p.profile.families.some((x) => f.family.includes(x))) return false;
    if (f.type.length && !f.type.includes(p.productType)) return false;
    if (f.brand.length && !f.brand.includes(p.vendor)) return false;
    if (f.for.length && !f.for.includes(p.gender) && !(p.gender === "unisex")) return false;
    if (f.price.length) {
      const bands = PRICE_BANDS.filter((b) => f.price.includes(b.id));
      if (!bands.some((b) => price(p) >= b.min && price(p) < b.max)) return false;
    }
    if (f.size.length) {
      const bands = SIZE_BANDS.filter((b) => f.size.includes(b.id));
      if (!p.sizesMl.some((ml) => bands.some((b) => ml >= b.min && ml <= b.max))) return false;
    }
    return true;
  });
}

/** Options that actually exist in this list, so the filter panel never offers a dead end. */
export function filterOptions(list: ProductSummary[]) {
  const uniq = <T,>(xs: T[]) => [...new Set(xs)];
  return {
    family: FAMILY_ORDER.filter((f) => list.some((p) => p.profile.families.includes(f))),
    type: uniq(list.map((p) => p.productType).filter(Boolean)).sort(),
    brand: uniq(list.map((p) => p.vendor)).sort((a, b) => a.localeCompare(b)),
    for: uniq(list.map((p) => p.gender)),
    size: SIZE_BANDS.filter((b) => list.some((p) => p.sizesMl.some((ml) => ml >= b.min && ml <= b.max))).map((b) => b.id),
    price: PRICE_BANDS.filter((b) => list.some((p) => price(p) >= b.min && price(p) < b.max)).map((b) => b.id),
  };
}
