"use client";

import { useActionState } from "react";
import { subscribeAction, type NewsletterState } from "@/lib/newsletter";

export function Newsletter() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeAction, null);
  return (
    <div className="newsletter">
      <p className="eyebrow">Únete a la Familia</p>
      <h2 id="news-title">Get early access to drops &amp; deals</h2>
      <p className="lead" style={{ margin: "0 auto" }}>
        Be first to know about restocks, new arrivals and members-only drops. Huele rico, paga menos — every week.
      </p>
      <form action={action} noValidate>
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
