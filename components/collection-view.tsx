"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  filterOptions,
  filtersFromParams,
  filtersToParams,
  SORT_KEYS,
  sortSummaries,
  type Filters,
} from "@/lib/catalog-utils";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import type { ProductSummary, SortKey } from "@/lib/types";
import { Close } from "./icons";
import { ProductGrid } from "./product-grid";

type ListKey = "family" | "type" | "size" | "price" | "brand" | "for";

export function CollectionView({ products }: { products: ProductSummary[] }) {
  const { t, lp } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => filtersFromParams(new URLSearchParams(params.toString())));
  const [sort, setSort] = useState<SortKey>(() => {
    const s = params.get("sort") as SortKey;
    return SORT_KEYS.includes(s) ? s : "featured";
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keep the URL in sync so filtered views can be shared and survive "back".
  useEffect(() => {
    const qs = filtersToParams(filters, sort).toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    if (next !== `${pathname}${params.toString() ? `?${params}` : ""}`) router.replace(next, { scroll: false });
  }, [filters, sort]);

  useEffect(() => {
    if (!panelOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanelOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const options = useMemo(() => filterOptions(products), [products]);
  const visible = useMemo(() => sortSummaries(applyFilters(products, filters), sort), [products, filters, sort]);
  const count = activeFilterCount(filters);

  const toggle = (key: ListKey, value: string) =>
    setFilters((f) => {
      const list = f[key] as string[];
      return { ...f, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });

  const labelFor = (key: ListKey, value: string): string => {
    switch (key) {
      case "family": return t.families[value as keyof typeof t.families]?.name ?? value;
      case "size": return t.collection.sizes[value as keyof typeof t.collection.sizes] ?? value;
      case "price": return t.collection.prices[value as keyof typeof t.collection.prices] ?? value;
      case "for": return t.genderShort[value as keyof typeof t.genderShort] ?? value;
      default: return value;
    }
  };

  const groups: { key: ListKey; values: string[] }[] = [
    { key: "family", values: options.family },
    { key: "for", values: options.for.length > 1 ? options.for : [] },
    { key: "type", values: options.type.length > 1 ? options.type : [] },
    { key: "size", values: options.size },
    { key: "price", values: options.price },
    { key: "brand", values: options.brand.length > 1 ? options.brand : [] },
  ];

  const chips = groups.flatMap((g) => (filters[g.key] as string[]).map((v) => ({ key: g.key, value: v, label: labelFor(g.key, v) })));
  const countLabel = fmt(visible.length === 1 ? t.collection.one : t.collection.other, { n: visible.length });

  return (
    <>
      <div className="toolbar">
        <button type="button" className="btn btn-outline btn-sm filter-btn" onClick={() => setPanelOpen(true)} aria-expanded={panelOpen} aria-controls="filter-panel">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          {t.collection.filters}
          {count > 0 && <span className="filter-count">{count}</span>}
        </button>
        <span className="toolbar-count" aria-live="polite">
          {countLabel}
        </span>
        <div className="select-wrap">
          <label htmlFor="sort" className="sr-only">
            {t.collection.sortBy}
          </label>
          <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>
                {t.collection.sort[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="active-filters">
          {chips.map((c) => (
            <button key={`${c.key}-${c.value}`} type="button" className="chip chip-x" onClick={() => toggle(c.key, c.value)} aria-label={fmt(t.collection.remove, { label: c.label })}>
              {c.label} <Close width={14} height={14} />
            </button>
          ))}
          {filters.inStock && (
            <button type="button" className="chip chip-x" onClick={() => setFilters((f) => ({ ...f, inStock: false }))} aria-label={fmt(t.collection.remove, { label: t.collection.inStock })}>
              {t.collection.inStock} <Close width={14} height={14} />
            </button>
          )}
          <button type="button" className="text-btn" onClick={() => setFilters(emptyFilters())}>
            {t.collection.clearAll}
          </button>
        </div>
      )}

      {visible.length ? (
        <ProductGrid products={visible} priorityCount={4} />
      ) : products.length ? (
        <div className="empty-state">
          <h2>{t.collection.noMatchTitle}</h2>
          <p className="muted">{t.collection.noMatchBody}</p>
          <div className="stack-sm" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={() => setFilters(emptyFilters())}>
              {t.collection.clearAll}
            </button>
            <Link href={lp("/quiz")} className="btn btn-gold">
              {t.cart.takeQuiz}
            </Link>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h2>{t.collection.emptyTitle}</h2>
          <p className="muted">{t.collection.emptyBody}</p>
          <Link href={lp("/collections/best-sellers")} className="btn btn-primary">
            {t.cart.shopBest}
          </Link>
        </div>
      )}

      {/* Filter panel: side drawer on desktop, bottom sheet on phones */}
      <div className={`drawer-backdrop ${panelOpen ? "open" : ""}`} onClick={() => setPanelOpen(false)} aria-hidden="true" />
      <aside id="filter-panel" className={`drawer right sheet ${panelOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={t.collection.filters} aria-hidden={!panelOpen} inert={!panelOpen}>
        <div className="drawer-head">
          <h2>{t.collection.filters}</h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={() => setPanelOpen(false)} aria-label={t.collection.close}>
            <Close />
          </button>
        </div>
        <div className="drawer-body filter-body">
          {groups
            .filter((g) => g.values.length > 0)
            .map((g) => (
              <fieldset key={g.key} className="filter-group">
                <legend>{t.collection.groups[g.key]}</legend>
                <div className="filter-options">
                  {g.values.map((v) => {
                    const id = `f-${g.key}-${v}`.replace(/[^a-zA-Z0-9-]/g, "-");
                    const checked = (filters[g.key] as string[]).includes(v);
                    return (
                      <label key={v} htmlFor={id} className={`filter-option ${checked ? "on" : ""} ${g.key === "family" ? `fam-${v}` : ""}`}>
                        <input id={id} type="checkbox" checked={checked} onChange={() => toggle(g.key, v)} />
                        <span>{labelFor(g.key, v)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          <fieldset className="filter-group">
            <legend>{t.collection.groups.stock}</legend>
            <label htmlFor="f-stock" className={`filter-option ${filters.inStock ? "on" : ""}`}>
              <input id="f-stock" type="checkbox" checked={filters.inStock} onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))} />
              <span>{t.collection.inStock}</span>
            </label>
          </fieldset>
        </div>
        <div className="drawer-foot filter-foot">
          <button type="button" className="btn btn-outline" onClick={() => setFilters(emptyFilters())} disabled={count === 0}>
            {t.collection.clearAll}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setPanelOpen(false)}>
            {fmt(t.collection.show, { n: visible.length })}
          </button>
        </div>
      </aside>
    </>
  );
}
