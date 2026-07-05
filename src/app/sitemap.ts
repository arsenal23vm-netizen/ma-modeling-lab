import type { MetadataRoute } from "next"; import { shops } from "@/data/shops"; import { wards } from "@/data/wards";
export const dynamic="force-static";
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL??"https://arsenal23vm-netizen.github.io/ma-modeling-lab";const paths=["","/submit",...shops.map(s=>`/shops/${s.slug}`),...wards.map(w=>`/osaka/${w.slug}`)];return paths.map(path=>({url:base+path,lastModified:new Date(),changeFrequency:"monthly" as const,priority:path===""?1:.7}))}
