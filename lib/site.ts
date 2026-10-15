// Central brand + site configuration.

export const site = {
  name: "Huele Rico!",
  legalName: "Huele Rico! Fragrances",
  tagline: "Huele Rico, Paga Menos",
  taglineEn: "Smell Rich. Pay Less.",
  signoff: "Huele bien. Vive mejor.",
  promise: "Authentic fragrances. Below retail. Always.",
  description:
    "Shop 100% authentic designer perfumes and colognes for men and women — below retail. Huele Rico, Paga Menos. Free fast U.S. shipping and a money-back authenticity guarantee.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@huelerico.com",
  freeShippingThreshold: 50,
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  },
  hashtags: ["#HueleRico", "#SmellRichPayLess", "#PerfumesOriginales", "#AuthenticFragrance"],
} as const;

export const mainNav = [
  { label: "Shop All", href: "/collections/all" },
  { label: "For Him", href: "/collections/men" },
  { label: "For Her", href: "/collections/women" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Gift Sets", href: "/collections/gift-sets" },
  { label: "Authenticity", href: "/pages/authenticity" },
] as const;

export const footerNav = {
  shop: [
    { label: "Shop All", href: "/collections/all" },
    { label: "Para Él · For Him", href: "/collections/men" },
    { label: "Para Ella · For Her", href: "/collections/women" },
    { label: "Unisex", href: "/collections/unisex" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "Gift Sets", href: "/collections/gift-sets" },
  ],
  help: [
    { label: "Shipping & Returns", href: "/pages/shipping-returns" },
    { label: "FAQ", href: "/pages/faq" },
    { label: "Contact · Contáctanos", href: "/pages/contact" },
    { label: "Fragrance Care", href: "/pages/fragrance-care" },
  ],
  about: [
    { label: "Our Story", href: "/pages/about" },
    { label: "Authenticity Promise", href: "/pages/authenticity" },
    { label: "Privacy Policy", href: "/pages/privacy" },
    { label: "Terms of Service", href: "/pages/terms" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
