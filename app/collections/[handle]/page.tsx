import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionView } from "@/components/collection-view";
import { JsonLd } from "@/components/json-ld";
import { getCollection, getCollectionProducts, getCollections } from "@/lib/commerce";
import { truncate } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

const chips = [
  { handle: "all", label: "All" },
  { handle: "men", label: "Para Él" },
  { handle: "women", label: "Para Ella" },
  { handle: "unisex", label: "Unisex" },
  { handle: "best-sellers", label: "Best Sellers" },
  { handle: "gift-sets", label: "Gift Sets" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection not found", robots: { index: false } };

  const title = collection.seo.title || collection.title;
  const description = truncate(
    collection.seo.description ||
      collection.description ||
      `Shop ${collection.title} at ${site.name} — 100% authentic designer fragrances below retail. ${site.tagline}.`,
  );
  return {
    title,
    description,
    alternates: { canonical: `/collections/${handle}/` },
    openGraph: { title: `${title} | ${site.name}`, description, url: `/collections/${handle}/` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const [collection, products] = await Promise.all([getCollection(handle), getCollectionProducts(handle)]);
  if (!collection || !products) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ name: collection.title, href: `/collections/${handle}/` }]} />
          <h1 style={{ marginTop: 18 }}>{collection.title}</h1>
          {collection.description && <p className="lead">{collection.description}</p>}
        </div>
      </section>
      <section className="section-tight" style={{ paddingTop: 12 }}>
        <div className="container">
          <nav className="chips" aria-label="Collections">
            {chips.map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}/`} className="chip" aria-current={c.handle === handle ? "page" : undefined}>
                {c.label}
              </Link>
            ))}
          </nav>
          <CollectionView products={products} />
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          description: collection.description,
          url: absoluteUrl(`/collections/${handle}/`),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 30).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/products/${p.handle}/`),
              name: `${p.vendor} ${p.title}`,
            })),
          },
        }}
      />
    </>
  );
}
