"use client";

import Link from "next/link";
import { savingsPercent } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import type { ProductSummary } from "@/lib/types";
import { Price } from "./price";
import { ProductImage } from "./product-image";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, priority, note }: { product: ProductSummary; priority?: boolean; note?: string }) {
  const { t, lp } = useLang();
  const href = lp(`/products/${product.handle}`);
  const save = savingsPercent(product.price, product.compareAt);
  const isGift = product.tags.includes("gift-set") || /gift/i.test(product.productType);

  return (
    <article className="p-card">
      <Link href={href} className="p-card-media" tabIndex={-1} aria-hidden="true">
        {!product.available ? (
          <span className="badge muted">{t.card.soldOut}</span>
        ) : save >= 25 ? (
          <span className="badge gold">{fmt(t.card.save, { n: save })}</span>
        ) : isGift ? (
          <span className="badge">{t.card.giftSet}</span>
        ) : null}
        <ProductImage
          product={product}
          image={product.image}
          sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 300px"
          priority={priority}
        />
      </Link>
      <div className="p-card-body">
        <div className="p-card-vendor">{product.vendor}</div>
        <h3 className="p-card-title">
          <Link href={href}>{product.title}</Link>
        </h3>
        <div className="p-card-meta">
          {product.productType}
          {product.variantTitle ? ` · ${product.variantTitle}` : ""}
        </div>
        {note && <div className="p-card-note">{note}</div>}
        <div className="p-card-foot">
          <Price price={product.price} compareAt={product.compareAt} from={product.multiSize} showSave={false} />
          {product.available && product.variantId && <QuickAdd variantId={product.variantId} title={product.title} />}
        </div>
      </div>
    </article>
  );
}
