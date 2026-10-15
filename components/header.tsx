"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/config";
import { footerNav, mainNav } from "@/lib/site";
import { useCart } from "./cart/cart-context";
import { Bag, Chevron, Close, Menu, Search } from "./icons";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const count = cart?.totalQuantity || 0;

  return (
    <>
      <div className="announce">
        <strong>Free fast U.S. shipping</strong> on orders $50+
        <span className="hide-sm">
          <span className="sep">✦</span>Envío rápido y gratis
          <span className="sep">✦</span>100% Originales
        </span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-left">
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Search fragrances"
              aria-expanded={searchOpen}
              aria-controls="site-search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search />
            </button>
          </div>
          <Logo />
          <div className="header-right">
            <button type="button" className="icon-btn" onClick={open} aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
              <Bag />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="search-panel" id="site-search">
            <div className="container">
              <form
                role="search"
                className="search-form"
                action={asset("/search/")}
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = searchRef.current?.value.trim();
                  if (q) router.push(`/search/?q=${encodeURIComponent(q)}`);
                }}
              >
                <label htmlFor="q" className="sr-only">
                  Search by fragrance, brand or note
                </label>
                <input
                  ref={searchRef}
                  id="q"
                  name="q"
                  type="search"
                  className="input"
                  placeholder="Busca tu aroma — brand, scent or note…"
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-primary" aria-label="Search">
                  <Search />
                </button>
              </form>
            </div>
          </div>
        )}

        <nav className="main-nav" aria-label="Main">
          <ul className="container">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname.replace(/\/$/, "") === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile menu */}
      <div className={`drawer-backdrop ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <aside
        id="mobile-menu"
        className={`drawer left ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="drawer-head">
          <Logo />
          <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Close />
          </button>
        </div>
        <nav className="drawer-body mobile-nav" aria-label="Mobile">
          <ul>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label} <Chevron width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="small-links" style={{ marginTop: 18 }}>
            {[...footerNav.help, footerNav.about[0]].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <p className="script" style={{ marginTop: 28 }}>
            Huele bien. Vive mejor.
          </p>
        </nav>
      </aside>
    </>
  );
}
