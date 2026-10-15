import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Gift, Lock, Return, Shield, Truck } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ScentProfile } from "@/components/product/scent-profile";
import { VerifyStrip } from "@/components/product/verify-strip";
import { ProductGrid } from "@/components/product-grid";
import { RecentlyViewed, RecordView } from "@/components/recently-viewed";
import { getAllProducts, getProduct, getRelated } from "@/lib/commerce";
import { truncate } from "@/lib/format";
import { fmt, getDict, lp } from "@/lib/i18n";
import { toSummary } from "@/lib/scent";
import { absoluteUrl, site } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { pageMeta } from "./meta";

export async function productParams(lang: Lang) {
  const products = await getAllProducts(lang);
  return products.map((p) => ({ handle: p.handle }));
}

export async function productMetadata(lang: Lang, handle: string): Promise<Metadata> {
  const product = await getProduct(handle, lang);
  if (!product) return { title: "404", robots: { index: false } };
  const title = product.seo.title || `${product.vendor} ${product.title}`;
  const description = truncate(product.seo.description || `${product.vendor} ${product.title} · ${product.productType}. ${product.description}`);
  const img = product.featuredImage;
  return pageMeta({
    lang,
    path: `/products/${handle}`,
    title,
    description,
    image: img ? { url: img.url, width: img.width, height: img.height, alt: img.altText } : null,
  });
}

export async function ProductPageView({ lang, handle }: { lang: Lang; handle: string }) {
  const t = getDict(lang);
  const product = await getProduct(handle, lang);
  if (!product) notFound();
  const { similar, alsoLike } = await getRelated(product, lang);
  const summary = toSummary(product);

  const crumb =
    product.gender === "men"
      ? { name: t.pdp.forHim, href: "/collections/men" }
      : product.gender === "women"
        ? { name: t.pdp.forHer, href: "/collections/women" }
        : { name: t.pdp.unisex, href: "/collections/unisex" };

  const url = absoluteUrl(lp(lang, `/products/${product.handle}`));
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;
  const similarNotes = Object.fromEntries(
    similar.map((s) => [
      s.product.handle,
      s.shared.length
        ? fmt(t.pdp.shares, { notes: s.shared.slice(0, 2).join(" & ") })
        : fmt(t.pdp.sameFamily, { family: t.families[s.product.profile.families[0]].name.toLowerCase() }),
    ]),
  );

  return (
    <>
      <RecordView product={summary} />
      <div className="container">
        <Breadcrumbs lang={lang} items={[crumb, { name: product.title, href: `/products/${product.handle}` }]} />
        <div className="pdp">
          <Gallery product={product} />
          <div className="pdp-info">
            <Link href={`${lp(lang, "/search")}?q=${encodeURIComponent(product.vendor)}`} className="p-card-vendor">
              {product.vendor}
            </Link>
            <h1>{product.title}</h1>
            <p className="pdp-type">{[product.productType, t.gender[product.gender]].filter(Boolean).join(" · ")}</p>

            <BuyBox product={product} />

            <ul className="pdp-assure">
              <li>
                <Shield />
                <span>
                  <strong>{t.pdp.assure.authentic}</strong>
                  {t.pdp.assure.authenticBody}
                </span>
              </li>
              <li>
                <Truck />
                <span>
                  <strong>{t.pdp.assure.shipping}</strong>
                  {fmt(t.pdp.assure.shippingBody, { n: site.freeShippingThreshold })}
                </span>
              </li>
              <li>
                <Return />
                <span>
                  <strong>{t.pdp.assure.returns}</strong>
                  {t.pdp.assure.returnsBody}
                </span>
              </li>
              <li>
                <Lock />
                <span>
                  <strong>{t.pdp.assure.secure}</strong>
                  {t.pdp.assure.secureBody}
                </span>
              </li>
            </ul>

            <ScentProfile profile={product.profile} lang={lang} />

            {product.notes && (
              <>
                <h2 className="subhead pdp-subhead">{t.pdp.notes}</h2>
                <div className="notes-pyramid">
                  <div>
                    <h3>{t.pdp.top}</h3>
                    <p>{product.notes.top.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3>{t.pdp.heart}</h3>
                    <p>{product.notes.heart.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3>{t.pdp.base}</h3>
                    <p>{product.notes.base.join(", ") || "—"}</p>
                  </div>
                </div>
              </>
            )}

            <div className="accordion">
              <details open>
                <summary>{t.pdp.description}</summary>
                <div className="acc-body rte" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }} />
              </details>
              <details>
                <summary>{t.pdp.howToWear}</summary>
                <div className="acc-body">
                  <p>{t.pdp.howToWearBody}</p>
                </div>
              </details>
              <details>
                <summary>{t.pdp.shippingReturns}</summary>
                <div className="acc-body">
                  <p>
                    {fmt(t.pdp.shippingBody, { n: site.freeShippingThreshold })}
                    <Link href={lp(lang, "/pages/shipping-returns")}>{t.pdp.fullPolicy}</Link>.
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  {t.pdp.gifting} <Gift width={16} height={16} style={{ display: "inline", marginLeft: 6 }} />
                </summary>
                <div className="acc-body">
                  <p>{t.pdp.giftingBody}</p>
                </div>
              </details>
            </div>

            <VerifyStrip lang={lang} />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section-tight section-alt" aria-labelledby="similar-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t.pdp.similarEyebrow}</p>
                <h2 id="similar-title">{t.pdp.similarTitle}</h2>
              </div>
            </div>
            <ProductGrid products={similar.map((s) => toSummary(s.product))} notes={similarNotes} />
          </div>
        </section>
      )}

      {alsoLike.length > 0 && (
        <section className="section-tight" aria-labelledby="related-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t.pdp.alsoEyebrow}</p>
                <h2 id="related-title">{t.pdp.alsoTitle}</h2>
              </div>
            </div>
            <ProductGrid products={alsoLike.map(toSummary)} />
          </div>
        </section>
      )}

      <RecentlyViewed exclude={product.handle} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": `${url}#product`,
          name: `${product.vendor} ${product.title}`,
          description: product.description,
          url,
          inLanguage: lang === "es" ? "es-US" : "en-US",
          sku: product.variants[0]?.sku || undefined,
          category: product.productType || "Fragrance",
          brand: { "@type": "Brand", name: product.vendor },
          image: product.images.length ? product.images.map((i) => i.url) : [absoluteUrl("/images/signature-bottle.webp")],
          audience: product.gender === "unisex" ? undefined : { "@type": "PeopleAudience", suggestedGender: product.gender === "men" ? "male" : "female" },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Scent family", value: product.profile.families.join(", ") },
            ...(product.notes ? [{ "@type": "PropertyValue", name: "Notes", value: [...product.notes.top, ...product.notes.heart, ...product.notes.base].join(", ") }] : []),
          ],
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
                handlingTime: { "@type": "QuantitativeValue", minValue: site.shipping.handlingDays[0], maxValue: site.shipping.handlingDays[1], unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: site.shipping.transitDays[0], maxValue: site.shipping.transitDays[1], unitCode: "DAY" },
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
