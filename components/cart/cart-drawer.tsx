"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Close } from "../icons";
import { useCart } from "./cart-context";
import { CartLines, CartTotals, EmptyCart, FreeShippingMeter } from "./cart-lines";

export function CartDrawer() {
  const { cart, isOpen, close, error } = useCart();
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
      <aside
        className={`drawer right ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="drawer-head">
          <h2>
            Your Bag {hasItems && <span className="muted" style={{ fontSize: "0.9rem" }}>({cart!.totalQuantity})</span>}
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label="Close bag">
            <Close />
          </button>
        </div>
        <div className="drawer-body">
          {hasItems && <FreeShippingMeter cart={cart!} />}
          {error && <p className="cart-error" role="alert">{error}</p>}
          {hasItems ? <CartLines cart={cart!} onNavigate={close} /> : <EmptyCart onNavigate={close} />}
        </div>
        {hasItems && (
          <div className="drawer-foot">
            <CartTotals cart={cart!} />
            <p className="center" style={{ margin: "12px 0 0", fontSize: "0.82rem" }}>
              <Link href="/cart" onClick={close} className="link-arrow">
                View full bag
              </Link>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
