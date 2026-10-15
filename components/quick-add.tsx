"use client";

import { useState } from "react";
import { useCart } from "./cart/cart-context";
import { Plus } from "./icons";

/** Adds the card's default (lowest-priced available) size straight to the bag. */
export function QuickAdd({ variantId, title }: { variantId: string; title: string }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="quick-add"
      aria-label={`Add ${title} to bag`}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await addItem(variantId, 1);
        setBusy(false);
      }}
    >
      <Plus />
    </button>
  );
}
