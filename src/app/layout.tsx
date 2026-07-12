import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://arsenal23vm-netizen.github.io/ma-modeling-lab/"),
  title: { default: "Finance Modeling Lab", template: "%s | Finance Modeling Lab" },
  description: "非上場企業のM&A財務モデリングを、設計思想からExcel実装まで体系的に学ぶ実務メディア。",
  keywords: ["M&A", "財務モデリング", "Excel", "企業価値評価", "財務三表"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Finance Modeling Lab",
    title: "Finance Modeling Lab",
    description: "非上場企業のM&A財務モデリングを、設計思想からExcel実装まで体系的に学ぶ実務メディア。",
    url: "https://arsenal23vm-netizen.github.io/ma-modeling-lab/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body><Analytics/><a className="skip-link" href="#main-content">本文へスキップ</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/></body></html>;
}
