import { formatMoney, savingsPercent } from "@/lib/format";
import type { Money } from "@/lib/types";

type Props = {
  price: Money;
  compareAt?: Money | null;
  from?: boolean;
  className?: string;
  showSave?: boolean;
};

export function Price({ price, compareAt, from, className, showSave = true }: Props) {
  const save = savingsPercent(price, compareAt);
  return (
    <div className={`price ${className || ""}`}>
      {from && <span className="price-from">From</span>}
      <span className="price-now">
        <span className="sr-only">{save ? "Sale price " : "Price "}</span>
        {formatMoney(price)}
      </span>
      {save > 0 && compareAt && (
        <>
          <s className="price-was">
            <span className="sr-only">Retail price </span>
            {formatMoney(compareAt)}
          </s>
          {showSave && <span className="price-save">Save {save}%</span>}
        </>
      )}
    </div>
  );
}
