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
  /** Business days, used by the delivery estimate on product pages. Keep in line with your shipping policy. */
  shipping: { handlingDays: [1, 2] as [number, number], transitDays: [2, 5] as [number, number] },
  /** WhatsApp number in international format, digits only (e.g. 15551234567). Leave empty to hide the chat button. */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  },
  hashtags: ["#HueleRico", "#SmellRichPayLess", "#PerfumesOriginales", "#AuthenticFragrance"],
} as const;

/** Absolute URL for SEO tags. Page paths get a trailing slash to match the static export. */
export function absoluteUrl(path = "/") {
  const [raw, rest = ""] = path.split(/(?=[?#])/);
  let p = raw.startsWith("/") ? raw : `/${raw}`;
  if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
  return `${site.url}${p}${rest}`;
}
