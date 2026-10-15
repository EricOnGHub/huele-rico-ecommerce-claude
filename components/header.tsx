"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { footerGroups, fmt, navItems } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { useCart } from "./cart/cart-context";
import { Bag, Chevron, Close, Menu, Search } from "./icons";
import { LangSwitch } from "./lang-switch";
import { Logo } from "./logo";
import { PredictiveSearch } from "./predictive-search";

export function Header() {
  const pathname = usePathname() || "/";
  const { lang, t, lp } = useLang();
  const { cart, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const count = cart?.totalQuantity || 0;
  const nav = navItems(lang);
  const help = footerGroups(lang)[1].links;
  const current = (href: string) => pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <>
      <div className="announce">
        <strong>{t.announce.free}</strong> {t.announce.onOrders}
        <span className="hide-sm">
          <span className="sep">✦</span>
          {t.announce.extra1}
          <span className="sep">✦</span>
          {t.announce.extra2}
        </span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-left">
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-label={t.header.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label={t.header.search}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              {searchOpen ? <Close /> : <Search />}
            </button>
          </div>
          <Logo href={lp("/")} />
          <div className="header-right">
            <LangSwitch className="desktop-only" />
            <button type="button" className="icon-btn" onClick={open} aria-label={count === 1 ? t.header.openBagOne : fmt(t.header.openBag, { n: count })}>
              <Bag />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="search-panel" id="site-search">
            <div className="container">
              <PredictiveSearch autoFocus onNavigate={() => setSearchOpen(false)} />
            </div>
          </div>
        )}

        <nav className="main-nav" aria-label={t.header.mainNav}>
          <ul className="container">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href) ? "page" : undefined}>
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
        aria-label={t.header.menu}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="drawer-head">
          <Logo href={lp("/")} />
          <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label={t.header.closeMenu}>
            <Close />
          </button>
        </div>
        <nav className="drawer-body mobile-nav" aria-label={t.header.mobileNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label} <Chevron width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="small-links" style={{ marginTop: 18 }}>
            {help.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 22 }}>
            <LangSwitch className="lang-switch-lg" />
          </div>
          <p className="script" style={{ marginTop: 28 }}>
            Huele bien. Vive mejor.
          </p>
        </nav>
      </aside>
    </>
  );
}
