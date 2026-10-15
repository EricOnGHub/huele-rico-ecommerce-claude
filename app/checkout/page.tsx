import type { Metadata } from "next";
import Link from "next/link";
import { isDemoMode } from "@/lib/config";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

// In live mode, checkout happens on Shopify's secure hosted checkout (the cart's
// checkoutUrl), so shoppers never land here. This page exists for the demo.
export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="container prose center">
        <p className="eyebrow">{isDemoMode ? "Demo Mode" : "Checkout"}</p>
        <h1>{isDemoMode ? "Checkout preview" : "Ready to check out?"}</h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>
          {isDemoMode
            ? "This store is running on the sample catalog. Once your Shopify Storefront API credentials are added, this button takes shoppers straight to Shopify\u2019s secure checkout with Shop Pay, Apple Pay, cards and more."
            : "Open your bag and tap Secure Checkout to pay safely with Shopify."}
        </p>
        <Link href="/cart/" className="btn btn-primary">
          Back to Bag
        </Link>
      </div>
    </section>
  );
}
