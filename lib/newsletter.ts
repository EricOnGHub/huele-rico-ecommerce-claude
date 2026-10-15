"use server";

// Newsletter sign-up. Set NEWSLETTER_WEBHOOK_URL to any endpoint that accepts
// a JSON POST ({ email, source, tags }) — e.g. a Klaviyo/Shopify Flow/Zapier/Make
// webhook — and new subscribers are forwarded there.

export type NewsletterState = { ok: boolean; message: string } | null;

export async function subscribeAction(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  // Honeypot: real users never fill this hidden field.
  if (formData.get("company")) return { ok: true, message: "¡Gracias! You're on the list." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const url = process.env.NEWSLETTER_WEBHOOK_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "huelerico-storefront", tags: ["newsletter"] }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      return { ok: false, message: "Something went wrong. Please try again in a moment." };
    }
  } else {
    console.warn("[newsletter] NEWSLETTER_WEBHOOK_URL is not set — sign-up was not stored:", email.replace(/(.).+@/, "$1***@"));
  }
  return { ok: true, message: "¡Gracias! You're on the list." };
}
