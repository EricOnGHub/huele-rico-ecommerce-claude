"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Lang } from "../types";
import { getDict, lp } from "./index";

/** Current language for client components, read from the URL (/es/… = Spanish). */
export function useLang() {
  const pathname = usePathname() || "/";
  const lang: Lang = /^\/es(\/|$)/.test(pathname) ? "es" : "en";
  return useMemo(() => ({ lang, t: getDict(lang), lp: (path: string) => lp(lang, path) }), [lang]);
}
