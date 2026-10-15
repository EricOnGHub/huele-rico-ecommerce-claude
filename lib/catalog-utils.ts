// Pure catalog helpers shared by build-time pages and browser components.
import type { Product, SortKey } from "./types";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "New Arrivals" },
  { value: "title", label: "A – Z" },
];

const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);

/** "featured" keeps the incoming order (best sellers first, or your Shopify collection order). */
export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const out = [...list];
  switch (sort) {
    case "price-asc": return out.sort((a, b) => price(a) - price(b));
    case "price-desc": return out.sort((a, b) => price(b) - price(a));
    case "newest": return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "title": return out.sort((a, b) => a.title.localeCompare(b.title));
    default: return out;
  }
}

export function searchProducts(list: Product[], query: string): Product[] {
  const terms = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return list.filter((p) => {
    const hay = [p.title, p.vendor, p.productType, p.description, ...p.tags, ...(p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : [])]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    return terms.every((t) => hay.includes(t));
  });
}
