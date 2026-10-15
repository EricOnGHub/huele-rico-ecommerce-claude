"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatMoney } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { searchSummaries } from "@/lib/scent";
import { useCatalog } from "@/lib/use-catalog";
import { BottleArt } from "./bottle-art";
import { Search } from "./icons";

/** Search box with instant, typo-tolerant suggestions (products + brands). */
export function PredictiveSearch({ onNavigate, autoFocus }: { onNavigate?: () => void; autoFocus?: boolean }) {
  const { t, lp } = useLang();
  const router = useRouter();
  const catalog = useCatalog(true);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const query = q.trim();
  const results = useMemo(() => (catalog && query.length >= 2 ? searchSummaries(catalog, query).slice(0, 6) : []), [catalog, query]);
  const brands = useMemo(() => {
    if (!catalog || query.length < 2) return [];
    const needle = query.toLowerCase();
    return [...new Set(catalog.map((p) => p.vendor))].filter((v) => v.toLowerCase().includes(needle)).slice(0, 3);
  }, [catalog, query]);

  const searchHref = (term: string) => `${lp("/search")}?q=${encodeURIComponent(term)}`;
  const go = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  return (
    <div className="psearch">
      <form
        role="search"
        className="search-form"
        action={lp("/search")}
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && results[active]) return go(lp(`/products/${results[active].handle}`));
          if (query) go(searchHref(query));
        }}
      >
        <label htmlFor="site-q" className="sr-only">
          {t.header.searchLabel}
        </label>
        <input
          ref={inputRef}
          id="site-q"
          name="q"
          type="search"
          className="input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(-1, i - 1));
            }
          }}
          placeholder={t.header.searchPlaceholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="psearch-list"
          aria-activedescendant={active >= 0 ? `ps-${active}` : undefined}
        />
        <button type="submit" className="btn btn-primary" aria-label={t.header.submitSearch}>
          <Search />
        </button>
      </form>

      {query.length < 2 ? (
        <div className="psearch-popular">
          <span className="muted">{t.header.popular}:</span>
          {t.header.popularTerms.map((term) => (
            <Link key={term} href={searchHref(term)} className="chip" onClick={onNavigate}>
              {term}
            </Link>
          ))}
        </div>
      ) : (
        <div className="psearch-panel">
          {brands.length > 0 && (
            <div className="psearch-brands">
              {brands.map((b) => (
                <Link key={b} href={searchHref(b)} className="chip" onClick={onNavigate}>
                  {b}
                </Link>
              ))}
            </div>
          )}
          {results.length > 0 ? (
            <ul id="psearch-list" role="listbox" aria-label={t.header.suggestions}>
              {results.map((p, i) => (
                <li key={p.handle} id={`ps-${i}`} role="option" aria-selected={i === active}>
                  <Link href={lp(`/products/${p.handle}`)} onClick={onNavigate} className={i === active ? "active" : ""}>
                    <span className="psearch-thumb" aria-hidden="true">
                      {p.image?.url ? (
                        <img src={`${p.image.url}${p.image.url.includes("?") ? "&" : "?"}width=96`} alt="" />
                      ) : (
                        <BottleArt vendor={p.vendor} title={p.title} {...p.demoArt} />
                      )}
                    </span>
                    <span className="psearch-text">
                      <span className="p-card-vendor">{p.vendor}</span>
                      <span className="psearch-title">{p.title}</span>
                    </span>
                    <span className="psearch-price">{formatMoney(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            catalog && <p className="muted psearch-empty">{t.header.noMatches}</p>
          )}
          {results.length > 0 && (
            <Link href={searchHref(query)} className="link-arrow psearch-all" onClick={onNavigate}>
              {fmt(t.header.seeAll, { q: query })}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
