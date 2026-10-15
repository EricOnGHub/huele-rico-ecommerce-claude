"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { addToCart, getCart, updateCartLine } from "@/lib/cart";
import type { Cart } from "@/lib/types";

type CartError = "add" | "update" | null;

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  pending: boolean;
  error: CartError;
  open: () => void;
  close: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<boolean>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<CartError>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getCart().then(setCart).catch(() => setCart(null));
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setError(null);
    try {
      const next = await addToCart(variantId, quantity);
      startTransition(() => setCart(next));
      setOpen(true);
      return true;
    } catch {
      setError("add");
      setOpen(true);
      return false;
    }
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    setError(null);
    try {
      const next = await updateCartLine(lineId, quantity);
      startTransition(() => setCart(next));
    } catch {
      setError("update");
    }
  }, []);

  const value = useMemo(
    () => ({ cart, isOpen, pending, error, open: () => setOpen(true), close: () => setOpen(false), addItem, updateItem }),
    [cart, isOpen, pending, error, addItem, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
