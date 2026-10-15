"use client";

import { useActionState } from "react";
import { contactAction, type ContactState } from "@/lib/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(contactAction, null);
  if (state?.ok) {
    return (
      <p className="form-msg ok" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action}>
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
