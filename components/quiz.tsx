"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmt } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/use-lang";
import { FAMILIES } from "@/lib/scent";
import type { Gender, ProductSummary, ScentFamily } from "@/lib/types";
import { ProductGrid } from "./product-grid";

type Occasion = "everyday" | "date" | "event" | "gift";
type Intensity = "soft" | "medium" | "bold";
type Budget = "u75" | "75-150" | "150p" | "any";

type Answers = { for?: Gender; family: ScentFamily[]; occasion?: Occasion; intensity?: Intensity; budget?: Budget };

const BUDGETS: Record<Budget, [number, number]> = { u75: [0, 75], "75-150": [75, 150], "150p": [150, Infinity], any: [0, Infinity] };
const TARGET_SILLAGE: Record<Intensity, number> = { soft: 1.5, medium: 3, bold: 4.5 };

type Scored = { p: ProductSummary; pct: number; reasons: string[] };

function score(list: ProductSummary[], a: Answers): Scored[] {
  return list
    .filter((p) => p.available && p.variantId)
    .filter((p) => a.occasion === "gift" || !p.tags.includes("gift-set"))
    .filter((p) => !a.for || a.for === "unisex" || p.gender === a.for || p.gender === "unisex")
    .map((p) => {
      const reasons: string[] = [];
      let s = 0;

      // Scent family (35%)
      const fam = a.family.length ? p.profile.families.filter((f) => a.family.includes(f)) : [];
      const famScore = !a.family.length ? 0.6 : fam.length ? (a.family.includes(p.profile.families[0]) ? 1 : 0.75) : 0;
      if (fam.length) reasons.push(`family:${fam[0]}`);
      s += 0.35 * famScore;

      // Who it's for (10%)
      s += 0.1 * (!a.for || a.for === "unisex" ? (p.gender === "unisex" ? 1 : 0.8) : p.gender === a.for ? 1 : 0.75);

      // Intensity (20%)
      if (a.intensity) {
        const diff = Math.abs(p.profile.sillage - TARGET_SILLAGE[a.intensity]);
        const v = Math.max(0, 1 - diff / 3);
        if (v >= 0.8) reasons.push("wear");
        s += 0.2 * v;
      } else s += 0.12;

      // Occasion (15%)
      let occ = 0.6;
      if (a.occasion === "everyday") occ = (p.profile.time.includes("day") ? 0.6 : 0.2) + (p.profile.sillage <= 3 ? 0.4 : 0.1);
      if (a.occasion === "date") occ = (p.profile.time.includes("night") ? 0.6 : 0.2) + (p.profile.families.some((f) => f === "sweet" || f === "spicy") ? 0.4 : 0.15);
      if (a.occasion === "event") occ = (p.profile.longevity >= 4 ? 0.7 : 0.3) + (p.profile.sillage >= 3 ? 0.3 : 0.1);
      if (a.occasion === "gift") occ = p.tags.includes("gift-set") ? 1 : 0.7;
      if (a.occasion && occ >= 0.8) reasons.push(`occasion:${a.occasion}`);
      s += 0.15 * Math.min(1, occ);

      // Budget (20%)
      const price = Number(p.price.amount);
      const [min, max] = BUDGETS[a.budget || "any"];
      const within = price >= min && price <= max;
      const budgetScore = within ? 1 : price > max ? Math.max(0, 1 - (price - max) / max) * 0.5 : 0.6;
      if (within && a.budget && a.budget !== "any") reasons.push("budget");
      s += 0.2 * budgetScore;

      return { p, pct: Math.round(Math.min(98, Math.max(52, s * 100))), reasons };
    })
    .sort((x, y) => y.pct - x.pct);
}

