"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortKey } from "@/lib/types";

type Props = {
  count: number;
  sort: SortKey;
  sortOptions: { value: SortKey; label: string }[];
  brands: string[];
  brand: string;
};

export function CollectionToolbar({ count, sort, sortOptions, brands, brand }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="toolbar">
      <span className="toolbar-count" aria-live="polite">
        {count} {count === 1 ? "fragrance" : "fragrances"}
      </span>
      <div className="toolbar-controls">
        {brands.length > 1 && (
          <div className="select-wrap">
            <label htmlFor="brand" className="sr-only">
              Filter by brand
            </label>
            <select id="brand" className="select" value={brand} onChange={(e) => update("brand", e.target.value, "")}>
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
          <select id="sort" className="select" value={sort} onChange={(e) => update("sort", e.target.value, "featured")}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
