"use server";

export type ContactState = { ok: boolean; message: string } | null;

export async function contactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (formData.get("company")) return { ok: true, message: "¡Gracias! We'll be in touch soon." };
  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const email = String(formData.get("email") || "").trim().slice(0, 254);
  const order = String(formData.get("order") || "").trim().slice(0, 40);
  const message = String(formData.get("message") || "").trim().slice(0, 4000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 5) {
    return { ok: false, message: "Please fill in your name, a valid email and a message." };
  }
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return { ok: false, message: "Our contact form is unavailable right now — please email us instead." };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, order, message, source: "huelerico-storefront" }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return { ok: false, message: "Something went wrong. Please try again or email us directly." };
  }
  return { ok: true, message: "¡Gracias! Your message is on its way. We'll reply within one business day." };
}
