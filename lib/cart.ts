// Shopping bag, running in the browser.
// • Shopify mode: the Shopify cart ID is remembered in localStorage and every change
//   goes through the Storefront Cart API. "Secure Checkout" sends shoppers to
//   Shopify's hosted checkout (cart.checkoutUrl).
// • Demo mode: line items are kept in localStorage so the flow can be tested.

import { asset, isDemoMode } from "./config";
import { demoProducts } from "./demo-data";
import { sfAddToCart, sfCreateCart, sfGetCart, sfRemoveFromCart, sfUpdateCart } from "./shopify/client";
import type { Cart, CartLine } from "./types";

const CART_KEY = "hr_cart_id";
const DEMO_KEY = "hr_demo_cart";
const MAX_QTY = 10;
const clampQty = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(Number(n) || 0)));

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode: the bag lasts for this page view only */
  }
}

/* ───────────── Demo cart ───────────── */

type DemoLine = { v: string; q: number };

function readDemo(): DemoLine[] {
  try {
    const parsed = JSON.parse(read(DEMO_KEY) || "[]") as DemoLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => typeof l.v === "string" && l.q > 0) : [];
  } catch {
    return [];
  }
}

function demoCart(lines: DemoLine[]): Cart {
  write(DEMO_KEY, JSON.stringify(lines));
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
    checkoutUrl: asset("/checkout/"),
    totalQuantity: out.reduce((s, l) => s + l.quantity, 0),
    lines: out,
    cost: { subtotalAmount: money(subtotal), totalAmount: money(subtotal) },
  };
}

/* ───────────── Public API ───────────── */

export async function getCart(): Promise<Cart | null> {
  if (isDemoMode) return demoCart(readDemo());
  const id = read(CART_KEY);
  if (!id) return null;
  try {
    const cart = await sfGetCart(id);
    if (!cart) write(CART_KEY, null); // expired or already checked out
    return cart;
  } catch {
    return null;
  }
}

export async function addToCart(variantId: string, quantity = 1): Promise<Cart> {
  const qty = clampQty(quantity) || 1;
  if (isDemoMode) {
    if (!demoProducts.some((p) => p.variants.some((v) => v.id === variantId && v.availableForSale))) {
      throw new Error("This item is unavailable.");
    }
    const lines = readDemo();
    const existing = lines.find((l) => l.v === variantId);
    if (existing) existing.q = Math.min(MAX_QTY, existing.q + qty);
    else lines.push({ v: variantId, q: qty });
    return demoCart(lines);
  }

  const id = read(CART_KEY);
  const line = [{ merchandiseId: variantId, quantity: qty }];
  if (id) {
    try {
      return await sfAddToCart(id, line);
    } catch {
      // Cart expired or was completed — start a new one below.
    }
  }
  const cart = await sfCreateCart(line);
  if (cart.id) write(CART_KEY, cart.id);
  return cart;
}

export async function updateCartLine(lineId: string, quantity: number): Promise<Cart | null> {
  const qty = clampQty(quantity);
  if (isDemoMode) {
    return demoCart(readDemo().map((l) => (l.v === lineId ? { ...l, q: qty } : l)).filter((l) => l.q > 0));
  }
  const id = read(CART_KEY);
  if (!id) return null;
  return qty === 0 ? sfRemoveFromCart(id, [lineId]) : sfUpdateCart(id, [{ id: lineId, quantity: qty }]);
}
