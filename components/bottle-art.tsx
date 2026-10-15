// Illustrated bottle used for products that have no photo yet (demo mode, or a
// Shopify product without images). Styled after the Huele Rico! square flacon.

type Props = {
  vendor: string;
  title: string;
  liquid?: string;
  cap?: string;
  label?: string;
  className?: string;
};

function initials(name: string) {
  const words = name.replace(/&/g, " & ").replace(/[^A-Za-zÀ-ÿ& ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 8).toUpperCase();
  return words
    .filter((w) => w !== "&")
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function BottleArt({ vendor, title, liquid = "#4c234e", cap = "#c89c52", label = "#f5efe7", className }: Props) {
  const id = `b${Math.abs(hash(vendor + title)).toString(36)}`;
  const mark = initials(vendor) || "HR";
  const markSize = mark.length <= 3 ? 30 : Math.max(13, Math.floor(150 / mark.length));
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={`${vendor} ${title} bottle illustration`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efe6da" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={liquid} stopOpacity=".95" />
          <stop offset=".45" stopColor={liquid} stopOpacity=".72" />
          <stop offset="1" stopColor={liquid} stopOpacity=".98" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={cap} />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor={cap} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      {/* scent wave */}
      <path d="M-10 120 C 90 60, 160 180, 260 110 S 380 60, 420 100" stroke="#cfc5d8" strokeWidth="2" fill="none" opacity=".7" />
      <path d="M-10 150 C 100 100, 170 210, 270 140 S 380 100, 420 130" stroke="#d6c2c7" strokeWidth="1.5" fill="none" opacity=".6" />
      {/* surface shadow */}
      <ellipse cx="200" cy="432" rx="120" ry="14" fill="#2e2b2f" opacity=".12" />
      {/* cap */}
      <rect x="160" y="128" width="80" height="56" rx="4" fill={`url(#${id}-cap)`} />
      <rect x="170" y="184" width="60" height="22" fill={cap} opacity=".85" />
      {/* bottle */}
      <rect x="106" y="204" width="188" height="226" rx="18" fill={`url(#${id}-glass)`} />
      <rect x="114" y="212" width="18" height="210" rx="9" fill="#fff" opacity=".18" />
      {/* label */}
      <rect x="146" y="252" width="108" height="128" rx="3" fill="none" stroke={label} strokeWidth="2" opacity=".9" />
      <path
        d="M200 268c3 3.6 3.4 7.2 1.6 10.8 3.6-1.6 7.4-1.1 10.8 1.8-3.4 2.9-7.2 3.4-10.8 1.8 1.8 3.6 1.4 7.2-1.6 10.8-3-3.6-3.4-7.2-1.6-10.8-3.6 1.6-7.4 1.1-10.8-1.8 3.4-2.9 7.2-3.4 10.8-1.8-1.8-3.6-1.4-7.2 1.6-10.8z"
        fill={label}
        opacity=".9"
      />
      <text
        x="200"
        y="333"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={markSize}
        fill={label}
        letterSpacing={mark.length <= 3 ? 2 : 1}
      >
        {mark}
      </text>
      <text x="200" y="360" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill={label} letterSpacing="3" opacity=".85">
        AUTHENTIC
      </text>
    </svg>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
