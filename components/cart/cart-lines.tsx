"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { site } from "@/lib/site";
import type { Cart } from "@/lib/types";
import { useCatalog } from "@/lib/use-catalog";
import { BottleArt } from "../bottle-art";
import { Bag } from "../icons";
import { useCart } from "./cart-context";

export function FreeShippingMeter({ cart }: { cart: Cart }) {
  const { t } = useLang();
  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const pct = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);
  const amount = formatMoney({ amount: String(remaining), currencyCode: cart.cost.subtotalAmount.currencyCode });
  return (
    <div className="ship-meter" aria-live="polite">
      {remaining > 0 ? fmt(t.cart.away, { amount }) : t.cart.done}
      <div className="bar" role="presentation">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartLines({ cart, onNavigate }: { cart: Cart; onNavigate?: () => void }) {
  const { updateItem } = useCart();
  const { t, lp } = useLang();
  const [busy, setBusy] = useState<string | null>(null);

  const change = async (id: string, qty: number) => {
    setBusy(id);
    await updateItem(id, qty);
    setBusy(null);
  };

  return (
    <ul className="cart-list">
      {cart.lines.map((line) => {
        const p = line.merchandise.product;
        const href = lp(`/products/${p.handle}`);
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
              <div className="qty sm" role="group" aria-label={fmt(t.cart.qtyFor, { title: p.title })}>
                <button type="button" aria-label={t.buy.decrease} disabled={busy === line.id} onClick={() => change(line.id, line.quantity - 1)}>
                  −
                </button>
                <span aria-live="polite">{line.quantity}</span>
                <button type="button" aria-label={t.buy.increase} disabled={busy === line.id || line.quantity >= 10} onClick={() => change(line.id, line.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <div className="cart-line-right">
              <strong>{formatMoney(line.cost.totalAmount)}</strong>
              <button type="button" className="text-btn" onClick={() => change(line.id, 0)} disabled={busy === line.id}>
                {t.cart.remove}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Small add-on suggestions in the bag: gift sets and lower-priced favorites not already in it. */
export function CartUpsell({ cart }: { cart: Cart }) {
  const { t } = useLang();
  const { addItem } = useCart();
  const catalog = useCatalog(true);
  const [busy, setBusy] = useState<string | null>(null);

  const picks = useMemo(() => {
    if (!catalog) return [];
    const inBag = new Set(cart.lines.map((l) => l.merchandise.product.handle));
    const candidates = catalog.filter((p) => p.available && p.variantId && !inBag.has(p.handle));
    const gifts = candidates.filter((p) => p.tags.includes("gift-set"));
    const easy = candidates.filter((p) => !p.tags.includes("gift-set")).sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
    return [...gifts.slice(0, 1), ...easy].slice(0, 2);
  }, [catalog, cart.lines]);

  if (!picks.length) return null;
  return (
    <section className="upsell" aria-label={t.cart.upsellTitle}>
      <h3 className="subhead">{t.cart.upsellTitle}</h3>
      <ul>
        {picks.map((p) => (
          <li key={p.handle}>
            <div className="upsell-thumb" aria-hidden="true">
              {p.image?.url ? <img src={`${p.image.url}${p.image.url.includes("?") ? "&" : "?"}width=120`} alt="" loading="lazy" /> : <BottleArt vendor={p.vendor} title={p.title} {...p.demoArt} />}
            </div>
            <div className="upsell-info">
              <span className="p-card-vendor">{p.vendor}</span>
              <span className="upsell-title">{p.title}</span>
              <span className="muted">{formatMoney(p.price)}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={busy === p.handle}
              aria-label={fmt(t.card.addToBag, { title: p.title })}
              onClick={async () => {
                setBusy(p.handle);
                await addItem(p.variantId!, 1);
                setBusy(null);
              }}
            >
              {busy === p.handle ? t.cart.adding : t.cart.add}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CartTotals({ cart, onCheckout }: { cart: Cart; onCheckout?: () => void }) {
  const { t } = useLang();
  return (
    <>
      <div className="cart-row total">
        <span>{t.cart.subtotal}</span>
        <span>{formatMoney(cart.cost.subtotalAmount)}</span>
      </div>
      <p className="cart-note">{t.cart.note}</p>
      <a href={cart.checkoutUrl} className="btn btn-primary btn-block" onClick={onCheckout}>
        <Bag /> {t.cart.checkout}
      </a>
    </>
  );
}

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  const { t, lp } = useLang();
  return (
    <div className="cart-empty">
      <Bag />
      <h3>{t.cart.emptyTitle}</h3>
      <p className="muted">{t.cart.emptyBody}</p>
      <div className="stack-sm">
        <Link href={lp("/collections/best-sellers")} className="btn btn-primary" onClick={onNavigate}>
          {t.cart.shopBest}
        </Link>
        <Link href={lp("/quiz")} className="btn btn-gold" onClick={onNavigate}>
          {t.cart.takeQuiz}
        </Link>
      </div>
    </div>
  );
}
