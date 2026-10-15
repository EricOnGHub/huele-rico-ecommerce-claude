import Link from "next/link";
import { footerGroups, fmt, getDict, lp } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { Facebook, Instagram, Mail, TikTok } from "./icons";
import { Logo } from "./logo";

export function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang).footer;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo href={lp(lang, "/")} />
            <p className="footer-script">Huele bien. Vive mejor.</p>
            <p style={{ maxWidth: "36ch" }}>{t.blurb}</p>
            <div className="social">
              {site.social.instagram && (
                <a href={site.social.instagram} aria-label={fmt(t.social, { network: "Instagram" })} rel="noopener" target="_blank">
                  <Instagram />
                </a>
              )}
              {site.social.tiktok && (
                <a href={site.social.tiktok} aria-label={fmt(t.social, { network: "TikTok" })} rel="noopener" target="_blank">
                  <TikTok />
                </a>
              )}
              {site.social.facebook && (
                <a href={site.social.facebook} aria-label={fmt(t.social, { network: "Facebook" })} rel="noopener" target="_blank">
                  <Facebook />
                </a>
              )}
              <a href={`mailto:${site.email}`} aria-label={t.emailUs}>
                <Mail />
              </a>
            </div>
          </div>
          {footerGroups(lang).map((g) => (
            <nav key={g.title} className="footer-col" aria-label={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {site.legalName}. {t.rights}
          </span>
          <span className="footer-promise">{t.promiseLine}</span>
          <span className="pay-icons" aria-label={t.payments}>
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
