"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sortOptions, sortProducts } from "@/lib/catalog-utils";
import type { Product, SortKey } from "@/lib/types";
import { ProductGrid } from "./product-grid";

export function CollectionView({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [brand, setBrand] = useState("");

  const brands = useMemo(() => [...new Set(products.map((p) => p.vendor))].sort((a, b) => a.localeCompare(b)), [products]);
  const visible = useMemo(
    () => sortProducts(brand ? products.filter((p) => p.vendor === brand) : products, sort),
    [products, brand, sort],
  );

  return (
    <>
      <div className="toolbar">
        <span className="toolbar-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "fragrance" : "fragrances"}
        </span>
        <div className="toolbar-controls">
          {brands.length > 1 && (
            <div className="select-wrap">
              <label htmlFor="brand" className="sr-only">
                Filter by brand
              </label>
              <select id="brand" className="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="select-wrap">
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
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
    </>
  );
}
