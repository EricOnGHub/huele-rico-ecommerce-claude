import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart/", "/checkout/", "/search/", "/es/cart/", "/es/checkout/", "/es/search/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
