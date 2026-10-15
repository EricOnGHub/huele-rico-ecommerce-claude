"use client";

import { useState, type FormEvent } from "react";
import { newsletterWebhook } from "@/lib/config";
import { useLang } from "@/lib/i18n/use-lang";
import { isEmail, postToWebhook } from "@/lib/webhook";
import { Mail } from "../icons";

/** Back-in-stock sign-up for a sold-out size. Posts to the newsletter webhook with a "back-in-stock" tag. */
export function NotifyMe({ product, variant }: { product: string; variant: string }) {
  const { t } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim().toLowerCase();
    if (!isEmail(email)) return setState("invalid");
    setState("sending");
    try {
      if (newsletterWebhook) await postToWebhook(newsletterWebhook, { email, tags: "back-in-stock", product, variant });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="notify done" role="status">
        {t.notify.done}
      </p>
    );
  }
  return (
    <form className="notify" onSubmit={onSubmit} noValidate>
      <strong>
        <Mail width={18} height={18} /> {t.notify.title}
      </strong>
      <p>{t.notify.body}</p>
      <div className="notify-row">
        <label htmlFor="notify-email" className="sr-only">
          {t.newsletter.label}
        </label>
        <input id="notify-email" name="email" type="email" autoComplete="email" className="input" placeholder={t.newsletter.placeholder} />
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? t.notify.sending : t.notify.cta}
        </button>
      </div>
      {(state === "invalid" || state === "error") && (
        <p className="form-msg err" role="alert">
          {state === "invalid" ? t.newsletter.invalid : t.newsletter.error}
        </p>
      )}
    </form>
  );
}
