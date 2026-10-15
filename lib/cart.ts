"use server";

import { cookies } from "next/headers";
import { demoProducts } from "./demo-data";
import { isDemoMode } from "./commerce";
import { sfAddToCart, sfCreateCart, sfGetCart, sfRemoveFromCart, sfUpdateCart } from "./shopify/client";
import type { Cart, CartLine } from "./types";

// Server actions for the shopping cart.
// • Shopify mode: the Shopify cart ID is kept in an httpOnly cookie and every
//   change goes through the Storefront Cart API. "Checkout" sends shoppers to
//   Shopify's secure hosted checkout (cart.checkoutUrl).
// • Demo mode: line items are kept in a cookie so you can test the flow.

const CART_COOKIE = "hr_cart_id";
const DEMO_COOKIE = "hr_demo_cart";
const cookieOpts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 };

const MAX_QTY = 10;
const clampQty = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(Number(n) || 0)));

/* ───────────── Demo cart ───────────── */

type DemoLine = { v: string; q: number };

async function readDemo(): Promise<DemoLine[]> {
  try {
    const raw = (await cookies()).get(DEMO_COOKIE)?.value;
    const parsed = raw ? (JSON.parse(raw) as DemoLine[]) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => typeof l.v === "string" && l.q > 0) : [];
  } catch {
    return [];
  }
}

async function writeDemo(lines: DemoLine[]) {
  (await cookies()).set(DEMO_COOKIE, JSON.stringify(lines), cookieOpts);
}

function demoCart(lines: DemoLine[]): Cart {
  const money = (n: number) => ({ amount: n.toFixed(2), currencyCode: "USD" });
  const out: CartLine[] = [];
  for (const { v, q } of lines) {
    const product = demoProducts.find((p) => p.variants.some((x) => x.id === v));
    const variant = product?.variants.find((x) => x.id === v);
    if (!product || !variant) continue;
    out.push({
      id: v,
      quantity: q,
      cost: { totalAmount: money(Number(variant.price.amount) * q) },
      merchandise: {
        id: v,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        price: variant.price,
        product: { handle: product.handle, title: product.title, vendor: product.vendor, featuredImage: null, demoArt: product.demoArt },
      },
    });
  }
  const subtotal = out.reduce((s, l) => s + Number(l.cost.totalAmount.amount), 0);
  return {
    id: "demo",
    checkoutUrl: "/checkout",
    totalQuantity: out.reduce((s, l) => s + l.quantity, 0),
    lines: out,
    cost: { subtotalAmount: money(subtotal), totalAmount: money(subtotal) },
  };
}

/* ───────────── Actions ───────────── */

export async function getCartAction(): Promise<Cart | null> {
  if (isDemoMode) return demoCart(await readDemo());
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id) return null;
  try {
    return await sfGetCart(id);
  } catch {
    return null;
  }
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<Cart> {
  const qty = clampQty(quantity) || 1;
  if (isDemoMode) {
    if (!demoProducts.some((p) => p.variants.some((v) => v.id === variantId && v.availableForSale))) {
      throw new Error("This item is unavailable.");
    }
    const lines = await readDemo();
    const existing = lines.find((l) => l.v === variantId);
    if (existing) existing.q = Math.min(MAX_QTY, existing.q + qty);
    else lines.push({ v: variantId, q: qty });
    await writeDemo(lines);
    return demoCart(lines);
  }

  const jar = await cookies();
  const id = jar.get(CART_COOKIE)?.value;
  const line = [{ merchandiseId: variantId, quantity: qty }];
  if (id) {
    try {
      return await sfAddToCart(id, line);
    } catch {
      // Cart expired or was completed — start a new one below.
    }
  }
  const cart = await sfCreateCart(line);
  if (cart.id) jar.set(CART_COOKIE, cart.id, cookieOpts);
  return cart;
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<Cart | null> {
  const qty = clampQty(quantity);
  if (isDemoMode) {
    const lines = (await readDemo()).map((l) => (l.v === lineId ? { ...l, q: qty } : l)).filter((l) => l.q > 0);
    await writeDemo(lines);
    return demoCart(lines);
  }
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id) return null;
  return qty === 0 ? sfRemoveFromCart(id, [lineId]) : sfUpdateCart(id, [{ id: lineId, quantity: qty }]);
}

export async function removeCartLineAction(lineId: string): Promise<Cart | null> {
  return updateCartLineAction(lineId, 0);
}
