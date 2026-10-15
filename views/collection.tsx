import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionView } from "@/components/collection-view";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-grid";
import { getCollection, getCollectionProducts, getCollections } from "@/lib/commerce";
import { truncate } from "@/lib/format";
import { fmt, getDict, lp } from "@/lib/i18n";
import { toSummary } from "@/lib/scent";
import { absoluteUrl } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { pageMeta } from "./meta";

const CHIPS = ["all", "men", "women", "unisex", "best-sellers", "gift-sets"] as const;

export async function collectionParams(lang: Lang) {
  const collections = await getCollections(lang);
  return collections.map((c) => ({ handle: c.handle }));
}

export async function collectionMetadata(lang: Lang, handle: string): Promise<Metadata> {
  const collection = await getCollection(handle, lang);
  if (!collection) return { title: "404", robots: { index: false } };
  const title = collection.seo.title || collection.title;
  const description = truncate(collection.seo.description || collection.description || fmt(getDict(lang).collection.fallbackDescription, { title: collection.title }));
  return pageMeta({ lang, path: `/collections/${handle}`, title, description });
}

export async function CollectionPageView({ lang, handle }: { lang: Lang; handle: string }) {
  const t = getDict(lang);
  const [collection, products] = await Promise.all([getCollection(handle, lang), getCollectionProducts(handle, lang)]);
  if (!collection || !products) notFound();
  const summaries = products.map(toSummary);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs lang={lang} items={[{ name: collection.title, href: `/collections/${handle}` }]} />
          <h1 style={{ marginTop: 18 }}>{collection.title}</h1>
          {collection.description && <p className="lead">{collection.description}</p>}
        </div>
      </section>
      <section className="section-tight" style={{ paddingTop: 12 }}>
        <div className="container">
          <nav className="chips" aria-label={t.collection.chipsLabel}>
            {CHIPS.map((c) => (
              <Link key={c} href={lp(lang, `/collections/${c}`)} className="chip" aria-current={c === handle ? "page" : undefined}>
                {t.collection.chips[c]}
              </Link>
            ))}
          </nav>
          {/* The plain grid is what search engines and no-JS visitors see; filters load on top of it. */}
          <Suspense fallback={<ProductGrid products={summaries} priorityCount={4} />}>
            <CollectionView products={summaries} />
          </Suspense>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          description: collection.description,
          url: absoluteUrl(lp(lang, `/collections/${handle}`)),
          inLanguage: lang === "es" ? "es-US" : "en-US",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 30).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(lp(lang, `/products/${p.handle}`)),
              name: `${p.vendor} ${p.title}`,
            })),
          },
        }}
      />
    </>
  );
}
