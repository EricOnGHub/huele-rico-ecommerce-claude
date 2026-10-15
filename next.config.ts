import type { NextConfig } from "next";

// The site is exported as static files (the `out/` folder) so it can be hosted
// on GitHub Pages, or any static host. NEXT_PUBLIC_BASE_PATH is set by the
// GitHub Pages workflow when the site lives in a sub-folder.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
