// Content for the informational pages at /pages/[slug].
// Edit the copy here — it's plain JSX. Policies are general templates:
// review them (or replace them with Shopify's policy generator output) before launch.

import Link from "next/link";
import type { ReactNode } from "react";
import { faqsEs, pagesEs } from "./pages-es";
import type { Lang } from "./types";
import { site } from "./site";

export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "Are your fragrances 100% authentic?",
    a: "Yes — always. Every perfume and cologne we sell is an original designer product, factory sealed and sourced through trusted distribution channels. We never sell testers as new, decants, dupes or \"inspired by\" scents. If anything we ship is not authentic, we'll refund you in full.",
  },
  {
    q: "How can your prices be below retail?",
    a: "We buy in volume from authorized distributors and wholesale partners, keep our overhead low as a digital-first brand, and pass the savings to you. Same bottle, same juice — huele rico, paga menos.",
  },
  {
    q: "How fast is shipping?",
    a: `Orders ship within 1–2 business days. Standard U.S. delivery usually takes 2–5 business days, and shipping is free on orders over $${site.freeShippingThreshold}. You'll get a tracking number by email as soon as your order ships.`,
  },
  {
    q: "Do you ship outside the United States?",
    a: "We currently ship within the U.S., including Puerto Rico. International shipping is coming soon — ¡muy pronto!",
  },
  {
    q: "What is your return policy?",
    a: "Unopened, unused items in their original sealed packaging can be returned within 30 days of delivery for a full refund. For safety and hygiene reasons, opened fragrances can't be returned unless they arrived damaged or incorrect.",
  },
  {
    q: "My order arrived damaged. What do I do?",
    a: "We're so sorry! Email us within 7 days of delivery with your order number and a photo of the item and packaging, and we'll send a replacement or issue a refund right away.",
  },
  {
    q: "What's the difference between Parfum, Eau de Parfum and Eau de Toilette?",
    a: "It's the concentration of fragrance oils. Parfum (or Elixir) is the most concentrated and longest-lasting, Eau de Parfum (EDP) is rich and lasts most of the day, and Eau de Toilette (EDT) is lighter and fresher — great for daytime and warm weather.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Every order already arrives gift-ready in our signature plum box with monogram tissue and a bilingual thank-you card. Prices are never shown on the packing slip.",
  },
  {
    q: "¿Hablan español?",
    a: "¡Claro que sí! Our team speaks English and Spanish. Write to us in whichever language you prefer.",
  },
];

export type Page = {
  title: string;
  eyebrow: string;
  description: string;
  body: ReactNode;
};

