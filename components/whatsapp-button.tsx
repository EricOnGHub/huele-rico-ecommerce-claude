"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/use-lang";
import { site } from "@/lib/site";

/** Floating WhatsApp chat button. Shown only when NEXT_PUBLIC_WHATSAPP_NUMBER is set. */
export function WhatsAppButton() {
  const { t } = useLang();
  const pathname = usePathname();
  const [page, setPage] = useState("");
  useEffect(() => setPage(document.title.split(" | ")[0]), [pathname]);
  if (!site.whatsapp) return null;
  const onProduct = /\/products\//.test(pathname || "");
  const text = encodeURIComponent(t.whatsapp.message + page);
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      className={`whatsapp ${onProduct ? "raised" : ""}`}
      target="_blank"
      rel="noopener"
      aria-label={t.whatsapp.label}
      title={t.whatsapp.label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.04 2a9.9 9.9 0 0 0-8.47 15.02L2 22l5.1-1.53A9.9 9.9 0 1 0 12.04 2Zm0 18.05a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.03.91.93-2.95-.2-.31a8.13 8.13 0 1 1 6.73 3.66Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06a6.66 6.66 0 0 1-1.95-1.2 7.35 7.35 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.49.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c.58.25 1.04.4 1.39.51.58.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"
        />
      </svg>
    </a>
  );
}
