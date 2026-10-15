/** "HR!" monogram seal with circular "Huele Rico! · Fragrances" lettering. */
export function Seal({ className, dark = true }: { className?: string; dark?: boolean }) {
  const bg = dark ? "#4c234e" : "transparent";
  const fg = dark ? "#c89c52" : "#4c234e";
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Huele Rico! Fragrances authenticity seal">
      <defs>
        <path id="seal-top" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="seal-bottom" d="M 36 106 A 64 64 0 0 0 164 106" />
      </defs>
      <circle cx="100" cy="100" r="96" fill={bg} />
      <circle cx="100" cy="100" r="88" fill="none" stroke={fg} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="58" fill="none" stroke={fg} strokeWidth="0.8" opacity=".6" />
      <text fontFamily="Georgia, serif" fontSize="16" letterSpacing="5" fill={fg}>
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          HUELE RICO!
        </textPath>
      </text>
      <text fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="5" fill={fg}>
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          FRAGRANCES
        </textPath>
      </text>
      <text x="100" y="118" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="50" fill={fg}>
        HR
        <tspan fill="#c89c52" fontStyle="italic">!</tspan>
      </text>
      <text x="38" y="106" fontSize="10" fill={fg} textAnchor="middle">✦</text>
      <text x="162" y="106" fontSize="10" fill={fg} textAnchor="middle">✦</text>
    </svg>
  );
}
