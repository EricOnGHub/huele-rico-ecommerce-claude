"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n/use-lang";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t, lp } = useLang();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section">
      <div className="container center">
        <p className="eyebrow">{t.error.eyebrow}</p>
        <h1>{t.error.title}</h1>
        <p className="lead" style={{ margin: "0 auto 28px" }}>
          {t.error.body}
        </p>
        <div className="stack-sm" style={{ justifyContent: "center" }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            {t.error.retry}
          </button>
          <Link href={lp("/")} className="btn btn-gold">
            {t.notFound.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
