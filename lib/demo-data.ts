// SAMPLE CATALOG — used only when Shopify credentials are not configured.
// It lets you preview the full storefront design before connecting your store.
// Once SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN are set, every
// page reads live products from Shopify and this file is ignored.

import type { Collection, Gender, Product, ScentNotes } from "./types";

type Size = { size: string; price: number; retail: number; available?: boolean };

type Seed = {
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  gender: Gender;
  description: string;
  notes: ScentNotes;
  sizes: Size[];
  tags?: string[];
  art: { liquid: string; cap: string; label: string };
  /** Lower = sells more. Drives the "Best Sellers" sort in demo mode. */
  rank: number;
  createdDaysAgo: number;
};

const seeds: Seed[] = [
  {
    handle: "dior-sauvage-eau-de-toilette",
    title: "Sauvage Eau de Toilette",
    vendor: "Dior",
    productType: "Eau de Toilette",
    gender: "men",
    description:
      "A radically fresh composition — raw, noble and magnetic. Calabrian bergamot meets ambroxan for a trail that turns heads from the office to the rooftop.",
    notes: { top: ["Calabrian Bergamot", "Pepper"], heart: ["Sichuan Pepper", "Lavender", "Pink Pepper"], base: ["Ambroxan", "Cedar", "Labdanum"] },
    sizes: [
      { size: "2 oz / 60 ml", price: 79, retail: 112 },
      { size: "3.4 oz / 100 ml", price: 98, retail: 140 },
    ],
    art: { liquid: "#3b5b8c", cap: "#1d1d1f", label: "#e8eef7" },
    rank: 1,
    createdDaysAgo: 220,
  },
  {
    handle: "versace-eros-eau-de-toilette",
    title: "Eros Eau de Toilette",
    vendor: "Versace",
    productType: "Eau de Toilette",
    gender: "men",
    description:
      "Love, passion and desire in a bottle. Fresh mint and green apple open into tonka bean and vanilla — confident, sweet and impossible to ignore.",
    notes: { top: ["Mint", "Green Apple", "Lemon"], heart: ["Tonka Bean", "Ambroxan", "Geranium"], base: ["Madagascar Vanilla", "Cedar", "Vetiver"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 54, retail: 88 },
      { size: "3.4 oz / 100 ml", price: 69, retail: 112 },
      { size: "6.7 oz / 200 ml", price: 94, retail: 148 },
    ],
    art: { liquid: "#2fa6a0", cap: "#c89c52", label: "#f5efe7" },
    rank: 2,
    createdDaysAgo: 300,
  },
  {
    handle: "carolina-herrera-good-girl-eau-de-parfum",
    title: "Good Girl Eau de Parfum",
    vendor: "Carolina Herrera",
    productType: "Eau de Parfum",
    gender: "women",
    description:
      "It's so good to be bad. Jasmine sambac and tuberose wrapped in roasted tonka and cocoa — a bold, sensual signature in the iconic stiletto.",
    notes: { top: ["Almond", "Coffee", "Bergamot"], heart: ["Jasmine Sambac", "Tuberose", "Orange Blossom"], base: ["Tonka Bean", "Cocoa", "Sandalwood"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 89, retail: 125 },
      { size: "2.7 oz / 80 ml", price: 112, retail: 155 },
    ],
    art: { liquid: "#1f2a52", cap: "#c89c52", label: "#d6c2c7" },
    rank: 3,
    createdDaysAgo: 180,
  },
  {
    handle: "maison-francis-kurkdjian-baccarat-rouge-540",
    title: "Baccarat Rouge 540 Eau de Parfum",
    vendor: "Maison Francis Kurkdjian",
    productType: "Eau de Parfum",
    gender: "unisex",
    description:
      "Luminous and dense, Baccarat Rouge 540 lays on the skin like an amber, floral and woody breeze. The scent everyone asks about — now below retail.",
    notes: { top: ["Saffron", "Jasmine"], heart: ["Amberwood", "Ambergris"], base: ["Fir Resin", "Cedar"] },
    sizes: [
      { size: "1.2 oz / 35 ml", price: 219, retail: 245 },
      { size: "2.4 oz / 70 ml", price: 299, retail: 335 },
    ],
    tags: ["luxury"],
    art: { liquid: "#b8453a", cap: "#c89c52", label: "#f5efe7" },
    rank: 4,
    createdDaysAgo: 90,
  },
  {
    handle: "lancome-la-vie-est-belle-eau-de-parfum",
    title: "La Vie Est Belle Eau de Parfum",
    vendor: "Lancôme",
    productType: "Eau de Parfum",
    gender: "women",
    description:
      "A declaration of happiness. Iris, patchouli and praline create a sweet, radiant gourmand that feels like a warm abrazo.",
    notes: { top: ["Blackcurrant", "Pear"], heart: ["Iris", "Jasmine", "Orange Blossom"], base: ["Praline", "Vanilla", "Patchouli"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 82, retail: 118 },
      { size: "3.4 oz / 100 ml", price: 108, retail: 158 },
    ],
    art: { liquid: "#d9a5b3", cap: "#2e2b2f", label: "#f5efe7" },
    rank: 5,
    createdDaysAgo: 260,
  },
  {
    handle: "jean-paul-gaultier-le-male-elixir",
    title: "Le Male Elixir Parfum",
    vendor: "Jean Paul Gaultier",
    productType: "Parfum",
    gender: "men",
    description:
      "The sailor goes for gold. Lavender, honey and tonka bean melt into an intense, ambery-woody elixir made for the night.",
    notes: { top: ["Lavender", "Mint"], heart: ["Vanilla", "Benzoin"], base: ["Honey", "Tonka Bean", "Tobacco"] },
    sizes: [
      { size: "2.5 oz / 75 ml", price: 99, retail: 135 },
      { size: "4.2 oz / 125 ml", price: 129, retail: 175 },
    ],
    art: { liquid: "#c98a2e", cap: "#c89c52", label: "#2e2b2f" },
    rank: 6,
    createdDaysAgo: 40,
  },
  {
    handle: "ysl-libre-eau-de-parfum",
    title: "Libre Eau de Parfum",
    vendor: "Yves Saint Laurent",
    productType: "Eau de Parfum",
    gender: "women",
    description:
      "The scent of freedom. French lavender and Moroccan orange blossom burn bright against a warm vanilla and musk base.",
    notes: { top: ["Mandarin", "Lavender", "Blackcurrant"], heart: ["Orange Blossom", "Jasmine"], base: ["Madagascar Vanilla", "Musk", "Cedar"] },
    sizes: [
      { size: "1.6 oz / 50 ml", price: 99, retail: 138 },
      { size: "3 oz / 90 ml", price: 128, retail: 178 },
    ],
    art: { liquid: "#e9d6b0", cap: "#c89c52", label: "#2e2b2f" },
    rank: 7,
    createdDaysAgo: 120,
  },
  {
    handle: "giorgio-armani-acqua-di-gio-profondo",
    title: "Acqua di Giò Profondo Eau de Parfum",
    vendor: "Giorgio Armani",
    productType: "Eau de Parfum",
    gender: "men",
    description:
      "Dive deep. Marine notes, bergamot and aromatic rosemary over patchouli and mineral musk — fresh, clean and endlessly wearable.",
    notes: { top: ["Marine Notes", "Bergamot", "Green Mandarin"], heart: ["Rosemary", "Lavender", "Cypress"], base: ["Patchouli", "Mineral Musk", "Amber"] },
    sizes: [
      { size: "2.5 oz / 75 ml", price: 92, retail: 130 },
      { size: "4.2 oz / 125 ml", price: 118, retail: 165 },
    ],
    art: { liquid: "#1b4f72", cap: "#d0d4da", label: "#f5efe7" },
    rank: 8,
    createdDaysAgo: 150,
  },
  {
    handle: "ariana-grande-cloud-eau-de-parfum",
    title: "Cloud Eau de Parfum",
    vendor: "Ariana Grande",
    productType: "Eau de Parfum",
    gender: "women",
    description:
      "Dreamy and addictive. Lavender blossom and pear meet whipped cream and praline — a cozy, playful cloud of sweetness at an easy price.",
    notes: { top: ["Lavender Blossom", "Pear", "Bergamot"], heart: ["Whipped Cream", "Coconut", "Praline"], base: ["Musk", "Creamy Woods"] },
    sizes: [
      { size: "1 oz / 30 ml", price: 34, retail: 49 },
      { size: "3.4 oz / 100 ml", price: 52, retail: 72 },
    ],
    art: { liquid: "#cfc5d8", cap: "#f5efe7", label: "#6e4a74" },
    rank: 9,
    createdDaysAgo: 60,
  },
  {
    handle: "ysl-y-eau-de-parfum",
    title: "Y Eau de Parfum",
    vendor: "Yves Saint Laurent",
    productType: "Eau de Parfum",
    gender: "men",
    description:
      "For those who dare to say yes. Crisp apple and ginger meet sage and a deep tonka-amberwood base. Fresh meets intense.",
    notes: { top: ["Apple", "Ginger", "Bergamot"], heart: ["Sage", "Juniper Berries", "Geranium"], base: ["Amberwood", "Tonka Bean", "Cedar"] },
    sizes: [
      { size: "2 oz / 60 ml", price: 89, retail: 128 },
      { size: "3.3 oz / 100 ml", price: 112, retail: 160 },
    ],
    art: { liquid: "#24262b", cap: "#c0c4ca", label: "#f5efe7" },
    rank: 10,
    createdDaysAgo: 200,
  },
  {
    handle: "marc-jacobs-daisy-eau-de-toilette",
    title: "Daisy Eau de Toilette",
    vendor: "Marc Jacobs",
    productType: "Eau de Toilette",
    gender: "women",
    description:
      "Fresh, feminine and effortlessly charming. Wild berries, violet leaves and jasmine over a soft musky-vanilla base.",
    notes: { top: ["Strawberry", "Violet Leaves", "Grapefruit"], heart: ["Gardenia", "Violet", "Jasmine"], base: ["Musk", "Vanilla", "White Woods"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 64, retail: 104 },
      { size: "3.4 oz / 100 ml", price: 82, retail: 128 },
    ],
    art: { liquid: "#f1e3b0", cap: "#ffffff", label: "#c89c52" },
    rank: 11,
    createdDaysAgo: 340,
  },
  {
    handle: "le-labo-santal-33",
    title: "Santal 33 Eau de Parfum",
    vendor: "Le Labo",
    productType: "Eau de Parfum",
    gender: "unisex",
    description:
      "The cult classic. Australian sandalwood, cardamom and leather create a smoky, intimate signature that belongs to everyone.",
    notes: { top: ["Cardamom", "Violet"], heart: ["Iris", "Ambrox"], base: ["Australian Sandalwood", "Cedar", "Leather"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 209, retail: 235 },
      { size: "3.4 oz / 100 ml", price: 299, retail: 342, available: false },
    ],
    art: { liquid: "#e6d3b3", cap: "#2e2b2f", label: "#ffffff" },
    rank: 12,
    createdDaysAgo: 20,
  },
  {
    handle: "valentino-born-in-roma-donna",
    title: "Born in Roma Donna Eau de Parfum",
    vendor: "Valentino",
    productType: "Eau de Parfum",
    gender: "women",
    description:
      "Rome's couture spirit. Jasmine, blackcurrant and bourbon vanilla wrapped in a sleek studded bottle — modern, romantic and bold.",
    notes: { top: ["Blackcurrant", "Pink Pepper", "Bergamot"], heart: ["Jasmine Sambac", "Jasmine Tea"], base: ["Bourbon Vanilla", "Cashmeran", "Guaiac Wood"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 104, retail: 140 },
      { size: "3.4 oz / 100 ml", price: 134, retail: 185 },
    ],
    art: { liquid: "#e7b9c4", cap: "#d6c2c7", label: "#4c234e" },
    rank: 13,
    createdDaysAgo: 30,
  },
  {
    handle: "viktor-rolf-spicebomb-extreme",
    title: "Spicebomb Extreme Eau de Parfum",
    vendor: "Viktor&Rolf",
    productType: "Eau de Parfum",
    gender: "men",
    description:
      "An explosive, addictive blend of black pepper, cinnamon and tobacco over smoky vanilla. Warm, bold and made for cooler nights.",
    notes: { top: ["Black Pepper", "Cumin"], heart: ["Cinnamon", "Saffron", "Lavender"], base: ["Tobacco", "Vanilla", "Vetiver"] },
    sizes: [
      { size: "1.7 oz / 50 ml", price: 89, retail: 125 },
      { size: "3.04 oz / 90 ml", price: 112, retail: 160 },
    ],
    art: { liquid: "#3a2322", cap: "#2e2b2f", label: "#c89c52" },
    rank: 14,
    createdDaysAgo: 75,
  },
  {
    handle: "versace-eros-gift-set",
    title: "Eros 3-Piece Gift Set",
    vendor: "Versace",
    productType: "Gift Set",
    gender: "men",
    description:
      "The perfect regalo. Eros Eau de Toilette 3.4 oz, travel spray 0.3 oz and perfumed bath & shower gel — ready to gift in signature packaging.",
    notes: { top: ["Mint", "Green Apple", "Lemon"], heart: ["Tonka Bean", "Ambroxan"], base: ["Vanilla", "Cedar", "Vetiver"] },
    sizes: [{ size: "3-Piece Set", price: 89, retail: 140 }],
    tags: ["gift-set"],
    art: { liquid: "#2fa6a0", cap: "#c89c52", label: "#f5efe7" },
    rank: 15,
    createdDaysAgo: 10,
  },
  {
    handle: "carolina-herrera-good-girl-gift-set",
    title: "Good Girl 3-Piece Gift Set",
    vendor: "Carolina Herrera",
    productType: "Gift Set",
    gender: "women",
    description:
      "Gift her the stiletto. Good Girl Eau de Parfum 2.7 oz, travel spray and body lotion — beautifully boxed for birthdays, Navidad and Día de las Madres.",
    notes: { top: ["Almond", "Coffee"], heart: ["Jasmine Sambac", "Tuberose"], base: ["Tonka Bean", "Cocoa"] },
    sizes: [{ size: "3-Piece Set", price: 129, retail: 180 }],
    tags: ["gift-set"],
    art: { liquid: "#1f2a52", cap: "#c89c52", label: "#d6c2c7" },
    rank: 16,
    createdDaysAgo: 12,
  },
];

