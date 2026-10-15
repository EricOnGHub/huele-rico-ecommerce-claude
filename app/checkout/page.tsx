import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/commerce";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

// In live mode, checkout happens on Shopify's secure hosted checkout (the cart's
// checkoutUrl). This page only exists so the demo has somewhere to land.
export default function CheckoutPage() {
  if (!isDemoMode) redirect("/cart");
  return (
    <section className="section">
      <div className="container prose center">
        <p className="eyebrow">Demo Mode</p>
        <h1>Checkout preview</h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>
          This store is running on the sample catalog. Once your Shopify Storefront API credentials are added, this button takes
          shoppers straight to Shopify&rsquo;s secure checkout with Shop Pay, Apple Pay, cards and more.
        </p>
        <Link href="/cart" className="btn btn-primary">
          Back to Bag
        </Link>
      </div>
    </section>
  );
}
