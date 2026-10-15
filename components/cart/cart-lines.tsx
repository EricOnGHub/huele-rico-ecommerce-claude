"use client";

import Link from "next/link";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { Cart } from "@/lib/types";
import { BottleArt } from "../bottle-art";
import { Bag } from "../icons";
import { useCart } from "./cart-context";

const FREE_SHIP = 50;

export function FreeShippingMeter({ cart }: { cart: Cart }) {
  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);
  return (
    <div className="ship-meter" aria-live="polite">
      {remaining > 0 ? (
        <>
          You&rsquo;re <strong>{formatMoney({ amount: String(remaining), currencyCode: cart.cost.subtotalAmount.currencyCode })}</strong> away
          from free shipping · <em>envío gratis</em>
        </>
      ) : (
        <>
          <strong>¡Felicidades!</strong> Your order ships free.
        </>
      )}
      <div className="bar" role="presentation">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartLines({ cart, onNavigate }: { cart: Cart; onNavigate?: () => void }) {
  const { updateItem } = useCart();
  const [busy, setBusy] = useState<string | null>(null);

  const change = async (id: string, qty: number) => {
    setBusy(id);
    await updateItem(id, qty);
    setBusy(null);
  };

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {cart.lines.map((line) => {
        const p = line.merchandise.product;
        const href = `/products/${p.handle}`;
        const size = line.merchandise.selectedOptions.find((o) => o.value !== "Default Title")?.value;
        return (
          <li key={line.id} className="cart-line" aria-busy={busy === line.id}>
            <Link href={href} className="cart-thumb" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
              {p.featuredImage?.url ? (
                <img src={`${p.featuredImage.url}${p.featuredImage.url.includes("?") ? "&" : "?"}width=200`} alt="" loading="lazy" />
              ) : (
                <BottleArt vendor={p.vendor} title={p.title} {...p.demoArt} />
              )}
            </Link>
            <div>
              <div className="p-card-vendor">{p.vendor}</div>
              <Link href={href} onClick={onNavigate} className="cart-line-title">
                {p.title}
              </Link>
              <div className="cart-line-meta">
                {size}
                {size ? " · " : ""}
                {formatMoney(line.merchandise.price)}
              </div>
              <div className="qty sm" role="group" aria-label={`Quantity for ${p.title}`}>
                <button type="button" aria-label="Decrease quantity" disabled={busy === line.id} onClick={() => change(line.id, line.quantity - 1)}>
                  −
                </button>
                <span aria-live="polite">{line.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={busy === line.id || line.quantity >= 10}
                  onClick={() => change(line.id, line.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-line-right">
              <strong>{formatMoney(line.cost.totalAmount)}</strong>
              <button type="button" className="text-btn" onClick={() => change(line.id, 0)} disabled={busy === line.id}>
                Remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartTotals({ cart, onCheckout }: { cart: Cart; onCheckout?: () => void }) {
  return (
    <>
      <div className="cart-row total">
        <span>Subtotal</span>
        <span>{formatMoney(cart.cost.subtotalAmount)}</span>
      </div>
      <p className="cart-note">Taxes and shipping calculated at checkout. 100% authentic — guaranteed.</p>
      <a href={cart.checkoutUrl} className="btn btn-primary btn-block" onClick={onCheckout}>
        <Bag /> Secure Checkout
      </a>
    </>
  );
}

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="cart-empty">
      <Bag />
      <h3>Your bag is empty</h3>
      <p className="muted">Tu bolsa está vacía — let&rsquo;s find your next signature scent.</p>
      <Link href="/collections/best-sellers" className="btn btn-primary" onClick={onNavigate}>
        Shop Best Sellers
      </Link>
    </div>
  );
}
