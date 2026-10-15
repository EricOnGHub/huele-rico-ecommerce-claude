import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Mail } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { faqs, pages } from "@/lib/pages";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/pages/${slug}` },
    openGraph: { title: `${page.title} | ${site.name}`, description: page.description, url: `/pages/${slug}` },
  };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ name: page.title, href: `/pages/${slug}` }]} />
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
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }}
              />
            </div>
          ) : slug === "contact" ? (
            <div className="contact-grid">
              <div>
                <p className="lead">
                  Questions about an order, a fragrance or our authenticity promise? We&rsquo;re here to help — in English or Español.
                  We reply within one business day.
                </p>
                <p style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Mail width={22} height={22} style={{ color: "var(--champagne-gold)" }} />
                  <a href={`mailto:${site.email}`} className="link-arrow" style={{ textTransform: "none", letterSpacing: 0 }}>
                    {site.email}
                  </a>
                </p>
                <p className="script">Huele bien. Vive mejor.</p>
              </div>
              {process.env.CONTACT_WEBHOOK_URL ? (
                <ContactForm />
              ) : (
                <div className="callout" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 24 }}>
                  <h2 style={{ fontSize: "1.3rem" }}>Escríbenos</h2>
                  <p>Email us with your name, order number (if you have one) and how we can help.</p>
                  <a href={`mailto:${site.email}?subject=Huele%20Rico!%20question`} className="btn btn-primary">
                    <Mail /> Email Us
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
