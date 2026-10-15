"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n/use-lang";
import { Close } from "../icons";
import { useCart } from "./cart-context";
import { CartLines, CartTotals, CartUpsell, EmptyCart, FreeShippingMeter } from "./cart-lines";

export function CartDrawer() {
  const { cart, isOpen, close, error } = useCart();
  const { t, lp } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const hasItems = !!cart && cart.lines.length > 0;

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "open" : ""}`} onClick={close} aria-hidden="true" />
      <aside className={`drawer right ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={t.cart.dialog} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="drawer-head">
          <h2>
            {t.cart.title} {hasItems && <span className="muted" style={{ fontSize: "0.9rem" }}>({cart!.totalQuantity})</span>}
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label={t.cart.close}>
            <Close />
          </button>
        </div>
        <div className="drawer-body">
          {hasItems && <FreeShippingMeter cart={cart!} />}
          {error && (
            <p className="cart-error" role="alert">
              {error === "add" ? t.cart.addError : t.cart.updateError}
            </p>
          )}
          {hasItems ? <CartLines cart={cart!} onNavigate={close} /> : <EmptyCart onNavigate={close} />}
          {hasItems && isOpen && <CartUpsell cart={cart!} />}
        </div>
        {hasItems && (
          <div className="drawer-foot">
            <CartTotals cart={cart!} />
            <p className="center" style={{ margin: "12px 0 0", fontSize: "0.82rem" }}>
              <Link href={lp("/cart")} onClick={close} className="link-arrow">
                {t.cart.viewFull}
              </Link>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
