import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HtmlLang } from "@/components/html-lang";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { isDemoMode } from "@/lib/config";
import { getDict, htmlLang } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

/** Header, footer, bag and chat button around every page, in the page's language. */
export function Shell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = getDict(lang);
  return (
    <CartProvider>
      {lang !== "en" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(htmlLang[lang])}` }} />}
      <HtmlLang lang={lang} />
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      {isDemoMode && (
        <div className="demo-banner" role="note">
          {t.demoBanner}
        </div>
      )}
      <Header />
      <main id="main">{children}</main>
      <Footer lang={lang} />
      <CartDrawer />
      <WhatsAppButton />
    </CartProvider>
  );
}
