import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { Search } from "@/components/icons";
import { getProducts, parseSort } from "@/lib/commerce";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  return {
    title: query ? `Search results for “${query}”` : "Search",
    alternates: { canonical: "/search" },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const products = query ? await getProducts({ search: query, sort: parseSort(sp.sort) }) : [];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{query ? "Search results" : "Busca tu aroma"}</h1>
          <form role="search" action="/search" className="search-form" style={{ marginTop: 18 }}>
            <label htmlFor="search-q" className="sr-only">
              Search by fragrance, brand or note
            </label>
            <input id="search-q" name="q" type="search" defaultValue={query} className="input" placeholder="Try “Dior”, “vanilla” or “gift set”" />
            <button type="submit" className="btn btn-primary" aria-label="Search">
              <Search />
            </button>
          </form>
        </div>
      </section>
      <section className="section-tight">
        <div className="container">
          {query && (
            <p className="toolbar-count" aria-live="polite" style={{ marginBottom: 20 }}>
              {products.length} {products.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
          )}
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : query ? (
            <div className="empty-state">
              <h2>No encontramos nada</h2>
              <p className="muted">We couldn&rsquo;t find a match. Try a brand name, a note like &ldquo;vanilla&rdquo;, or browse everything.</p>
              <Link href="/collections/all" className="btn btn-primary">
                Shop All Fragrances
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
