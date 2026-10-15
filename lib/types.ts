// Normalized commerce types used across the storefront.
// Both the Shopify adapter and the demo catalog return these shapes,
// so pages never need to know where the data came from.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  sku?: string | null;
};

export type ScentNotes = {
  top: string[];
  heart: string[];
  base: string[];
};

export type Gender = "men" | "women" | "unisex";

export type ScentFamily = "fresh" | "floral" | "woody" | "sweet" | "spicy";
export type Season = "spring" | "summer" | "fall" | "winter";
export type TimeOfDay = "day" | "night";

/** How a fragrance wears. Read from Shopify metafields when set, otherwise inferred from notes and concentration. */
export type ScentProfile = {
  families: ScentFamily[];
  /** 1 (soft, ~2h) – 5 (beast mode, 10h+) */
  longevity: number;
  /** Projection: 1 (skin scent) – 5 (fills the room) */
  sillage: number;
  seasons: Season[];
  time: TimeOfDay[];
};

export type Lang = "en" | "es";

export type Product = {
  id: string;
  handle: string;
  title: string;
  /** Designer house, e.g. "Dior". Comes from the Shopify `vendor` field. */
  vendor: string;
  /** Concentration, e.g. "Eau de Parfum". Comes from Shopify `productType`. */
  productType: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  gender: Gender;
  notes: ScentNotes | null;
  options: ProductOption[];
  variants: ProductVariant[];
  images: Image[];
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { maxVariantPrice: Money } | null;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
  /** Visual palette used by the generated bottle illustration in demo mode. */
  demoArt?: { liquid: string; cap: string; label: string };
  profile: ScentProfile;
};

/**
 * Compact product record shipped to the browser for cards, filters, search,
 * the scent quiz and "recently viewed". Built from a Product at build time.
 */
export type ProductSummary = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  gender: Gender;
  tags: string[];
  available: boolean;
  image: Image | null;
  demoArt?: Product["demoArt"];
  /** Lowest available price + its retail price */
  price: Money;
  compareAt: Money | null;
  multiSize: boolean;
  /** Default (cheapest available) variant, used by quick add */
  variantId: string | null;
  variantTitle: string | null;
  /** Bottle sizes in ml, for the size filter */
  sizesMl: number[];
  notes: string[];
  profile: ScentProfile;
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: Money;
    product: Pick<Product, "handle" | "title" | "vendor" | "featuredImage" | "demoArt">;
  };
};

export type Cart = {
  id: string | null;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type SortKey = "featured" | "best-selling" | "price-asc" | "price-desc" | "newest" | "title";
