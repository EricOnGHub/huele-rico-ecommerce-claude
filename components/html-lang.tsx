"use client";

import { useEffect } from "react";
import { htmlLang } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

/** Keeps <html lang> in sync when shoppers switch language without a full page load. */
export function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang[lang];
  }, [lang]);
  return null;
}
