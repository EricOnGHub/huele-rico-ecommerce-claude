import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Facebook, Instagram, Mail, TikTok } from "./icons";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="footer-script">Huele bien. Vive mejor.</p>
            <p style={{ maxWidth: "36ch" }}>
              Authentic designer fragrances for him and her — always below retail. {site.tagline}.
            </p>
            <div className="social">
              {site.social.instagram && (
                <a href={site.social.instagram} aria-label="Huele Rico! on Instagram" rel="noopener" target="_blank">
                  <Instagram />
                </a>
              )}
              {site.social.tiktok && (
                <a href={site.social.tiktok} aria-label="Huele Rico! on TikTok" rel="noopener" target="_blank">
                  <TikTok />
                </a>
              )}
              {site.social.facebook && (
                <a href={site.social.facebook} aria-label="Huele Rico! on Facebook" rel="noopener" target="_blank">
                  <Facebook />
                </a>
              )}
              <a href={`mailto:${site.email}`} aria-label="Email Huele Rico!">
                <Mail />
              </a>
            </div>
          </div>
          <FooterCol title="Shop · Tienda" links={footerNav.shop} />
          <FooterCol title="Help · Ayuda" links={footerNav.help} />
          <FooterCol title="Huele Rico!" links={footerNav.about} />
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {site.legalName}. All rights reserved.
          </span>
          <span className="footer-promise">{site.promise}</span>
          <span className="pay-icons" aria-label="Accepted payment methods">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>Apple Pay</span>
            <span>Shop Pay</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav className="footer-col" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
