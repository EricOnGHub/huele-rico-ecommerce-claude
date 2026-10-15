"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";
import { CartLines, CartTotals, CartUpsell, EmptyCart, FreeShippingMeter } from "@/components/cart/cart-lines";
import { Shield } from "@/components/icons";
import { useLang } from "@/lib/i18n/use-lang";

export function CartPageClient() {
  const { cart, error } = useCart();
  const { t, lp } = useLang();
  if (!cart || cart.lines.length === 0) return <EmptyCart />;
  return (
    <div className="cart-page">
      <div>
        {error && (
          <p className="cart-error" role="alert">
            {error === "add" ? t.cart.addError : t.cart.updateError}
          </p>
        )}
        <CartLines cart={cart} />
        <CartUpsell cart={cart} />
        <p style={{ marginTop: 18 }}>
          <Link href={lp("/collections/all")} className="link-arrow">
            {t.cart.continue}
          </Link>
        </p>
      </div>
      <aside className="cart-summary" aria-label={t.cart.summary}>
        <h2 style={{ fontSize: "1.4rem" }}>{t.cart.summary}</h2>
        <FreeShippingMeter cart={cart} />
        <CartTotals cart={cart} />
        <p className="cart-note" style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Shield width={18} height={18} style={{ color: "var(--champagne-gold)", flex: "none" }} /> {t.cart.guarantee}
        </p>
      </aside>
    </div>
  );
}
