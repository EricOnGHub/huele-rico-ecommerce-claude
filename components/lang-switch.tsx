"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lp, stripLang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";

/** EN | ES toggle. Keeps the shopper on the same page in the other language. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, t } = useLang();
  const pathname = usePathname() || "/";
  const other = lang === "en" ? "es" : "en";
  const href = lp(other, stripLang(pathname));
  return (
    <Link href={href} className={`lang-switch ${className}`} hrefLang={other === "es" ? "es-US" : "en-US"} lang={other} aria-label={t.switchAria}>
      <span aria-hidden="true" className={lang === "en" ? "on" : ""}>EN</span>
      <span aria-hidden="true" className="sep">|</span>
      <span aria-hidden="true" className={lang === "es" ? "on" : ""}>ES</span>
    </Link>
  );
}