export const pages: Record<string, Page> = {
  about: {
    title: "Our Story",
    eyebrow: "Nuestra Historia",
    description:
      "Huele Rico! makes designer fragrance accessible, trustworthy and culturally relevant — 100% authentic perfumes and colognes below retail.",
    body: (
      <>
        <p className="lead">
          Huele Rico! was born from a simple idea: everybody deserves to smell incredible — without paying department-store
          markups.
        </p>
        <p>
          Growing up, a great fragrance was a special-occasion thing. The bottle on the dresser that only came out for weddings,
          quinceañeras and Sunday best. We wanted to change that. Our mission is to make designer fragrance feel more accessible,
          trustworthy and culturally relevant for modern shoppers.
        </p>
        <h2>Smart luxury, original only</h2>
        <p>
          We sell only authentic designer perfumes and colognes — no dupes, no decants, no &ldquo;inspired by.&rdquo; By buying
          smart and running lean as a digital-first brand, we pass real savings to you. Same bottle. Better price.{" "}
          <strong>Huele Rico, Paga Menos.</strong>
        </p>
        <h2>One brand, two voices</h2>
        <p>
          We speak English and Español, because our community does. We&rsquo;re confident, warm, aspirational and — above all —
          trustworthy. We earn that trust through authenticity, transparency and consistent quality, every single order.
        </p>
        <h2>Made to be gifted</h2>
        <p>
          From our soft-touch plum boxes to the gold-foil seal and bilingual thank-you card, every order is designed to feel like
          a gift — even when it&rsquo;s for you.
        </p>
        <p className="script">Huele bien. Vive mejor.</p>
        <p>
          <Link href="/collections/best-sellers" className="btn btn-primary">
            Shop Best Sellers
          </Link>
        </p>
      </>
    ),
  },
  authenticity: {
    title: "Our Authenticity Promise",
    eyebrow: "Autenticidad · Confianza · Esencia",
    description:
      "Every Huele Rico! fragrance is 100% authentic, factory sealed and backed by a money-back guarantee. 100% original o te devolvemos tu dinero.",
    body: (
      <>
        <div className="callout">
          <strong>100% original o te devolvemos tu dinero.</strong> If any product you receive from us is not authentic, we will
          refund your purchase in full — including shipping.
        </div>
        <h2>Where our fragrances come from</h2>
        <p>
          We source exclusively through authorized distributors and established, verified wholesale partners. We never purchase
          from unknown resellers, and we never sell counterfeits, &ldquo;inspired by&rdquo; scents, refilled bottles or decants.
        </p>
        <h2>How we check every bottle</h2>
        <ul>
          <li>Batch codes on the box and bottle are checked to make sure they match.</li>
          <li>Packaging, cellophane, printing and bottle quality are inspected against brand standards.</li>
          <li>Products are stored in a climate-controlled environment, away from heat and direct sunlight.</li>
          <li>Every order is sealed with our signature Huele Rico! authenticity sticker.</li>
        </ul>
        <h2>Why prices are below retail</h2>
        <p>
          Department stores carry big overhead — rent, staff, displays. As a digital-first brand we buy in volume and keep costs
          low, so the savings go back to you. That&rsquo;s the whole idea: huele rico, paga menos.
        </p>
        <h2>Questions?</h2>
        <p>
          Our team is happy to help, in English or Español. <Link href="/pages/contact">Contact us</Link> anytime.
        </p>
      </>
    ),
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    eyebrow: "Envíos y Devoluciones",
    description: `Free fast U.S. shipping on orders $${site.freeShippingThreshold}+, orders ship in 1–2 business days, and easy 30-day returns on unopened fragrances.`,
    body: (
      <>
        <h2>Shipping</h2>
        <ul>
          <li>
            <strong>Free standard shipping</strong> on U.S. orders of ${site.freeShippingThreshold} or more.
          </li>
          <li>Orders are processed and shipped within 1–2 business days (Monday–Friday, excluding holidays).</li>
          <li>Standard delivery typically arrives in 2–5 business days. Expedited options are available at checkout.</li>
          <li>We ship to all 50 states and Puerto Rico. International shipping is coming soon.</li>
          <li>You&rsquo;ll receive a tracking number by email as soon as your order ships.</li>
        </ul>
        <p className="muted">
          Fragrances contain alcohol and are shipped by ground in accordance with carrier regulations for consumer commodities.
        </p>
        <h2>Returns</h2>
        <ul>
          <li>Unopened, unused items in their original sealed packaging may be returned within 30 days of delivery.</li>
          <li>For hygiene and safety reasons, opened or used fragrances cannot be returned unless damaged or incorrect.</li>
          <li>Refunds are issued to the original payment method within 5–7 business days after we receive your return.</li>
        </ul>
        <h2>Damaged or incorrect items</h2>
        <p>
          If your order arrives damaged or isn&rsquo;t what you ordered, email us within 7 days of delivery with your order number and a
          photo. We&rsquo;ll make it right with a replacement or full refund — at no cost to you.
        </p>
        <p>
          <Link href="/pages/contact">Start a return or ask a question →</Link>
        </p>
      </>
    ),
  },
  faq: {
    title: "Frequently Asked Questions",
    eyebrow: "Preguntas Frecuentes",
    description: "Answers about authenticity, shipping, returns and fragrance types at Huele Rico! — authentic designer perfume below retail.",
    body: null, // rendered from `faqs` with FAQPage structured data
  },
  "fragrance-care": {
    title: "Fragrance Care",
    eyebrow: "Cuida Tu Fragancia",
    description: "How to store and wear perfume so it lasts longer — tips from Huele Rico!.",
    body: (
      <>
        <h2>Store it right</h2>
        <ul>
          <li>
            <strong>Guárdalo en un lugar fresco y seco.</strong> Keep bottles in a cool, dry place — a drawer or closet beats the
            bathroom.
          </li>
          <li>
            <strong>Evita la luz solar directa.</strong> Sunlight and temperature swings break down fragrance oils.
          </li>
          <li>
            <strong>Mantén la tapa bien cerrada.</strong> Keep the cap on to preserve the essence and prevent evaporation.
          </li>
        </ul>
        <h2>Wear it longer</h2>
        <ul>
          <li>Apply to moisturized skin right after a shower — fragrance clings to hydrated skin.</li>
          <li>Spray on pulse points: neck, wrists, inner elbows and behind the ears.</li>
          <li>Don&rsquo;t rub your wrists together; it crushes the top notes.</li>
          <li>A light mist on clothing or hair can extend wear — test on fabric first.</li>
        </ul>
        <p className="script">Gracias por elegir Huele Rico! Fragrances.</p>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    eyebrow: "Contáctanos",
    description: "Questions about an order, a fragrance or authenticity? Contact the Huele Rico! team in English or Español.",
    body: null, // rendered with the contact form
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Legal",
    description: "How Huele Rico! Fragrances collects, uses and protects your personal information.",
    body: (
      <>
        <p className="muted">Last updated: October 2026</p>
        <p>
          {site.legalName} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This policy explains what information we
          collect when you visit our site or make a purchase, and how we use it.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Order information</strong> — name, shipping and billing address, email, phone and payment details, collected
            through our checkout provider, Shopify.
          </li>
          <li>
            <strong>Device and usage information</strong> — browser type, IP address, pages viewed and referring sites, collected
            via cookies and similar technologies.
          </li>
          <li>
            <strong>Communications</strong> — information you send us by email, the contact form or newsletter sign-up.
          </li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To process and ship your orders, and to communicate with you about them.</li>
          <li>To screen orders for fraud and keep our store secure.</li>
          <li>To improve our site and, with your consent, send marketing emails (you can unsubscribe at any time).</li>
        </ul>
        <h2>Sharing</h2>
        <p>
          We share information only with service providers that help us run our business — such as Shopify (e-commerce and
          checkout), payment processors and shipping carriers — or when required by law. We do not sell your personal information.
        </p>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct or delete your personal information. To make a
          request, email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Legal",
    description: "Terms and conditions for shopping at Huele Rico! Fragrances.",
    body: (
      <>
        <p className="muted">Last updated: October 2026</p>
        <p>
          By using this website and purchasing from {site.legalName}, you agree to these terms. Please read them carefully.
        </p>
        <h2>Products and pricing</h2>
        <p>
          We sell authentic designer fragrances. &ldquo;Retail&rdquo; or compare-at prices reflect the manufacturer&rsquo;s suggested or
          typical retail price at the time of listing. Prices and availability may change without notice. We reserve the right to
          cancel orders affected by pricing errors, with a full refund.
        </p>
        <h2>Orders and payment</h2>
        <p>
          Orders are processed through Shopify&rsquo;s secure checkout. We may limit quantities or decline orders at our discretion,
          including orders that appear to be placed by resellers.
        </p>
        <h2>Shipping and returns</h2>
        <p>
          See our <Link href="/pages/shipping-returns">Shipping &amp; Returns policy</Link>.
        </p>
        <h2>Trademarks</h2>
        <p>
          All brand names and trademarks of the designer fragrances we sell belong to their respective owners. {site.legalName} is
          an independent retailer and is not affiliated with or endorsed by these brands.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, our liability for any claim related to a product is limited to the amount you paid
          for that product. Discontinue use of any product that causes irritation.
        </p>
        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
};

export const getPages = (lang: Lang) => (lang === "es" ? pagesEs : pages);
export const getFaqs = (lang: Lang) => (lang === "es" ? faqsEs : faqs);
