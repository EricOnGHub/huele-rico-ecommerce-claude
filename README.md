# Huele Rico! Fragrances — Storefront

**Huele Rico, Paga Menos.** · *Smell Rich. Pay Less.*

A fast, mobile-first, SEO-optimized e-commerce site for selling 100% authentic designer perfumes and colognes for men and women, below retail. It's built with **Next.js** and connects to **Shopify** as a headless storefront. Shopify holds your products, inventory, orders, payments and checkout, and this site is the branded shop window your customers browse.

The site builds to plain static files, so it's hosted free on **GitHub Pages**. A GitHub Action rebuilds and publishes it on every change to `main` and every 6 hours, so product, price and stock updates from Shopify show up automatically.

The site is fully bilingual: English at the root and a complete Spanish version under `/es/`, with an EN | ES switch in the header, and English pages keep some Spanish flair (*Para Él / Para Ella, Descubre tu aroma*). It follows the brand board in [`/brand`](./brand): Royal Plum, Champagne Gold and Soft Ivory, with Playfair Display, Montserrat and Inter type.

---

## Contents

1. [What's included](#whats-included)
2. [Quick start (preview locally)](#quick-start-preview-locally)
3. [Go live on GitHub Pages](#go-live-on-github-pages)
4. [Connect your Shopify store](#connect-your-shopify-store)
5. [Set up your products in Shopify](#set-up-your-products-in-shopify)
6. [SEO](#seo)
7. [Mobile](#mobile)
8. [Customizing](#customizing)
9. [Project structure](#project-structure)
10. [Before you launch: checklist](#before-you-launch-checklist)

---

## What's included

| Area | Details |
| --- | --- |
| **Home** | Hero ("Huele Rico, Paga Menos!"), trust bar, shop by category (Para Él / Para Ella / Regalos), Best Sellers, scent quiz + shop by scent family, rooftop lifestyle banner, Brand Essence, authenticity promise, New Arrivals, recently viewed, gifting, newsletter + hashtags |
| **Collections** | `/collections/all`, `men`, `women`, `unisex`, `best-sellers` and `gift-sets`, plus any collection you create in Shopify. Sorting and a filter panel (scent family, for him/her, concentration, bottle size, price, brand, in stock) that opens as a bottom sheet on phones. Filtered views have shareable links |
| **Product pages** | Image gallery, size selector, quantity, sale price vs. retail with "Save X%", **scent profile** (family, longevity, projection, best seasons, day/night), fragrance notes, **delivery date estimate**, **"Notify me" for sold-out sizes**, "How we verify every bottle", **"Smells similar"** picks with the notes they share, "You may also like", recently viewed, and a sticky "Add to Bag" bar on mobile |
| **Scent quiz** | `/quiz`: five quick questions (who it's for, favorite scent families, occasion, intensity, budget) → three matches with a match % and the reasons |
| **Cart** | Slide-out bag drawer and full `/cart` page, free-shipping progress meter, quantity changes, "Complete the gift" add-on suggestions, then **Shopify's secure checkout** (Shop Pay, Apple Pay, Google Pay, cards) |
| **Search** | Suggestions as you type (products + brands) that forgive typos ("savage" finds Sauvage), plus a full results page |
| **Español** | Every page in Spanish under `/es/` with its own SEO tags and hreflang links, an EN \| ES switch, Spanish policies and FAQ |
| **WhatsApp** | Optional floating chat button with a pre-filled message about the page the shopper is on |
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
npm run build      # static build into the out/ folder
npm run typecheck  # TypeScript check
```

---

## Go live on GitHub Pages

The workflow in [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) does the publishing. One-time setup:

1. **Settings → Pages → Build and deployment → Source: choose "GitHub Actions"** (not "Deploy from a branch").
2. **Settings → Secrets and variables → Actions:**

   | Type | Name | Value |
   | --- | --- | --- |
   | Variable | `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
   | Secret | `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Public Storefront API token (see below) |
   | Variable (optional) | `SITE_URL` | Your custom domain, e.g. `https://www.huelerico.com` |
   | Variable (optional) | `SHOPIFY_API_VERSION` | e.g. `2026-07` |
   | Variable (optional) | `CONTACT_EMAIL`, `INSTAGRAM_URL`, `TIKTOK_URL`, `FACEBOOK_URL` | Your details |
   | Variable (optional) | `NEWSLETTER_WEBHOOK_URL`, `CONTACT_WEBHOOK_URL` | See [Customizing](#customizing) |
   | Variable (optional) | `WHATSAPP_NUMBER` | Shows the WhatsApp chat button, e.g. `15551234567` |

   Without the Shopify values, the site publishes in **demo mode** with the sample catalog.
3. **Actions → Deploy to GitHub Pages → Run workflow** (or push to `main`).

The site appears at `https://<your-username>.github.io/huele-rico-ecommerce-claude/`.

**Custom domain:** in **Settings → Pages → Custom domain** enter `www.yourdomain.com`, add the DNS records GitHub shows you, tick **Enforce HTTPS**, and set the `SITE_URL` variable to `https://www.yourdomain.com` so links and SEO tags use it.

**Updates:** product, price and stock changes in Shopify appear after the next build, which runs every 6 hours. To publish a change right away, open **Actions → Deploy to GitHub Pages → Run workflow**.

**Branches:** do day-to-day work on `dev` (and `qa` for testing if you like), then merge into `main` to publish.

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
5. **Add the values to GitHub** as described in [Go live on GitHub Pages](#go-live-on-github-pages), then run the workflow.
6. **To test locally**, copy `.env.example` to `.env.local`, fill in `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and run `npm run dev`. The demo banner disappears and your real products show up.

The store domain must be the **`.myshopify.com`** domain, not your custom domain.

> **Is it safe to publish the token?** Yes. The *Storefront* token is designed to live in the browser: it can only read your public catalog and create carts. Never use an **Admin API** token here.

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

### Fragrance notes and scent profile (recommended)

Notes power the notes boxes, the scent profile, "Smells similar", filters by scent family and the quiz. Go to **Settings → Custom data → Products** and add these metafield definitions, each with **"Storefront API access"** checked:

| Name | Namespace and key | Type |
| --- | --- | --- |
| Top notes | `custom.top_notes` | List of single line text |
| Heart notes | `custom.heart_notes` | List of single line text |
| Base notes | `custom.base_notes` | List of single line text |
| Gender (optional; overrides tags) | `custom.gender` | Single line text: `men`, `women` or `unisex` |
| Scent family (optional) | `custom.scent_family` | List of single line text: `fresh`, `floral`, `woody`, `sweet`, `spicy` |
| Longevity (optional) | `custom.longevity` | Integer 1–5 (1 ≈ 2–3 h, 5 ≈ 10 h+) |
| Projection (optional) | `custom.sillage` | Integer 1–5 (1 = skin scent, 5 = fills the room) |
| Seasons (optional) | `custom.season` | List: `spring`, `summer`, `fall`, `winter` |
| Time of day (optional) | `custom.time_of_day` | List: `day`, `night` |

You only *need* the three notes fields: the site works out scent family, longevity, projection, seasons and day/night from the notes and the concentration. Fill in the optional fields whenever you want to set them yourself.

### Spanish product text

Spanish pages use Shopify's translations automatically. Install the free **Translate & Adapt** app, add **Spanish** under **Settings → Languages**, and translate product titles, descriptions and collections there. Anything not translated shows in English.

### Product photos

For the look in the brand board ("Clean Bottle Closeups"), use square or 4:5 photos with an ivory or soft background. Products without images automatically get a branded bottle illustration.

---

### Other hosts

Because the build is plain static files (`out/`), Netlify, Cloudflare Pages and Vercel work too. Set the same `NEXT_PUBLIC_…` environment variables from `.env.example`, use `npm run build` as the build command and `out` as the output folder.

---

## SEO

Already built in:

- **Unique titles and meta descriptions** for every page, using Shopify's SEO fields when set.
- **Canonical URLs** on every page.
- **Structured data (JSON-LD)** for Google rich results:
  - `Product` with price, availability, brand, shipping details and return policy, so search results can show price and stock
  - `BreadcrumbList`, `FAQPage`, `CollectionPage` / `ItemList`
  - `OnlineStore` (organization) and `WebSite` with a sitelinks search box
- **`/sitemap.xml`**, generated automatically from your products, collections and pages, and **`/robots.txt`**, which blocks cart, checkout, search and API routes.
- **Open Graph and Twitter cards**, so links shared on Instagram, WhatsApp, iMessage and Facebook show a rich preview (product photo or the rooftop lifestyle image).
- **Performance:** every page is pre-built static HTML served from GitHub's CDN, with self-hosted fonts and lightweight WebP images.
- **Semantic, accessible HTML:** one H1 per page, landmarks, alt text, keyboard support and visible focus states.
- **Bilingual SEO:** every page exists in English and Spanish with `hreflang` links (in the HTML and the sitemap), so Google shows each shopper the right language.

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
| English / Spanish interface text | [`lib/i18n/en.ts`](./lib/i18n/en.ts) and [`lib/i18n/es.ts`](./lib/i18n/es.ts) |
| Spanish info pages and FAQ | [`lib/pages-es.tsx`](./lib/pages-es.tsx) |
| Delivery estimate (handling + transit days) | `shipping` in [`lib/site.ts`](./lib/site.ts). Keep it in line with your shipping policy |
| WhatsApp chat button | `WHATSAPP_NUMBER` repository variable (digits with country code, e.g. `15551234567`) |
| Social links | `INSTAGRAM_URL`, `TIKTOK_URL`, `FACEBOOK_URL` repository variables |

**Newsletter and contact form.** These send submissions as JSON to any webhook you choose (Klaviyo, Shopify Flow, Zapier, Make, etc.):

- `NEWSLETTER_WEBHOOK_URL` receives `{ email, tags, source }`. The sign-up form stays hidden on the live site until this is set, so no sign-ups are lost. "Notify me when it's back" sign-ups go to the same URL with `tags: "back-in-stock"` plus `product` and `variant`, so you can route them to a restock list.
- `CONTACT_WEBHOOK_URL` receives `{ name, email, order, message, source }`. Without it, the contact page shows an "Email Us" button instead.

Forms post straight from the shopper's browser, so use a webhook URL that's meant to be public (Zapier/Make "catch hook" URLs are).

---

## Project structure

```
app/
  (en)/                       English routes (site root): home, collections, products,
                              pages, quiz, search, cart, checkout
  es/                         The same routes in Spanish (/es/…)
  search-index.json/          Compact catalog for instant search + bag suggestions
  sitemap.ts · robots.ts · manifest.ts · icon.svg
views/                        Page layouts shared by both languages
.github/workflows/            GitHub Pages build + deploy
components/                   Header, footer, product card, cart drawer, buy box, etc.
lib/
  shopify/                    Storefront API client + GraphQL queries
  commerce.ts                 Catalog API used at build time (Shopify or demo data)
  cart.ts                     Bag, in the browser (Shopify Cart API)
  config.ts                   Public settings (Shopify, base path, webhooks)
  scent.ts                    Scent profiles, "smells similar", typo-tolerant search
  catalog-utils.ts            Sorting and filters
  i18n/                       English + Spanish interface text and helpers
  pages-es.tsx                Spanish info pages
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
- [ ] Pages source set to **GitHub Actions**, and `SITE_URL` set if you use a custom domain
- [ ] Review the copy in `lib/pages.tsx` (shipping times, shipping regions, return window, sourcing claims) so it matches how you actually operate, and have the **Privacy Policy and Terms** reviewed (or replace them with Shopify's policy generator text)
- [ ] Free-shipping threshold in `lib/site.ts` matches your Shopify shipping rates
- [ ] Shopify checkout branding and payment methods (Shop Pay, Apple Pay, PayPal) set up
- [ ] Newsletter/contact webhooks set (optional)
- [ ] Sitemap submitted to Google Search Console

> **About the demo catalog:** the sample products in `lib/demo-data.ts` use well-known designer names with illustrative prices to preview the shopping experience. They're replaced by your real Shopify catalog as soon as you connect. Brand names and trademarks belong to their respective owners.

---

*Huele bien. Vive mejor.* ✦ Authentic fragrances. Below retail. Always.
