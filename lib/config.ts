// Settings shared by build-time (server) code and the browser.
// Everything here is public: the Shopify Storefront API token is designed to be
// used in the browser (it can read products and manage carts, nothing else).

export const shopifyDomain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
export const shopifyToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
export const shopifyApiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2026-07";
export const shopifyEndpoint = `https://${shopifyDomain}/api/${shopifyApiVersion}/graphql.json`;

export const isShopifyConfigured = Boolean(shopifyDomain && shopifyToken && !shopifyDomain.startsWith("your-store"));
export const isDemoMode = !isShopifyConfigured;

/** Sub-path the site is served from, e.g. "/huele-rico-ecommerce-claude" on GitHub Pages. */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Prefix a public file path (images, plain links) with the base path. */
export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

export const newsletterWebhook = process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL || "";
export const contactWebhook = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL || "";
