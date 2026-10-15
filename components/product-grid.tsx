"use client";

import type { ProductSummary } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, priorityCount = 0, notes }: { products: ProductSummary[]; priorityCount?: number; notes?: Record<string, string> }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} note={notes?.[p.handle]} />
      ))}
    </div>
  );
}
