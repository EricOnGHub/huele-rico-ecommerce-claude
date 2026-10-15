import Link from "next/link";
import { defaultVariant, savingsPercent } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Price } from "./price";
import { ProductImage } from "./product-image";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const href = `/products/${product.handle}`;
  const variant = defaultVariant(product);
  const multi = product.variants.length > 1;
  const price = variant?.price || product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice || null;
  const save = savingsPercent(price, compareAt);
  const isGift = product.tags.includes("gift-set") || /gift/i.test(product.productType);

  return (
    <article className="p-card">
      <Link href={href} className="p-card-media" tabIndex={-1} aria-hidden="true">
        {!product.availableForSale ? (
          <span className="badge muted">Sold Out · Agotado</span>
        ) : save >= 25 ? (
          <span className="badge gold">Save {save}%</span>
        ) : isGift ? (
          <span className="badge">Gift Set</span>
        ) : null}
        <ProductImage
          product={product}
          image={product.featuredImage}
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
          {variant && variant.title !== "Default Title" ? ` · ${variant.title}` : ""}
        </div>
        <div className="p-card-foot">
          <Price price={price} compareAt={compareAt} from={multi} showSave={false} />
          {product.availableForSale && variant && (
            <QuickAdd variantId={variant.id} title={product.title} />
          )}
        </div>
      </div>
    </article>
  );
}
