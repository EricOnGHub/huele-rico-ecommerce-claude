"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section">
      <div className="container center">
        <p className="eyebrow">Algo salió mal</p>
        <h1>Something went wrong.</h1>
        <p className="lead" style={{ margin: "0 auto 28px" }}>
          We couldn&rsquo;t load this page right now. Please try again in a moment.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try Again
          </button>
          <Link href="/" className="btn btn-gold">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
