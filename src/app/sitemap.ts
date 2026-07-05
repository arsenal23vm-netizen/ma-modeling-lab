import type { MetadataRoute } from "next"; import { lessons } from "@/data/site";
export const dynamic = "force-static";
export default function sitemap():MetadataRoute.Sitemap{const base="https://arsenal23vm-netizen.github.io/ma-modeling-lab";return ["","/tools","/disclaimer",...lessons.map(x=>`/${x.slug}`)].map(url=>({url:base+url,lastModified:new Date(),changeFrequency:"monthly" as const,priority:url===""?1:.8}))}
