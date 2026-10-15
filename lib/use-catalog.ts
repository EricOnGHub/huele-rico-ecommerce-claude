"use client";

import { useEffect, useState } from "react";
import { asset } from "./config";
import type { ProductSummary } from "./types";

// The catalog index (/search-index.json) is generated at build time and loaded
// on demand for search suggestions and bag recommendations.
let request: Promise<ProductSummary[]> | null = null;

export function loadCatalog(): Promise<ProductSummary[]> {
  request ??= fetch(asset("/search-index.json"))
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      request = null;
      return [];
    });
  return request;
}

/** Returns the catalog once loaded (null until then). Pass enabled=false to defer loading. */
export function useCatalog(enabled = true) {
  const [items, setItems] = useState<ProductSummary[] | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    loadCatalog().then((list) => alive && setItems(list));
    return () => {
      alive = false;
    };
  }, [enabled]);
  return items;
}