const money = (n: number) => ({ amount: n.toFixed(2), currencyCode: "USD" });
const NOW = Date.parse("2026-10-01T00:00:00Z");

function build(seed: Seed): Product {
  const variants = seed.sizes.map((s, i) => ({
    id: `demo-variant:${seed.handle}:${i}`,
    title: s.size,
    sku: null,
    availableForSale: s.available !== false,
    selectedOptions: [{ name: "Size", value: s.size }],
    price: money(s.price),
    compareAtPrice: money(s.retail),
  }));
  const prices = seed.sizes.map((s) => s.price);
  const retail = seed.sizes.map((s) => s.retail);
  const genderTag = seed.gender === "men" ? "men" : seed.gender === "women" ? "women" : "unisex";

  return {
    id: `demo-product:${seed.handle}`,
    handle: seed.handle,
    title: seed.title,
    vendor: seed.vendor,
    productType: seed.productType,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p><p>100% authentic and sourced from authorized distributors. Factory sealed.</p>`,
    availableForSale: variants.some((v) => v.availableForSale),
    tags: [genderTag, `rank-${seed.rank}`, ...(seed.tags || [])],
    gender: seed.gender,
    notes: seed.notes,
    options: [{ id: `demo-option:${seed.handle}`, name: "Size", values: seed.sizes.map((s) => s.size) }],
    variants,
    images: [],
    featuredImage: null,
    priceRange: { minVariantPrice: money(Math.min(...prices)), maxVariantPrice: money(Math.max(...prices)) },
    compareAtPriceRange: { maxVariantPrice: money(Math.max(...retail)) },
    seo: { title: null, description: null },
    updatedAt: new Date(NOW - seed.createdDaysAgo * 86_400_000).toISOString(),
    demoArt: seed.art,
  };
}

export const demoProducts: Product[] = seeds.map(build);

export const demoRank = (p: Product) => seeds.find((s) => s.handle === p.handle)?.rank ?? 999;

export const demoCollections: Collection[] = [
  {
    handle: "all",
    title: "Shop All Fragrances",
    description: "Every authentic designer perfume and cologne we carry — always below retail.",
  },
  {
    handle: "men",
    title: "Para Él · Men's Cologne",
    description:
      "Authentic designer colognes for men — fresh, woody, spicy and bold. Huele rico without paying department-store prices.",
  },
  {
    handle: "women",
    title: "Para Ella · Women's Perfume",
    description:
      "Authentic designer perfumes for women — floral, gourmand and fresh. Luxury scents, below retail.",
  },
  {
    handle: "unisex",
    title: "Unisex Fragrances",
    description: "Niche and designer scents made to be shared. One bottle, two voices.",
  },
  {
    handle: "best-sellers",
    title: "Best Sellers · Los Favoritos",
    description: "The authentic fragrances our community reaches for again and again.",
  },
  {
    handle: "gift-sets",
    title: "Gift Sets · Regalos",
    description: "Giftable luxury for birthdays, Navidad, Día de las Madres and every moment worth celebrating.",
  },
].map((c) => ({ ...c, seo: { title: null, description: null }, updatedAt: new Date(NOW).toISOString() }));
