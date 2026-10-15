"use client";

import { useState, type FormEvent } from "react";
import { contactWebhook } from "@/lib/config";
import { useLang } from "@/lib/i18n/use-lang";
import { isEmail, postToWebhook } from "@/lib/webhook";

type State = { ok: boolean; message: string } | null;

export function ContactForm() {
  const { t } = useLang();
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return setState({ ok: true, message: t.contact.thanks });
    const field = (k: string, max: number) => String(f.get(k) || "").trim().slice(0, max);
    const data = { name: field("name", 120), email: field("email", 254), order: field("order", 40), message: field("message", 4000) };
    if (!data.name || !isEmail(data.email) || data.message.length < 5) {
      return setState({ ok: false, message: t.contact.invalid });
    }
    setPending(true);
    try {
      await postToWebhook(contactWebhook, data);
      setState({ ok: true, message: t.contact.thanks });
    } catch {
      setState({ ok: false, message: t.contact.error });
    } finally {
      setPending(false);
    }
  }

  if (state?.ok) {
    return (
      <p className="form-msg ok" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate>
      <label>
        {t.contact.name}
        <input name="name" required autoComplete="name" className="input" />
      </label>
      <label>
        {t.contact.email}
        <input name="email" type="email" required autoComplete="email" className="input" />
      </label>
      <label>
        {t.contact.order}
        <input name="order" className="input" placeholder="#1001" />
      </label>
      <label>
        {t.contact.message}
        <textarea name="message" required className="input" />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? t.contact.sending : t.contact.send}
      </button>
      {state && !state.ok && (
        <p className="form-msg err" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
