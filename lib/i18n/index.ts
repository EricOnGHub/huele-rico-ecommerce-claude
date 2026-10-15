// Bilingual helpers. English lives at the site root, Spanish under /es.
import type { Lang } from "../types";
import { en, type Dict } from "./en";
import { es } from "./es";

export type { Dict };
export const LANGS: Lang[] = ["en", "es"];
const dicts: Record<Lang, Dict> = { en, es };

export const getDict = (lang: Lang): Dict => dicts[lang];

/** Fills {placeholders}: fmt("Save {n}%", { n: 20 }) → "Save 20%". */
export function fmt(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Localized internal path: lp("es", "/collections/men") → "/es/collections/men/". */
export function lp(lang: Lang, path: string) {
  const [p, rest = ""] = path.split(/(?=[?#])/);
  let clean = p.startsWith("/") ? p : `/${p}`;
  if (!clean.endsWith("/")) clean += "/";
  return (lang === "es" ? `/es${clean === "/" ? "/" : clean}` : clean) + rest;
}

/** Path without the /es prefix (used by the language switch and hreflang). */
export function stripLang(path: string) {
  return path.replace(/^\/es(?=\/|$)/, "") || "/";
}

export const htmlLang: Record<Lang, string> = { en: "en-US", es: "es-US" };

/** hreflang alternates for a path (path given without language prefix). */
export function languageAlternates(path: string) {
  return { "en-US": lp("en", path), "es-US": lp("es", path), "x-default": lp("en", path) };
}

export function navItems(lang: Lang) {
  const t = getDict(lang).nav;
  return [
    { label: t.shopAll, href: lp(lang, "/collections/all") },
    { label: t.forHim, href: lp(lang, "/collections/men") },
    { label: t.forHer, href: lp(lang, "/collections/women") },
    { label: t.bestSellers, href: lp(lang, "/collections/best-sellers") },
    { label: t.giftSets, href: lp(lang, "/collections/gift-sets") },
    { label: t.quiz, href: lp(lang, "/quiz") },
    { label: t.authenticity, href: lp(lang, "/pages/authenticity") },
  ];
}

export function footerGroups(lang: Lang) {
  const t = getDict(lang).footer;
  const n = getDict(lang).nav;
  return [
    {
      title: t.shop,
      links: [
        { label: n.shopAll, href: lp(lang, "/collections/all") },
        { label: t.paraEl, href: lp(lang, "/collections/men") },
        { label: t.paraElla, href: lp(lang, "/collections/women") },
        { label: n.unisex, href: lp(lang, "/collections/unisex") },
        { label: n.bestSellers, href: lp(lang, "/collections/best-sellers") },
        { label: n.giftSets, href: lp(lang, "/collections/gift-sets") },
      ],
    },
    {
      title: t.help,
      links: [
        { label: t.quiz, href: lp(lang, "/quiz") },
        { label: t.shipping, href: lp(lang, "/pages/shipping-returns") },
        { label: t.faq, href: lp(lang, "/pages/faq") },
        { label: t.contact, href: lp(lang, "/pages/contact") },
        { label: t.care, href: lp(lang, "/pages/fragrance-care") },
      ],
    },
    {
      title: t.brand,
      links: [
        { label: t.story, href: lp(lang, "/pages/about") },
        { label: t.promise, href: lp(lang, "/pages/authenticity") },
        { label: t.privacy, href: lp(lang, "/pages/privacy") },
        { label: t.terms, href: lp(lang, "/pages/terms") },
      ],
    },
  ];
}

/** Titles/descriptions for the built-in collections (Shopify collections use their own, translated via Translate & Adapt). */
export const collectionCopy: Record<Lang, Record<string, { title: string; description: string }>> = {
  en: {},
  es: {
    all: { title: "Todas las Fragancias", description: "Todos los perfumes y lociones de diseñador originales que tenemos, siempre por debajo del precio de tienda." },
    men: {
      title: "Para Él · Lociones para Hombre",
      description: "Lociones de diseñador originales para hombre: frescas, amaderadas, especiadas e intensas. Huele rico sin pagar precios de tienda departamental.",
    },
    women: {
      title: "Para Ella · Perfumes para Mujer",
      description: "Perfumes de diseñador originales para mujer: florales, dulces y frescos. Aromas de lujo por debajo del precio de tienda.",
    },
    unisex: { title: "Fragancias Unisex", description: "Aromas de nicho y de diseñador para compartir. Un frasco, dos voces." },
    "best-sellers": { title: "Los Favoritos · Más Vendidos", description: "Las fragancias originales que nuestra comunidad elige una y otra vez." },
    "gift-sets": {
      title: "Regalos · Sets de Regalo",
      description: "Lujo para regalar en cumpleaños, Navidad, el Día de las Madres y cada momento que vale la pena celebrar.",
    },
  },
};
