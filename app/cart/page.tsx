import type { Metadata } from "next";
import { CartPageClient } from "./cart-page-client";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <section className="section-tight">
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>Your Bag · Tu Bolsa</h1>
        <CartPageClient />
      </div>
    </section>
  );
}
