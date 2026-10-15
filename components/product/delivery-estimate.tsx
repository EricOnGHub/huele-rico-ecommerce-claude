"use client";

import { useEffect, useState } from "react";
import { fmt, htmlLang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { site } from "@/lib/site";
import { Truck } from "../icons";

/** Adds business days (Mon–Fri) to a date. */
function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added++;
  }
  return d;
}

/**
 * "Estimated delivery: Mon, Oct 20 – Fri, Oct 24". Uses the handling and transit
 * days from lib/site.ts, so it always matches the shipping policy.
 * Rendered after load so the dates reflect the shopper's own "today".
 */
export function DeliveryEstimate() {
  const { lang, t } = useLang();
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    const { handlingDays, transitDays } = site.shipping;
    const now = new Date();
    const f = new Intl.DateTimeFormat(htmlLang[lang], { weekday: "short", month: "short", day: "numeric" });
    setRange({
      from: f.format(addBusinessDays(now, handlingDays[0] + transitDays[0])),
      to: f.format(addBusinessDays(now, handlingDays[1] + transitDays[1])),
    });
  }, [lang]);

  return (
    <div className="delivery">
      <Truck />
      <div>
        <strong>{t.delivery.title}</strong>
        <span className="delivery-dates">{range ? fmt(t.delivery.range, range) : "—"}</span>
        <span className="muted">{fmt(t.delivery.note, { n: site.freeShippingThreshold })}</span>
      </div>
    </div>
  );
}
