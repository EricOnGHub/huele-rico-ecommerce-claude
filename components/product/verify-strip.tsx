import Link from "next/link";
import { getDict, lp } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Shield } from "../icons";

export function VerifyStrip({ lang }: { lang: Lang }) {
  const t = getDict(lang).verify;
  return (
    <section className="verify" aria-labelledby="verify-title">
      <h2 id="verify-title" className="subhead pdp-subhead">
        <Shield width={18} height={18} /> {t.title}
      </h2>
      <ul>
        {t.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </li>
        ))}
      </ul>
      <Link href={lp(lang, "/pages/authenticity")} className="link-arrow">
        {t.more}
      </Link>
    </section>
  );
}
