"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultVariant, formatMoney, savingsPercent } from "@/lib/format";
import type { Product, ProductVariant } from "@/lib/types";
import { useCart } from "../cart/cart-context";
import { Bag } from "../icons";
import { Price } from "../price";

function findVariant(product: Product, selected: Record<string, string>): ProductVariant | undefined {
  return product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
}

export function BuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const initial = defaultVariant(product);
  const [selected, setSelected] = useState<Record<string, string>>(
    () => Object.fromEntries((initial?.selectedOptions || []).map((o) => [o.name, o.value])),
  );
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variant = useMemo(() => findVariant(product, selected), [product, selected]);
  const available = !!variant?.availableForSale;
  const realOptions = product.options.filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));

  // Sticky add-to-bag bar on mobile once the main button scrolls away.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = async () => {
    if (!variant || !available) return;
    setBusy(true);
    await addItem(variant.id, qty);
    setBusy(false);
  };

  const label = !variant ? "Select a size" : available ? "Add to Bag" : "Sold Out · Agotado";
  const save = variant ? savingsPercent(variant.price, variant.compareAtPrice) : 0;

  return (
    <div>
      {variant && (
        <>
          <Price price={variant.price} compareAt={variant.compareAtPrice} className="pdp-price" />
          {save > 0 && variant.compareAtPrice && (
            <p className="pdp-retail-note">
              You save {formatMoney({ amount: String(Number(variant.compareAtPrice.amount) - Number(variant.price.amount)), currencyCode: variant.price.currencyCode })} vs.
              retail · <em>Huele rico, paga menos.</em>
            </p>
          )}
        </>
      )}

      {realOptions.map((option) => (
        <fieldset key={option.id} className="option-group">
          <legend>
            {option.name}
            <span>{selected[option.name]}</span>
          </legend>
          <div className="option-values">
            {option.values.map((value) => {
              const candidate = findVariant(product, { ...selected, [option.name]: value });
              const isSelected = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  className="option-btn"
                  aria-pressed={isSelected}
                  data-unavailable={!candidate?.availableForSale}
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                >
                  {value}
                  {!candidate?.availableForSale && <span className="sr-only"> (sold out)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="buy-row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>
            +
          </button>
        </div>
        <button ref={buttonRef} type="button" className="btn btn-primary" disabled={!available || busy} onClick={add}>
          <Bag /> {busy ? "Adding…" : label}
        </button>
      </div>

      <div className={`sticky-atc ${showSticky ? "show" : ""}`} aria-hidden={!showSticky} inert={!showSticky}>
        <div className="sticky-title">
          <strong>{product.title}</strong>
          {variant && (
            <span>
              {variant.title !== "Default Title" ? `${variant.title} · ` : ""}
              {formatMoney(variant.price)}
            </span>
          )}
        </div>
        <button type="button" className="btn btn-primary" disabled={!available || busy} onClick={add}>
          {available ? "Add to Bag" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
