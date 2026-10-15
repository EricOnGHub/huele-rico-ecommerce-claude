import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Mail } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { contactWebhook } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getFaqs, getPages } from "@/lib/pages";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { pageMeta } from "./meta";

export const infoParams = (lang: Lang) => Object.keys(getPages(lang)).map((slug) => ({ slug }));

export function infoMetadata(lang: Lang, slug: string): Metadata {
  const page = getPages(lang)[slug];
  if (!page) return {};
  return pageMeta({ lang, path: `/pages/${slug}`, title: page.title, description: page.description });
}

export function InfoPageView({ lang, slug }: { lang: Lang; slug: string }) {
  const page = getPages(lang)[slug];
  if (!page) notFound();
  const t = getDict(lang);
  const faqs = getFaqs(lang);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs lang={lang} items={[{ name: page.title, href: `/pages/${slug}` }]} />
          <p className="eyebrow" style={{ marginTop: 18 }}>
            {page.eyebrow}
          </p>
          <h1>{page.title}</h1>
        </div>
      </section>
      <section className="section-tight">
        <div className="container">
          {slug === "faq" ? (
            <div className="prose accordion">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div className="acc-body">
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
              <JsonLd
                data={{
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  inLanguage: lang === "es" ? "es-US" : "en-US",
                  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
                }}
              />
            </div>
          ) : slug === "contact" ? (
            <div className="contact-grid">
              <div>
                <p className="lead">{t.contact.intro}</p>
                <p style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Mail width={22} height={22} style={{ color: "var(--champagne-gold)" }} />
                  <a href={`mailto:${site.email}`} className="link-arrow" style={{ textTransform: "none", letterSpacing: 0 }}>
                    {site.email}
                  </a>
                </p>
                <p className="script">Huele bien. Vive mejor.</p>
              </div>
              {contactWebhook ? (
                <ContactForm />
              ) : (
                <div className="contact-card">
                  <h2 style={{ fontSize: "1.3rem" }}>{t.contact.writeTitle}</h2>
                  <p>{t.contact.writeBody}</p>
                  <a href={`mailto:${site.email}?subject=${encodeURIComponent(t.contact.subject)}`} className="btn btn-primary">
                    <Mail /> {t.contact.emailUs}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="prose">{page.body}</div>
          )}
        </div>
      </section>
    </>
  );
}
