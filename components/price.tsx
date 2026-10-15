"use client";

import { formatMoney, savingsPercent } from "@/lib/format";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import type { Money } from "@/lib/types";

type Props = {
  price: Money;
  compareAt?: Money | null;
  from?: boolean;
  className?: string;
  showSave?: boolean;
};

export function Price({ price, compareAt, from, className, showSave = true }: Props) {
  const { t } = useLang();
  const save = savingsPercent(price, compareAt);
  return (
    <div className={`price ${className || ""}`}>
      {from && <span className="price-from">{t.price.from}</span>}
      <span className="price-now">
        <span className="sr-only">{save ? t.price.sale : t.price.regular}</span>
        {formatMoney(price)}
      </span>
      {save > 0 && compareAt && (
        <>
          <s className="price-was">
            <span className="sr-only">{t.price.retail}</span>
            {formatMoney(compareAt)}
          </s>
          {showSave && <span className="price-save">{fmt(t.card.save, { n: save })}</span>}
        </>
      )}
    </div>
  );
}
