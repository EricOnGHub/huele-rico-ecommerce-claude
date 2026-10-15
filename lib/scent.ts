// Scent intelligence: builds a wearable "profile" for every fragrance and finds
// similar scents. Works from the notes when Shopify metafields aren't filled in.

import { defaultVariant } from "./format";
import type { Product, ProductSummary, ScentFamily, ScentNotes, ScentProfile, Season, TimeOfDay } from "./types";

export const FAMILIES: ScentFamily[] = ["fresh", "floral", "woody", "sweet", "spicy"];
export const SEASONS: Season[] = ["spring", "summer", "fall", "winter"];

/** Keyword → family. Matched against note names (lower-case, accents removed). */
const FAMILY_KEYWORDS: Record<ScentFamily, string[]> = {
  fresh: ["bergamot", "lemon", "mandarin", "grapefruit", "orange", "citrus", "lime", "marine", "sea", "aquatic", "mint", "apple", "pear", "ginger", "lavender", "rosemary", "sage", "green", "juniper", "neroli", "blackcurrant", "cucumber", "tea", "ambroxan"],
  floral: ["rose", "jasmine", "tuberose", "iris", "violet", "gardenia", "orange blossom", "peony", "lily", "magnolia", "orchid", "ylang", "geranium", "freesia", "lilac", "floral"],
  woody: ["cedar", "sandalwood", "vetiver", "patchouli", "oud", "guaiac", "cypress", "fir", "pine", "birch", "wood", "leather", "moss", "amberwood", "labdanum", "cashmeran"],
  sweet: ["vanilla", "tonka", "praline", "caramel", "honey", "cocoa", "chocolate", "coffee", "almond", "whipped cream", "cream", "coconut", "sugar", "benzoin", "strawberry", "musk", "amber", "ambergris"],
  spicy: ["pepper", "cinnamon", "saffron", "cardamom", "clove", "nutmeg", "cumin", "tobacco", "incense", "spice"],
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function allNotes(notes: ScentNotes | null): string[] {
  return notes ? [...notes.top, ...notes.heart, ...notes.base] : [];
}

function inferFamilies(notes: ScentNotes | null): ScentFamily[] {
  if (!notes) return [];
  // Heart and base notes define the character more than the opening.
  const weighted: [string, number][] = [
    ...notes.top.map((n) => [n, 1] as [string, number]),
    ...notes.heart.map((n) => [n, 1.4] as [string, number]),
    ...notes.base.map((n) => [n, 1.6] as [string, number]),
  ];
  const score: Record<ScentFamily, number> = { fresh: 0, floral: 0, woody: 0, sweet: 0, spicy: 0 };
  for (const [note, w] of weighted) {
    const n = norm(note);
    for (const fam of FAMILIES) if (FAMILY_KEYWORDS[fam].some((k) => n.includes(k))) score[fam] += w;
  }
  const ranked = FAMILIES.filter((f) => score[f] > 0).sort((a, b) => score[b] - score[a]);
  if (!ranked.length) return [];
  // Keep the top family plus any close runner-up.
  return ranked.filter((f, i) => i === 0 || (i === 1 && score[f] >= score[ranked[0]] * 0.6));
}

function concentrationStrength(productType: string) {
  const t = norm(productType);
  if (/(elixir|extrait|parfum$|^parfum|intense)/.test(t) && !/eau de parfum/.test(t)) return 5;
  if (/eau de parfum|edp/.test(t)) return 4;
  if (/eau de toilette|edt|gift/.test(t)) return 3;
  if (/cologne|mist|splash/.test(t)) return 2;
  return 3;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

/** Parses a metafield value that may be JSON (list) or comma-separated text. */
function list(v: string | null | undefined): string[] {
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed)) return parsed.map((x) => norm(String(x)).trim());
  } catch {
    /* plain text */
  }
  return v.split(",").map((x) => norm(x).trim()).filter(Boolean);
}

export type ProfileOverrides = {
  family?: string | null;
  longevity?: string | null;
  sillage?: string | null;
  season?: string | null;
  time?: string | null;
};

