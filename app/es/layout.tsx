import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { pageMeta } from "@/views/meta";
import { Shell } from "@/views/shell";

const t = getDict("es");

export const metadata: Metadata = {
  ...pageMeta({ lang: "es", path: "/" }),
  title: { default: t.meta.title, template: "%s | Huele Rico! Fragrances" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang={"es"}>{children}</Shell>;
}
