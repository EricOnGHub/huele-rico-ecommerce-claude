import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container center">
        <p className="eyebrow">Error 404</p>
        <h1>Esta página se evaporó.</h1>
        <p className="lead" style={{ margin: "0 auto 28px" }}>
          This page drifted away like a top note. Let&rsquo;s get you back to something that smells amazing.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/collections/best-sellers" className="btn btn-gold">
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
