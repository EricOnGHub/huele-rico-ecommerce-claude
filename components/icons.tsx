// Line icons drawn to match the brand board's iconography (thin stroke, rounded joins).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

/** Four-petal floral ornament from the logo. */
export const Ornament = (p: P) => (
  <svg {...base(p)} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2c1.6 2 1.9 4 .9 6 2-.9 4.1-.6 6 1-1.9 1.6-4 1.9-6 1 1 2 .7 4-.9 6-1.6-2-1.9-4-.9-6-2 .9-4.1.6-6-1 1.9-1.6 4-1.9 6-1-1-2-.7-4 .9-6z" />
    <circle cx="12" cy="12" r="1.1" />
    <path d="M12 17.5c.5 1.4.5 2.9 0 4.5-.5-1.6-.5-3.1 0-4.5z" />
  </svg>
);

export const Bag = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 8h14l-1 12.2a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8L5 8z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Chevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const Shield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);

export const Truck = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7" />
    <circle cx="7" cy="17.5" r="1.7" />
    <circle cx="17.5" cy="17.5" r="1.7" />
  </svg>
);

export const Diamond = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 4h12l3 5-9 11L3 9l3-5z" />
    <path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5" />
  </svg>
);

export const Gift = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="8.5" width="17" height="4" rx=".5" />
    <path d="M5 12.5V20h14v-7.5M12 8.5V20" />
    <path d="M12 8.5S10.5 4 8 4.5c-2 .4-1.6 3.6 1 4M12 8.5S13.5 4 16 4.5c2 .4 1.6 3.6-1 4" />
  </svg>
);

export const Globe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5S9.6 6.1 12 3.5z" />
  </svg>
);

export const Heart = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  </svg>
);

export const Return = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="m8 5-4 4 4 4" />
  </svg>
);

export const Lock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const BottleIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="2.5" width="6" height="3.5" rx=".6" />
    <path d="M10 6v2M14 6v2" />
    <rect x="5" y="8" width="14" height="13.5" rx="2.5" />
    <path d="M12 12.2c.6.8.7 1.6.3 2.4.8-.4 1.6-.3 2.4.3-.8.6-1.6.7-2.4.3.4.8.3 1.6-.3 2.4-.6-.8-.7-1.6-.3-2.4-.8.4-1.6.3-2.4-.3.8-.6 1.6-.7 2.4-.3-.4-.8-.3-1.6.3-2.4z" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r=".8" fill="currentColor" />
  </svg>
);

export const TikTok = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3" />
    <path d="M14 3.5c.4 2.6 2.2 4.4 5 4.6" />
  </svg>
);

export const Facebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 8H16V4.5h-2.2C11.4 4.5 10 6 10 8.5V11H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.6.4-1 1-1z" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);

export const Star = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />
  </svg>
);
