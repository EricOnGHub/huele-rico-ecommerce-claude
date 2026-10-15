import type { Metadata, Viewport } from "next";
import { Allura, Inter, Montserrat, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { en } from "@/lib/i18n/en";
import { absoluteUrl, site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-montserrat", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: { default: en.meta.title, template: `%s | ${site.name} Fragrances` },
  description: en.meta.description,
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
    "perfumes de diseñador",
    "Huele Rico",
    "Paga Menos",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4c234e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Root document. The language-specific shell lives in app/(en)/layout.tsx and app/es/layout.tsx. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = Object.values(site.social).filter(Boolean);
  return (
    <html lang="en-US" className={`${playfair.variable} ${montserrat.variable} ${inter.variable} ${allura.variable}`}>
      <body>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "@id": absoluteUrl("/#organization"),
              name: site.legalName,
              alternateName: site.name,
              url: absoluteUrl("/"),
              logo: absoluteUrl("/icon.svg"),
              image: absoluteUrl("/images/og-image.jpg"),
              slogan: site.tagline,
              description: en.meta.description,
              email: site.email,
              knowsLanguage: ["en", "es"],
              ...(sameAs.length ? { sameAs } : {}),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": absoluteUrl("/#website"),
              name: site.legalName,
              url: absoluteUrl("/"),
              inLanguage: ["en-US", "es-US"],
              publisher: { "@id": absoluteUrl("/#organization") },
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search/")}?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
