// Small page views: search, bag, checkout, quiz and 404.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Quiz } from "@/components/quiz";
import { SearchView } from "@/components/search-view";
import { getAllSummaries } from "@/lib/commerce";
import { isDemoMode } from "@/lib/config";
import { getDict, lp } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { CartPageClient } from "./cart-page-client";
import { pageMeta } from "./meta";

export const searchMetadata = (lang: Lang): Metadata => pageMeta({ lang, path: "/search", title: getDict(lang).search.title, noindex: true });

export async function SearchPageView({ lang }: { lang: Lang }) {
  // The catalog ships with this page so search runs instantly in the browser.
  const products = await getAllSummaries(lang);
  return (
    <Suspense>
      <SearchView products={products} />
    </Suspense>
  );
}

export const cartMetadata = (lang: Lang): Metadata => pageMeta({ lang, path: "/cart", title: getDict(lang).cart.title, noindex: true });

export function CartPageView({ lang }: { lang: Lang }) {
  return (
    <section className="section-tight">
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>{getDict(lang).cart.pageTitle}</h1>
        <CartPageClient />
      </div>
    </section>
  );
}

export const checkoutMetadata = (lang: Lang): Metadata => ({ ...pageMeta({ lang, path: "/checkout", title: getDict(lang).checkout.eyebrow }), robots: { index: false, follow: false } });

// In live mode, checkout happens on Shopify's hosted checkout (the cart's checkoutUrl),
// so shoppers never land here. This page exists for the demo.
export function CheckoutPageView({ lang }: { lang: Lang }) {
  const t = getDict(lang).checkout;
  return (
    <section className="section">
      <div className="container prose center">
        <p className="eyebrow">{isDemoMode ? t.eyebrowDemo : t.eyebrow}</p>
        <h1>{isDemoMode ? t.titleDemo : t.title}</h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>
          {isDemoMode ? t.bodyDemo : t.body}
        </p>
        <Link href={lp(lang, "/cart")} className="btn btn-primary">
          {t.back}
        </Link>
      </div>
    </section>
  );
}

export const quizMetadata = (lang: Lang): Metadata => {
  const q = getDict(lang).quiz;
  return pageMeta({ lang, path: "/quiz", title: q.metaTitle, description: q.metaDescription });
};

export async function QuizPageView({ lang }: { lang: Lang }) {
  const q = getDict(lang).quiz;
  const products = await getAllSummaries(lang);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{q.eyebrow}</p>
          <h1>{q.title}</h1>
        </div>
      </section>
      <section className="section-tight">
        <div className="container quiz-wrap">
          <Quiz products={products} />
        </div>
      </section>
    </>
  );
}

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = getDict(lang).notFound;
  return (
    <section className="section">
      <div className="container center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="lead" style={{ margin: "0 auto 28px" }}>
          {t.body}
        </p>
        <div className="stack-sm" style={{ justifyContent: "center" }}>
          <Link href={lp(lang, "/")} className="btn btn-primary">
            {t.home}
          </Link>
          <Link href={lp(lang, "/quiz")} className="btn btn-gold">
            {getDict(lang).cart.takeQuiz}
          </Link>
        </div>
      </div>
    </section>
  );
}
