"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/use-lang";
import type { ProductSummary } from "@/lib/types";
import { ProductGrid } from "./product-grid";

const KEY = "hr_recently_viewed";
const MAX = 8;

function read(): ProductSummary[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((p) => p && typeof p.handle === "string") : [];
  } catch {
    return [];
  }
}

/** Remembers a product page visit (stored only in the shopper's browser). */
export function RecordView({ product }: { product: ProductSummary }) {
  useEffect(() => {
    try {
      const list = [product, ...read().filter((p) => p.handle !== product.handle)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable */
    }
  }, [product]);
  return null;
}

/** "Recently viewed" row. Renders nothing until the shopper has history. */
export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const { t } = useLang();
  const [items, setItems] = useState<ProductSummary[]>([]);
  useEffect(() => {
    setItems(read().filter((p) => p.handle !== exclude).slice(0, 4));
  }, [exclude]);
  if (!items.length) return null;
  return (
    <section className="section-tight section-alt" aria-labelledby="recent-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t.pdp.recentEyebrow}</p>
            <h2 id="recent-title">{t.pdp.recentTitle}</h2>
          </div>
        </div>
        <ProductGrid products={items} />
      </div>
    </section>
  );
}
