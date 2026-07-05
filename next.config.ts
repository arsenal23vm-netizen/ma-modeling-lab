import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH ?? "",
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: { unoptimized: true },
};

export default nextConfig;
