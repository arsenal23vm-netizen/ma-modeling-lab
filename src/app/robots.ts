import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arsenal23vm-netizen.github.io/ma-modeling-lab";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
