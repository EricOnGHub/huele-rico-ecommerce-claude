"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { searchProducts } from "@/lib/catalog-utils";
import type { Product } from "@/lib/types";
import { Search } from "./icons";
import { ProductGrid } from "./product-grid";

export function SearchView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = (params.get("q") || "").trim().slice(0, 100);
  const [draft, setDraft] = useState(query);
  const results = useMemo(() => searchProducts(products, query), [products, query]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{query ? "Search results" : "Busca tu aroma"}</h1>
          <form
            role="search"
            className="search-form"
            style={{ marginTop: 18 }}
            onSubmit={(e) => {
              e.preventDefault();
              const q = draft.trim();
              router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname);
            }}
          >
            <label htmlFor="search-q" className="sr-only">
              Search by fragrance, brand or note
            </label>
            <input
              id="search-q"
              name="q"
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="input"
              placeholder="Try “Dior”, “vanilla” or “gift set”"
            />
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
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
          )}
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : query ? (
            <div className="empty-state">
              <h2>No encontramos nada</h2>
              <p className="muted">We couldn&rsquo;t find a match. Try a brand name, a note like &ldquo;vanilla&rdquo;, or browse everything.</p>
              <Link href="/collections/all/" className="btn btn-primary">
                Shop All Fragrances
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
