"use client";

import { useState, type FormEvent } from "react";
import { newsletterWebhook } from "@/lib/config";
import { isEmail, postToWebhook } from "@/lib/webhook";

type State = { ok: boolean; message: string } | null;

export function Newsletter() {
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const form = new FormData(el);
    if (form.get("company")) return setState({ ok: true, message: "¡Gracias! You're on the list." });
    const email = String(form.get("email") || "").trim().toLowerCase();
    if (!isEmail(email)) return setState({ ok: false, message: "Please enter a valid email address." });
    setPending(true);
    try {
      if (newsletterWebhook) await postToWebhook(newsletterWebhook, { email, tags: "newsletter" });
      setState({ ok: true, message: "¡Gracias! You're on the list." });
      el.reset();
    } catch {
      setState({ ok: false, message: "Something went wrong. Please try again in a moment." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="newsletter">
      <p className="eyebrow">Únete a la Familia</p>
      <h2 id="news-title">Get early access to drops &amp; deals</h2>
      <p className="lead" style={{ margin: "0 auto" }}>
        Be first to know about restocks, new arrivals and members-only drops. Huele rico, paga menos — every week.
      </p>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Your email · Tu correo" className="input" />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
        <button type="submit" className="btn btn-gold" style={{ background: "var(--champagne-gold)", color: "var(--plum-deep)" }} disabled={pending}>
          {pending ? "Joining…" : "Join Now"}
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
