"use client";

import { useState, type FormEvent } from "react";
import { newsletterWebhook } from "@/lib/config";
import { useLang } from "@/lib/i18n/use-lang";
import { isEmail, postToWebhook } from "@/lib/webhook";

type State = { ok: boolean; message: string } | null;

export function Newsletter() {
  const { t } = useLang();
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const form = new FormData(el);
    if (form.get("company")) return setState({ ok: true, message: t.newsletter.thanks });
    const email = String(form.get("email") || "").trim().toLowerCase();
    if (!isEmail(email)) return setState({ ok: false, message: t.newsletter.invalid });
    setPending(true);
    try {
      if (newsletterWebhook) await postToWebhook(newsletterWebhook, { email, tags: "newsletter" });
      setState({ ok: true, message: t.newsletter.thanks });
      el.reset();
    } catch {
      setState({ ok: false, message: t.newsletter.error });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="newsletter">
      <p className="eyebrow">{t.newsletter.eyebrow}</p>
      <h2 id="news-title">{t.newsletter.title}</h2>
      <p className="lead" style={{ margin: "0 auto" }}>
        {t.newsletter.body}
      </p>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          {t.newsletter.label}
        </label>
        <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder={t.newsletter.placeholder} className="input" />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
        <button type="submit" className="btn btn-gold" style={{ background: "var(--champagne-gold)", color: "var(--plum-deep)" }} disabled={pending}>
          {pending ? t.newsletter.joining : t.newsletter.join}
        </button>
      </form>
      {state && (
        <p className={`form-msg ${state.ok ? "ok" : "err"}`} role="status">
          {state.message}
        </p>
      )}
    </div>
  );
}
