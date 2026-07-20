import type { MetadataRoute } from "next";
import { lessons } from "@/data/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arsenal23vm-netizen.github.io/ma-modeling-lab";
const lastModified = new Date("2026-07-11T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/learning-roadmap", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/journal-lab", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/quality-standard", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/downloads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/private-company-valuation", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/comps-peer-selection", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/books", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/request", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/editorial-policy", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    ...lessons.map((lesson) => ({
      path: `/${lesson.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
  ];

  return paths.map((item) => ({
    url: `${base}${item.path}`,
    lastModified: item.path === "/comps-peer-selection" ? new Date("2026-07-20T00:00:00+09:00") : lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
