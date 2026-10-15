# Huele Rico! Fragrances — Storefront

**Huele Rico, Paga Menos.** · *Smell Rich. Pay Less.*

A fast, mobile-first, SEO-optimized e-commerce site for selling 100% authentic designer perfumes and colognes for men and women, below retail. It's built with **Next.js** and connects to **Shopify** as a headless storefront. Shopify holds your products, inventory, orders, payments and checkout, and this site is the branded shop window your customers browse.

The site is written in English with Spanish mixed in (*Para Él / Para Ella, Descubre tu aroma, 100% original o te devolvemos tu dinero*) and follows the brand board in [`/brand`](./brand): Royal Plum, Champagne Gold and Soft Ivory, with Playfair Display, Montserrat and Inter type.

---

## Contents

1. [What's included](#whats-included)
2. [Quick start (preview locally)](#quick-start-preview-locally)
3. [Connect your Shopify store](#connect-your-shopify-store)
4. [Set up your products in Shopify](#set-up-your-products-in-shopify)
5. [Deploy (go live)](#deploy-go-live)
6. [SEO](#seo)
7. [Mobile](#mobile)
8. [Customizing](#customizing)
9. [Project structure](#project-structure)
10. [Before you launch: checklist](#before-you-launch-checklist)

---

## What's included

| Area | Details |
| --- | --- |
| **Home** | Hero ("Huele Rico, Paga Menos!"), trust bar, shop by category (Para Él / Para Ella / Regalos), Best Sellers, rooftop lifestyle banner, Brand Essence, authenticity promise, New Arrivals, gifting, newsletter + hashtags |
| **Collections** | `/collections/all`, `men`, `women`, `unisex`, `best-sellers` and `gift-sets`, plus any collection you create in Shopify. Sort (best selling, price, newest, A–Z) and filter by brand |
| **Product pages** | Image gallery, size selector, quantity, sale price vs. retail with "Save X%", fragrance notes (top/heart/base), authenticity and shipping assurances, how-to-wear, related products, and a sticky "Add to Bag" bar on mobile |
| **Cart** | Slide-out bag drawer and full `/cart` page, free-shipping progress meter, quantity changes, then **Shopify's secure checkout** (Shop Pay, Apple Pay, Google Pay, cards) |
| **Search** | `/search?q=`, searching across brand, name, type and tags |
| **Content pages** | Our Story, Authenticity Promise, Shipping & Returns, FAQ, Fragrance Care, Contact, Privacy Policy, Terms of Service |
| **SEO** | Per-page titles and descriptions, canonical URLs, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, and structured data (Product with offers, shipping and return policy; Breadcrumbs; FAQ; Organization; WebSite search box) |
| **Demo mode** | Runs with a sample catalog until you add Shopify credentials, so you can preview everything now |

---

## Quick start (preview locally)

You'll need [Node.js](https://nodejs.org) **20.9 or newer**.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The site starts in **demo mode**: you'll see a dark banner at the top, and the catalog is sample data with illustrated bottles. Every part of the site works, including the bag. Only checkout is a preview page.

Other commands:

```bash
npm run build      # production build
npm start          # run the production build
npm run typecheck  # TypeScript check
```

---

## Connect your Shopify store

1. **Create your Shopify store** at [shopify.com](https://www.shopify.com). Any plan works.
2. **Install the Headless channel.** In Shopify admin, go to **Sales channels → Add → "Headless"** (by Shopify), then **Create storefront**.
   - Alternative: **Settings → Apps and sales channels → Develop apps → Create an app**, then enable **Storefront API** access.
3. **Turn on these Storefront API permissions:**
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts`
   - `unauthenticated_read_content` (optional)
4. **Copy the public Storefront API access token.**
5. **Create your environment file:**

   ```bash
   cp .env.example .env.local
   ```

   Then fill in:

   ```env
   NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
   SHOPIFY_API_VERSION=2026-07
   SHOPIFY_REVALIDATION_SECRET=any-long-random-string
   ```

   `SHOPIFY_STORE_DOMAIN` must be the **`.myshopify.com`** domain, not your custom domain.

6. **Restart** with `npm run dev`. The demo banner disappears and your real products show up.

> Environment variables are read when the site **builds**. After changing them on your host, **redeploy**.

### Instant product updates (recommended)

Product data is cached for 5 minutes, which keeps pages fast. To refresh the site immediately when you edit a product, go to Shopify admin → **Settings → Notifications → Webhooks** and create webhooks (format: JSON) for:

- Product creation, Product update, Product deletion
- Collection update
- Inventory level update

Point each one at:

```
https://www.yourdomain.com/api/revalidate?secret=YOUR_SHOPIFY_REVALIDATION_SECRET
```

### Checkout domain

When customers click **Secure Checkout**, they go to Shopify's hosted checkout. To keep it on your brand, add a subdomain such as `checkout.yourdomain.com` under Shopify → **Settings → Domains**, and style the checkout under **Settings → Checkout** (logo, Royal Plum `#4C234E`, Champagne Gold `#C89C52`).

---

## Set up your products in Shopify

The storefront maps Shopify fields like this:

| Shopify field | Shown on site as | Example |
| --- | --- | --- |
| **Title** | Product name | `Sauvage Eau de Toilette` |
| **Vendor** | Designer/brand (above the name, brand filter, search) | `Dior` |
| **Product type** | Concentration | `Eau de Parfum`, `Eau de Toilette`, `Parfum`, `Gift Set` |
| **Variant option "Size"** | Size buttons | `1.7 oz / 50 ml`, `3.4 oz / 100 ml` |
| **Price** | Your price | `79.00` |
| **Compare-at price** | Retail price (crossed out, plus "Save X%") | `112.00` |
| **Images** | Gallery. The first image is used on product cards | Bottle photo on an ivory background |
| **SEO title / description** | Google title and snippet (optional, auto-generated if blank) | |

### Tags (important)

Tags decide which category a product appears in:

| Tag | Effect |
| --- | --- |
| `men` | Appears in **For Him / Para Él** |
| `women` | Appears in **For Her / Para Ella** |
| `unisex` | Appears in **Unisex**, and in both For Him and For Her |
| `gift-set` | Appears in **Gift Sets** (product type `Gift Set` also works) |

**Best Sellers** and **Shop All** fill automatically from Shopify's sales data.

If you'd rather curate a collection by hand, create a Shopify collection with the **same handle** (`men`, `women`, `unisex`, `best-sellers`, `gift-sets`). The site will use that collection's products, title and description instead of the tag rule. Any other collection you create appears at `/collections/<handle>` and in the sitemap.

### Fragrance notes (optional)

To show the Top / Heart / Base notes boxes, go to **Settings → Custom data → Products** and add these metafield definitions. Set the type to **List of single line text** (or single line text, comma-separated), and **check "Storefront API access"**:

| Name | Namespace and key |
| --- | --- |
| Top notes | `custom.top_notes` |
| Heart notes | `custom.heart_notes` |
| Base notes | `custom.base_notes` |
| Gender (optional; overrides tags) | `custom.gender` (`men`, `women` or `unisex`) |

### Product photos

For the look in the brand board ("Clean Bottle Closeups"), use square or 4:5 photos with an ivory or soft background. Products without images automatically get a branded bottle illustration.

---

## Deploy (go live)

The easiest host is **[Vercel](https://vercel.com)** (made by the creators of Next.js; the free tier works).

1. Push this repository to GitHub (already done if you're reading this there).
2. In Vercel: **Add New → Project → import this repo**. Framework: Next.js (auto-detected).
3. Add the environment variables from `.env.local` under **Settings → Environment Variables**.
4. Click **Deploy**.
5. Add your custom domain under **Settings → Domains** (e.g. `www.huelerico.com`), and make sure `NEXT_PUBLIC_SITE_URL` matches it.

Netlify, Cloudflare and any Node.js host also work (`npm run build && npm start`).

---

## SEO

Already built in:

- **Unique titles and meta descriptions** for every page, using Shopify's SEO fields when set.
- **Canonical URLs.** Sorted or filtered collection URLs are marked `noindex` so they don't compete with the main page.
- **Structured data (JSON-LD)** for Google rich results:
  - `Product` with price, availability, brand, shipping details and return policy, so search results can show price and stock
  - `BreadcrumbList`, `FAQPage`, `CollectionPage` / `ItemList`
  - `OnlineStore` (organization) and `WebSite` with a sitelinks search box
- **`/sitemap.xml`**, generated automatically from your products, collections and pages, and **`/robots.txt`**, which blocks cart, checkout, search and API routes.
- **Open Graph and Twitter cards**, so links shared on Instagram, WhatsApp, iMessage and Facebook show a rich preview (product photo or the rooftop lifestyle image).
- **Performance:** server-rendered and cached pages, self-hosted fonts, and responsive AVIF/WebP images through `next/image`.
- **Semantic, accessible HTML:** one H1 per page, landmarks, alt text, keyboard support and visible focus states.
- **Bilingual keywords:** *perfumes originales, lociones originales, para él, para ella*.

After launch:

1. Add the site to **[Google Search Console](https://search.google.com/search-console)** and submit `https://www.yourdomain.com/sitemap.xml`.
2. Connect the Shopify **Google & YouTube** channel for free Shopping listings.
3. Write a unique description for each product (don't copy the brand's text) and fill in the SEO fields.
4. Use descriptive image alt text in Shopify (e.g. "Dior Sauvage Eau de Toilette 3.4 oz bottle").

---

## Mobile

The layout is mobile-first and tested at phone widths (390 px):

- Slide-out menu, search panel and bag drawer
- Two-column product grid, swipeable category chips and full-width buttons
- Sticky **Add to Bag** bar on product pages
- 16 px inputs (no iOS zoom), 44 px or larger tap targets, and support for safe areas (notches)
- Respects "reduce motion" settings

---

## Customizing

| What | Where |
| --- | --- |
| Brand name, tagline, email, free-shipping threshold, navigation | [`lib/site.ts`](./lib/site.ts) |
| Colors, fonts, spacing (design tokens) | Top of [`app/globals.css`](./app/globals.css) |
| Homepage sections and copy | [`app/page.tsx`](./app/page.tsx) |
| About, Authenticity, Shipping, FAQ, Privacy and Terms copy | [`lib/pages.tsx`](./lib/pages.tsx) |
| Announcement bar text | [`components/header.tsx`](./components/header.tsx) |
| Images | [`public/images`](./public/images): replace the files, keeping the same names |
| Social links | `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_FACEBOOK_URL` |

**Newsletter and contact form.** These send submissions as JSON to any webhook you choose (Klaviyo, Shopify Flow, Zapier, Make, etc.):

- `NEWSLETTER_WEBHOOK_URL` receives `{ email, source, tags }`. The sign-up form stays hidden on the live site until this is set, so no sign-ups are lost.
- `CONTACT_WEBHOOK_URL` receives `{ name, email, order, message }`. Without it, the contact page shows an "Email Us" button instead.

---

## Project structure

```
app/
  page.tsx                    Home
  collections/[handle]/       Collection pages (sort + brand filter)
  products/[handle]/          Product pages (+ Product JSON-LD)
  search/                     Search results
  cart/                       Full bag page
  checkout/                   Demo-mode checkout preview (live mode uses Shopify checkout)
  pages/[slug]/               About, Authenticity, FAQ, Contact, policies…
  api/revalidate/             Shopify webhook → instant cache refresh
  sitemap.ts · robots.ts · manifest.ts · icon.svg
components/                   Header, footer, product card, cart drawer, buy box, etc.
lib/
  shopify/                    Storefront API client + GraphQL queries
  commerce.ts                 Catalog API (Shopify or demo data)
  cart.ts                     Cart server actions (Shopify Cart API)
  demo-data.ts                Sample catalog for demo mode
  pages.tsx                   Content page copy
  site.ts                     Brand config
public/images/                Brand photography (cropped from the brand board)
brand/                        Original brand board (identity, palette, packaging, voice)
```

---

## Before you launch: checklist

- [ ] Shopify credentials added and the demo banner is gone
- [ ] Products tagged `men` / `women` / `unisex` / `gift-set`, with compare-at (retail) prices set
- [ ] Product photos uploaded, and alt text and SEO fields filled in
- [ ] `NEXT_PUBLIC_SITE_URL` set to your real domain
- [ ] Review the copy in `lib/pages.tsx` (shipping times, shipping regions, return window, sourcing claims) so it matches how you actually operate, and have the **Privacy Policy and Terms** reviewed (or replace them with Shopify's policy generator text)
- [ ] Free-shipping threshold in `lib/site.ts` matches your Shopify shipping rates
- [ ] Shopify checkout branding and payment methods (Shop Pay, Apple Pay, PayPal) set up
- [ ] Webhooks pointed at `/api/revalidate`
- [ ] Newsletter/contact webhooks set (optional)
- [ ] Sitemap submitted to Google Search Console

> **About the demo catalog:** the sample products in `lib/demo-data.ts` use well-known designer names with illustrative prices to preview the shopping experience. They're replaced by your real Shopify catalog as soon as you connect. Brand names and trademarks belong to their respective owners.

---

*Huele bien. Vive mejor.* ✦ Authentic fragrances. Below retail. Always.
