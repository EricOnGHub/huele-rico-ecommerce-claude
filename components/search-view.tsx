"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { searchSummaries } from "@/lib/scent";
import type { ProductSummary } from "@/lib/types";
import { Search } from "./icons";
import { ProductGrid } from "./product-grid";

export function SearchView({ products }: { products: ProductSummary[] }) {
  const { t, lp } = useLang();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = (params.get("q") || "").trim().slice(0, 100);
  const [draft, setDraft] = useState(query);
  useEffect(() => setDraft(query), [query]);
  const results = useMemo(() => (query ? searchSummaries(products, query) : []), [products, query]);
  const label = fmt(results.length === 1 ? t.search.one : t.search.other, { n: results.length, q: query });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{query ? t.search.results : t.search.heading}</h1>
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
              {t.header.searchLabel}
            </label>
            <input id="search-q" name="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} className="input" placeholder={t.search.placeholder} />
            <button type="submit" className="btn btn-primary" aria-label={t.header.submitSearch}>
              <Search />
            </button>
          </form>
        </div>
      </section>
      <section className="section-tight">
        <div className="container">
          {query && (
            <p className="toolbar-count" aria-live="polite" style={{ marginBottom: 20 }}>
              {label}
            </p>
          )}
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : query ? (
            <div className="empty-state">
              <h2>{t.search.noneTitle}</h2>
              <p className="muted">{t.search.noneBody}</p>
              <div className="stack-sm" style={{ justifyContent: "center" }}>
                <Link href={lp("/collections/all")} className="btn btn-primary">
                  {t.search.shopAll}
                </Link>
                <Link href={lp("/quiz")} className="btn btn-gold">
                  {t.cart.takeQuiz}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
