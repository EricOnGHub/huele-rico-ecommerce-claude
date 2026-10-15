"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { BottleArt } from "../bottle-art";

export function Gallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="pdp-gallery">
      <div className="gallery-main">
        {current ? (
          <Image
            src={current.url}
            alt={current.altText}
            width={current.width || 1000}
            height={current.height || 1000}
            sizes="(max-width: 860px) 100vw, 640px"
            priority
          />
        ) : (
          <BottleArt vendor={product.vendor} title={product.title} {...product.demoArt} />
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Product images">
          {images.map((img, i) => (
            <button key={img.url} type="button" aria-current={i === index} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)}>
              <Image src={img.url} alt="" width={144} height={144} sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