export function Quiz({ products }: { products: ProductSummary[] }) {
  const { t, lp } = useLang();
  const q = t.quiz;
  const [step, setStep] = useState(-1); // -1 = intro, 5 = results
  const [answers, setAnswers] = useState<Answers>({ family: [] });
  const total = 5;

  const topRef = useRef<HTMLDivElement>(null);
  // Bring each new question (and the results) into view, which matters on phones.
  useEffect(() => {
    if (step < 0) return;
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const results = useMemo(() => (step === total ? score(products, answers).slice(0, 3) : []), [step, products, answers]);

  const pick = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const reasonText = (r: string) => {
    const [kind, value] = r.split(":");
    if (kind === "family") return fmt(q.why.family, { family: t.families[value as ScentFamily].name });
    if (kind === "occasion") return fmt(q.why.occasion, { occasion: q.occasionShort[value as Occasion] });
    if (kind === "budget") return q.why.budget;
    return q.why.wear;
  };

  const Option = ({ selected, onClick, children, className = "" }: { selected?: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button type="button" className={`quiz-option ${selected ? "on" : ""} ${className}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );

  if (step === -1) {
    return (
      <div className="quiz-card quiz-intro">
        <p className="lead">{q.intro}</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(0)}>
          {q.start}
        </button>
      </div>
    );
  }

  if (step === total) {
    return (
      <div className="quiz-results" aria-live="polite" ref={topRef}>
        <div className="section-head centered">
          <p className="eyebrow">{q.resultsEyebrow}</p>
          <h2>{q.resultsTitle}</h2>
          {results.length > 0 && results[0].pct < 70 && <p className="muted">{q.none}</p>}
        </div>
        <ProductGrid
          products={results.map((r) => r.p)}
          notes={Object.fromEntries(results.map((r) => [r.p.handle, [fmt(q.match, { n: r.pct }), ...r.reasons.slice(0, 2).map(reasonText)].join(" · ")]))}
        />
        <div className="stack-sm" style={{ justifyContent: "center", marginTop: 28 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setAnswers({ family: [] });
              setStep(0);
            }}
          >
            {q.retake}
          </button>
          <Link href={lp("/collections/all")} className="btn btn-primary">
            {q.shopAll}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card" ref={topRef}>
      <div className="quiz-progress" aria-hidden="true">
        <span style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
      <p className="eyebrow">{fmt(q.step, { n: step + 1, total })}</p>

      {step === 0 && (
        <fieldset>
          <legend className="quiz-q">{q.questions.for.title}</legend>
          <div className="quiz-options">
            {(["men", "women", "unisex"] as Gender[]).map((g) => (
              <Option key={g} selected={answers.for === g} onClick={() => pick("for", g)}>
                {q.questions.for.options[g]}
              </Option>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend className="quiz-q">{q.questions.family.title}</legend>
          <p className="muted">{q.pickUpTo}</p>
          <div className="quiz-options families">
            {FAMILIES.map((f) => {
              const on = answers.family.includes(f);
              return (
                <Option
                  key={f}
                  className={`fam-${f}`}
                  selected={on}
                  onClick={() =>
                    setAnswers((a) => ({
                      ...a,
                      family: on ? a.family.filter((x) => x !== f) : [...a.family, f].slice(-2),
                    }))
                  }
                >
                  <strong>{t.families[f].name}</strong>
                  <span>{t.families[f].body}</span>
                </Option>
              );
            })}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend className="quiz-q">{q.questions.occasion.title}</legend>
          <div className="quiz-options">
            {(Object.keys(q.questions.occasion.options) as Occasion[]).map((o) => (
              <Option key={o} selected={answers.occasion === o} onClick={() => pick("occasion", o)}>
                {q.questions.occasion.options[o]}
              </Option>
            ))}
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="quiz-q">{q.questions.intensity.title}</legend>
          <div className="quiz-options">
            {(Object.keys(q.questions.intensity.options) as Intensity[]).map((i) => (
              <Option key={i} selected={answers.intensity === i} onClick={() => pick("intensity", i)}>
                {q.questions.intensity.options[i]}
              </Option>
            ))}
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend className="quiz-q">{q.questions.budget.title}</legend>
          <div className="quiz-options">
            {(Object.keys(q.questions.budget.options) as Budget[]).map((b) => (
              <Option key={b} selected={answers.budget === b} onClick={() => pick("budget", b)}>
                {q.questions.budget.options[b]}
              </Option>
            ))}
          </div>
        </fieldset>
      )}

      <div className="quiz-nav">
        <button type="button" className="text-btn" onClick={() => setStep((s) => s - 1)}>
          ← {q.back}
        </button>
        {step === 1 && (
          <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
            {q.next}
          </button>
        )}
        {step === total - 1 && answers.budget && (
          <button type="button" className="btn btn-primary" onClick={() => setStep(total)}>
            {q.seeMatches}
          </button>
        )}
      </div>
    </div>
  );
}
