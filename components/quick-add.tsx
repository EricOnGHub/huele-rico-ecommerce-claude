"use client";

import { useState } from "react";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { useCart } from "./cart/cart-context";
import { Plus } from "./icons";

/** Adds the card's default (lowest-priced available) size straight to the bag. */
export function QuickAdd({ variantId, title }: { variantId: string; title: string }) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="quick-add"
      aria-label={fmt(t.card.addToBag, { title })}
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
