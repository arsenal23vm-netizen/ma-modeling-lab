import type { Metadata } from "next"; import "./globals.css"; import { SiteHeader } from "@/components/site-header"; import { SiteFooter } from "@/components/site-footer"; import { siteDescription,siteName } from "@/lib/seo";
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??"https://arsenal23vm-netizen.github.io/ma-modeling-lab";
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:siteName,template:`%s | ${siteName}`},description:siteDescription,openGraph:{type:"website",locale:"ja_JP",siteName,title:siteName,description:siteDescription}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>}