export function buildProfile(notes: ScentNotes | null, productType: string, o: ProfileOverrides = {}): ScentProfile {
  const fromMeta = list(o.family).filter((f): f is ScentFamily => (FAMILIES as string[]).includes(f));
  const families = fromMeta.length ? fromMeta : inferFamilies(notes);
  const strength = concentrationStrength(productType);
  const heavy = families.some((f) => f === "sweet" || f === "spicy" || f === "woody");
  const freshLead = families[0] === "fresh";

  const longevity = Number(o.longevity) || clamp(strength + (heavy ? 0.5 : 0) - (freshLead ? 0.5 : 0));
  const sillage = Number(o.sillage) || clamp(strength - 0.5 + (families.includes("sweet") || families.includes("spicy") ? 0.6 : 0));

  const seasonMeta = list(o.season).filter((s): s is Season => (SEASONS as string[]).includes(s));
  let seasons: Season[] = seasonMeta;
  if (!seasons.length) {
    const set = new Set<Season>();
    if (families.includes("fresh")) (["spring", "summer"] as Season[]).forEach((s) => set.add(s));
    if (families.includes("floral")) (["spring", "summer"] as Season[]).forEach((s) => set.add(s));
    if (families.includes("sweet") || families.includes("spicy")) (["fall", "winter"] as Season[]).forEach((s) => set.add(s));
    if (families.includes("woody")) (["fall", "winter", "spring"] as Season[]).forEach((s) => set.add(s));
    seasons = SEASONS.filter((s) => set.has(s));
    if (!seasons.length) seasons = [...SEASONS];
  }

  const timeMeta = list(o.time).filter((t): t is TimeOfDay => t === "day" || t === "night");
  let time: TimeOfDay[] = timeMeta;
  if (!time.length) {
    const night = families.includes("sweet") || families.includes("spicy") || strength >= 5;
    const day = families.includes("fresh") || families.includes("floral") || strength <= 3;
    time = [...(day ? (["day"] as TimeOfDay[]) : []), ...(night ? (["night"] as TimeOfDay[]) : [])];
    if (!time.length) time = ["day", "night"];
  }

  return { families: families.length ? families : ["woody"], longevity, sillage, seasons, time };
}

/** Bottle size in ml from a variant label like "3.4 oz / 100 ml". */
export function parseMl(label: string): number | null {
  const ml = label.match(/(\d+(?:\.\d+)?)\s*ml/i);
  if (ml) return Number(ml[1]);
  const oz = label.match(/(\d+(?:\.\d+)?)\s*(?:fl\.?\s*)?oz/i);
  return oz ? Math.round(Number(oz[1]) * 29.57) : null;
}

export function toSummary(p: Product): ProductSummary {
  const v = defaultVariant(p);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    productType: p.productType,
    gender: p.gender,
    tags: p.tags,
    available: p.availableForSale,
    image: p.featuredImage,
    demoArt: p.demoArt,
    price: v?.price || p.priceRange.minVariantPrice,
    compareAt: v?.compareAtPrice || null,
    multiSize: p.variants.length > 1,
    variantId: v?.availableForSale ? v.id : null,
    variantTitle: v && v.title !== "Default Title" ? v.title : null,
    sizesMl: p.variants.map((x) => parseMl(x.title)).filter((n): n is number => n !== null),
    notes: allNotes(p.notes),
    profile: p.profile,
    updatedAt: p.updatedAt,
  };
}

/* ───────────── Similar scents ───────────── */

export type Similar = { product: Product; shared: string[]; score: number };

export function similarScents(target: Product, catalog: Product[], limit = 4): Similar[] {
  const tNotes = new Set(allNotes(target.notes).map(norm));
  const tFam = new Set(target.profile.families);
  return catalog
    .filter((p) => p.handle !== target.handle && !p.tags.includes("gift-set"))
    .filter((p) => target.gender === "unisex" || p.gender === "unisex" || p.gender === target.gender)
    .map((p) => {
      const shared = allNotes(p.notes).filter((n) => tNotes.has(norm(n)));
      const famOverlap = p.profile.families.filter((f) => tFam.has(f)).length;
      const leadMatch = p.profile.families[0] === target.profile.families[0] ? 1.5 : 0;
      return { product: p, shared: [...new Set(shared)], score: shared.length * 2 + famOverlap * 1.5 + leadMatch };
    })
    .filter((s) => s.score > 1.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ───────────── Fuzzy search ───────────── */

function editDistance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
      rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

/** Scores how well a product matches a query. 0 = no match. Tolerates small typos ("savage" → Sauvage). */
export function matchScore(p: ProductSummary, query: string): number {
  const terms = norm(query).split(/[\s,]+/).filter((t) => t.length > 0);
  if (!terms.length) return 0;
  const fields: [string, number][] = [
    [norm(p.title), 3],
    [norm(p.vendor), 3],
    [norm(p.productType), 1],
    [norm(p.notes.join(" ")), 1.5],
    [norm(p.tags.join(" ") + " " + p.profile.families.join(" ") + " " + p.gender), 1],
  ];
  let total = 0;
  for (const t of terms) {
    let best = 0;
    for (const [text, w] of fields) {
      if (text.includes(t)) {
        best = Math.max(best, w * (text.startsWith(t) || text.includes(" " + t) ? 1.2 : 1));
        continue;
      }
      if (t.length < 4) continue;
      const max = t.length > 6 ? 2 : 1;
      for (const word of text.split(/[^a-z0-9]+/)) {
        if (word.length >= 3 && editDistance(t, word, max) <= max) {
          best = Math.max(best, w * 0.7);
          break;
        }
      }
    }
    if (best === 0) return 0; // every term must match something
    total += best;
  }
  return total;
}

export function searchSummaries(list: ProductSummary[], query: string): ProductSummary[] {
  return list
    .map((p) => ({ p, s: matchScore(p, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}
