import Image from "next/image";
import type { Image as ImageT, Product } from "@/lib/types";
import { BottleArt } from "./bottle-art";

type Props = {
  product: Pick<Product, "title" | "vendor" | "demoArt">;
  image?: ImageT | null;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Shopify product photo when available, otherwise the illustrated brand bottle. */
export function ProductImage({ product, image, sizes, priority, className }: Props) {
  if (image?.url) {
    return (
      <Image
        src={image.url}
        alt={image.altText || `${product.vendor} ${product.title}`}
        width={image.width || 800}
        height={image.height || 1000}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }
  return <BottleArt vendor={product.vendor} title={product.title} {...product.demoArt} className={className} />;
}
