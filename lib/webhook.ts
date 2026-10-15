// Sends form data from the browser to a webhook (Klaviyo, Shopify Flow, Zapier, Make…).
// "no-cors" lets it reach webhook services that don't send CORS headers; the
// response can't be read, so a network failure is the only error we can detect.
export async function postToWebhook(url: string, data: Record<string, string>) {
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ ...data, source: "huelerico-storefront" }),
  });
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
