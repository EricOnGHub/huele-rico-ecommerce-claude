"use client";

import { useState, type FormEvent } from "react";
import { contactWebhook } from "@/lib/config";
import { isEmail, postToWebhook } from "@/lib/webhook";

type State = { ok: boolean; message: string } | null;

export function ContactForm() {
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return setState({ ok: true, message: "¡Gracias! We'll be in touch soon." });
    const field = (k: string, max: number) => String(f.get(k) || "").trim().slice(0, max);
    const data = { name: field("name", 120), email: field("email", 254), order: field("order", 40), message: field("message", 4000) };
    if (!data.name || !isEmail(data.email) || data.message.length < 5) {
      return setState({ ok: false, message: "Please fill in your name, a valid email and a message." });
    }
    setPending(true);
    try {
      await postToWebhook(contactWebhook, data);
      setState({ ok: true, message: "¡Gracias! Your message is on its way. We'll reply within one business day." });
    } catch {
      setState({ ok: false, message: "Something went wrong. Please try again or email us directly." });
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
        Name · Nombre
        <input name="name" required autoComplete="name" className="input" />
      </label>
      <label>
        Email · Correo
        <input name="email" type="email" required autoComplete="email" className="input" />
      </label>
      <label>
        Order number (optional)
        <input name="order" className="input" placeholder="#1001" />
      </label>
      <label>
        Message · Mensaje
        <textarea name="message" required className="input" />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </button>
      {state && !state.ok && (
        <p className="form-msg err" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
