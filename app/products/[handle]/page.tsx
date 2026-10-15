import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Gift, Lock, Return, Shield, Truck } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ProductGrid } from "@/components/product-grid";
import { getProduct, getProducts, getRecommendations, isDemoMode } from "@/lib/commerce";
import { genderLabel, truncate } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  // Pre-render the catalog at build time; new Shopify products render on first visit.
  try {
    const products = await getProducts({ first: isDemoMode ? 100 : 50 });
    return products.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const title = product.seo.title || `${product.vendor} ${product.title}`;
  const description = truncate(
    product.seo.description ||
      `Shop authentic ${product.vendor} ${product.title} ${product.productType ? `(${product.productType})` : ""} below retail. ${product.description}`,
  );
  const img = product.featuredImage;
  return {
    title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      title: `${title} | ${site.name}`,
      description,
      url: `/products/${handle}`,
      images: img ? [{ url: img.url, width: img.width, height: img.height, alt: img.altText }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const related = await getRecommendations(product);

  const collectionCrumb =
    product.gender === "men"
      ? { name: "For Him", href: "/collections/men" }
      : product.gender === "women"
        ? { name: "For Her", href: "/collections/women" }
        : { name: "Unisex", href: "/collections/unisex" };

  const url = absoluteUrl(`/products/${product.handle}`);
  const priceValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 10);

  return (
    <>
      <div className="container">
        <Breadcrumbs items={[collectionCrumb, { name: product.title, href: `/products/${product.handle}` }]} />
        <div className="pdp">
          <Gallery product={product} />
          <div className="pdp-info">
            <Link href={`/search?q=${encodeURIComponent(product.vendor)}`} className="p-card-vendor">
              {product.vendor}
            </Link>
            <h1>{product.title}</h1>
            <p className="pdp-type">
              {[product.productType, genderLabel(product.gender)].filter(Boolean).join(" · ")}
            </p>

            <BuyBox product={product} />

            <ul className="pdp-assure">
              <li>
                <Shield /> <span><strong>100% authentic</strong> — original, factory-sealed. 100% original o te devolvemos tu dinero.</span>
              </li>
              <li>
                <Truck /> <span><strong>Free fast U.S. shipping</strong> on orders ${site.freeShippingThreshold}+.</span>
              </li>
              <li>
                <Return /> <span><strong>30-day returns</strong> on unopened items.</span>
              </li>
              <li>
                <Lock /> <span><strong>Secure checkout</strong> powered by Shopify.</span>
              </li>
            </ul>

            {product.notes && (
              <>
                <h2 className="subhead" style={{ fontFamily: "var(--font-sub)", color: "var(--royal-plum)" }}>
                  Fragrance Notes · Notas
                </h2>
                <div className="notes-pyramid">
                  <div>
                    <h3>Top</h3>
                    <p>{product.notes.top.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3>Heart</h3>
                    <p>{product.notes.heart.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3>Base</h3>
                    <p>{product.notes.base.join(", ") || "—"}</p>
                  </div>
                </div>
              </>
            )}

            <div className="accordion">
              <details open>
                <summary>Description</summary>
                <div className="acc-body rte" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }} />
              </details>
              <details>
                <summary>How to Wear · Cómo Usarlo</summary>
                <div className="acc-body">
                  <p>
                    Spray 2–4 times on pulse points — neck, wrists and behind the ears — from about 6 inches away. Don&rsquo;t rub your
                    wrists together; let the fragrance settle and evolve naturally. For longer wear, apply after a shower on
                    moisturized skin.
                  </p>
                </div>
              </details>
              <details>
                <summary>Shipping &amp; Returns</summary>
                <div className="acc-body">
                  <p>
                    Orders ship within 1–2 business days. Free standard U.S. shipping on orders ${site.freeShippingThreshold}+. Unopened,
                    unused items can be returned within 30 days. <Link href="/pages/shipping-returns">Full policy</Link>.
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  Gifting <Gift width={16} height={16} style={{ display: "inline", marginLeft: 6 }} />
                </summary>
                <div className="acc-body">
                  <p>Every order arrives in our signature plum box with monogram tissue and a bilingual thank-you card — ready to gift.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section-alt" aria-labelledby="related-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">También te puede gustar</p>
                <h2 id="related-title">You may also like</h2>
              </div>
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": `${url}#product`,
          name: `${product.vendor} ${product.title}`,
          description: product.description,
          url,
          sku: product.variants[0]?.sku || undefined,
          category: product.productType || "Fragrance",
          brand: { "@type": "Brand", name: product.vendor },
          image: product.images.length ? product.images.map((i) => i.url) : [absoluteUrl("/images/signature-bottle.webp")],
          audience: product.gender === "unisex" ? undefined : { "@type": "PeopleAudience", suggestedGender: product.gender === "men" ? "male" : "female" },
          offers: product.variants.map((v) => ({
            "@type": "Offer",
            url,
            name: v.title,
            sku: v.sku || undefined,
            price: v.price.amount,
            priceCurrency: v.price.currencyCode,
            priceValidUntil,
            itemCondition: "https://schema.org/NewCondition",
            availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@id": absoluteUrl("/#organization") },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
              },
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "US",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 30,
              returnMethod: "https://schema.org/ReturnByMail",
            },
          })),
        }}
      />
    </>
  );
}
