import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search-view";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Search",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  // The whole catalog ships with this page so search runs instantly in the browser.
  const products = (await getProducts({ first: 250 })).map((p) => ({ ...p, descriptionHtml: "" }));
  return (
    <Suspense>
      <SearchView products={products} />
    </Suspense>
  );
}
