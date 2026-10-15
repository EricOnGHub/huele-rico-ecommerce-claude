"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";
import { CartLines, CartTotals, EmptyCart, FreeShippingMeter } from "@/components/cart/cart-lines";
import { Shield } from "@/components/icons";

export function CartPageClient() {
  const { cart, error } = useCart();
  if (!cart || cart.lines.length === 0) return <EmptyCart />;
  return (
    <div className="cart-page">
      <div>
        {error && <p className="cart-error" role="alert">{error}</p>}
        <CartLines cart={cart} />
        <p style={{ marginTop: 18 }}>
          <Link href="/collections/all" className="link-arrow">
            Continue Shopping
          </Link>
        </p>
      </div>
      <aside className="cart-summary" aria-label="Order summary">
        <h2 style={{ fontSize: "1.4rem" }}>Order Summary</h2>
        <FreeShippingMeter cart={cart} />
        <CartTotals cart={cart} />
        <p className="cart-note" style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Shield width={18} height={18} style={{ color: "var(--champagne-gold)", flex: "none" }} /> Authenticity guaranteed — 100%
          original o te devolvemos tu dinero.
        </p>
      </aside>
    </div>
  );
}
