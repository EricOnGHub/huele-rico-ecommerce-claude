"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isDemoMode, newsletterWebhook } from "@/lib/config";
import { defaultVariant, formatMoney, savingsPercent } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import type { Product, ProductVariant } from "@/lib/types";
import { useCart } from "../cart/cart-context";
import { Bag } from "../icons";
import { Price } from "../price";
import { DeliveryEstimate } from "./delivery-estimate";
import { NotifyMe } from "./notify-me";

function findVariant(product: Product, selected: Record<string, string>): ProductVariant | undefined {
  return product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
}

const notifyEnabled = isDemoMode || Boolean(newsletterWebhook);

export function BuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useLang();
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

  const label = !variant ? t.buy.selectSize : available ? t.buy.add : t.buy.soldOut;
  const save = variant ? savingsPercent(variant.price, variant.compareAtPrice) : 0;

  return (
    <div>
      {variant && (
        <>
          <Price price={variant.price} compareAt={variant.compareAtPrice} className="pdp-price" />
          {save > 0 && variant.compareAtPrice && (
            <p className="pdp-retail-note">
              {fmt(t.buy.youSave, {
                amount: formatMoney({
                  amount: String(Number(variant.compareAtPrice.amount) - Number(variant.price.amount)),
                  currencyCode: variant.price.currencyCode,
                }),
              })}
              <em>{t.buy.tagline}</em>
            </p>
          )}
        </>
      )}

      {realOptions.map((option) => (
        <fieldset key={option.id} className="option-group">
          <legend>
            {/^size$/i.test(option.name) ? t.buy.size : option.name}
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
                  {!candidate?.availableForSale && <span className="sr-only">{t.buy.soldOutOption}</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="buy-row">
        <div className="qty" role="group" aria-label={t.buy.quantity}>
          <button type="button" aria-label={t.buy.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label={t.buy.increase} onClick={() => setQty((q) => Math.min(10, q + 1))}>
            +
          </button>
        </div>
        <button ref={buttonRef} type="button" className="btn btn-primary" disabled={!available || busy} onClick={add}>
          <Bag /> {busy ? t.buy.adding : label}
        </button>
      </div>

      {variant && !available && notifyEnabled && <NotifyMe key={variant.id} product={`${product.vendor} ${product.title}`} variant={variant.title} />}
      {available && <DeliveryEstimate />}

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
          {available ? t.buy.add : t.buy.soldOutShort}
        </button>
      </div>
    </div>
  );
}
