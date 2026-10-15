import type { Metadata, Viewport } from "next";
import { Allura, Inter, Montserrat, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { isDemoMode } from "@/lib/commerce";
import { absoluteUrl, site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-montserrat", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Fragrances | Authentic Designer Perfume & Cologne Below Retail`,
    template: `%s | ${site.name} Fragrances`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    "authentic perfume",
    "designer fragrances",
    "discount cologne",
    "perfume below retail",
    "cologne for men",
    "perfume for women",
    "perfumes originales",
    "lociones originales",
    "Huele Rico",
    "Paga Menos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: "en_US",
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Friends wearing Huele Rico! apparel on a rooftop at sunset" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4c234e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = Object.values(site.social).filter(Boolean);
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${inter.variable} ${allura.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "@id": absoluteUrl("/#organization"),
              name: site.legalName,
              alternateName: site.name,
              url: site.url,
              logo: absoluteUrl("/icon.svg"),
              image: absoluteUrl("/images/og-image.jpg"),
              slogan: site.tagline,
              description: site.description,
              email: site.email,
              ...(sameAs.length ? { sameAs } : {}),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": absoluteUrl("/#website"),
              name: site.legalName,
              url: site.url,
              inLanguage: ["en-US", "es-US"],
              publisher: { "@id": absoluteUrl("/#organization") },
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
          ]}
        />
        <CartProvider>
          {isDemoMode && (
            <div className="demo-banner" role="note">
              Demo catalog — sample products &amp; prices. Add your Shopify credentials to go live (see README).
            </div>
          )}
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
