import Link from "next/link";

export function Logo({ asLink = true }: { asLink?: boolean }) {
  const inner = (
    <>
      <span className="logo-word">
        Huele Rico<span className="logo-bang">!</span>
      </span>
      <span className="logo-sub">FRAGRANCES</span>
    </>
  );
  return asLink ? (
    <Link href="/" className="logo" aria-label="Huele Rico! Fragrances — home">
      {inner}
    </Link>
  ) : (
    <span className="logo">{inner}</span>
  );
}
