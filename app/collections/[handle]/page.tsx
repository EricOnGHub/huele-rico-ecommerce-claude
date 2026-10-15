import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionToolbar } from "@/components/collection-toolbar";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-grid";
import { getCollection, getCollectionProducts, parseSort, sortOptions } from "@/lib/commerce";
import { truncate } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const chips = [
  { handle: "all", label: "All" },
  { handle: "men", label: "Para Él" },
  { handle: "women", label: "Para Ella" },
  { handle: "unisex", label: "Unisex" },
  { handle: "best-sellers", label: "Best Sellers" },
  { handle: "gift-sets", label: "Gift Sets" },
];

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle } = await params;
  const sp = await searchParams;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection not found", robots: { index: false } };

  const title = collection.seo.title || collection.title;
  const description = truncate(
    collection.seo.description ||
      collection.description ||
      `Shop ${collection.title} at ${site.name} — 100% authentic designer fragrances below retail. ${site.tagline}.`,
  );
  // Sorted/filtered variations point to the clean collection URL to avoid duplicate content.
  const filtered = Boolean(sp.sort || sp.brand);
  return {
    title,
    description,
    alternates: { canonical: `/collections/${handle}` },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { title: `${title} | ${site.name}`, description, url: `/collections/${handle}` },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;
  const sort = parseSort(sp.sort);
  const brand = typeof sp.brand === "string" ? sp.brand : "";

  const [collection, products] = await Promise.all([getCollection(handle), getCollectionProducts(handle, sort)]);
  if (!collection || !products) notFound();

  const brands = [...new Set(products.map((p) => p.vendor))].sort((a, b) => a.localeCompare(b));
  const visible = brand ? products.filter((p) => p.vendor === brand) : products;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ name: collection.title, href: `/collections/${handle}` }]} />
          <h1 style={{ marginTop: 18 }}>{collection.title}</h1>
          {collection.description && <p className="lead">{collection.description}</p>}
        </div>
      </section>
      <section className="section-tight" style={{ paddingTop: 12 }}>
        <div className="container">
          <nav className="chips" aria-label="Collections">
            {chips.map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}`} className="chip" aria-current={c.handle === handle ? "page" : undefined}>
                {c.label}
              </Link>
            ))}
          </nav>
          <Suspense>
            <CollectionToolbar count={visible.length} sort={sort} sortOptions={sortOptions} brands={brands} brand={brand} />
          </Suspense>
          {visible.length ? (
            <ProductGrid products={visible} priorityCount={4} />
          ) : (
            <div className="empty-state">
              <h2>Coming soon · Muy pronto</h2>
              <p className="muted">New fragrances are on the way. In the meantime, explore our best sellers.</p>
              <Link href="/collections/best-sellers" className="btn btn-primary">
                Shop Best Sellers
              </Link>
            </div>
          )}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          description: collection.description,
          url: absoluteUrl(`/collections/${handle}`),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: visible.length,
            itemListElement: visible.slice(0, 30).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/products/${p.handle}`),
              name: `${p.vendor} ${p.title}`,
            })),
          },
        }}
      />
    </>
  );
}
