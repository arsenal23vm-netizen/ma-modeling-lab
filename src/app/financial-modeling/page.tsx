import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

const canonical = "https://arsenal23vm-netizen.github.io/ma-modeling-lab/financial-modeling";
const title = "財務モデリング";
const description = "財務三表、事業計画、モデル設計を実務で使える順番で学ぶ財務モデリングの案内ページです。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
};

export default function FinancialModelingPage() {
  return <TopicHub topic="financial-modeling" eyebrow="FINANCIAL MODELING" title="財務モデリングを、構造から組み立てる" lead="入力・計算・出力を分け、財務三表が一貫して連動するモデルへ。基礎から品質レビューまでを、実務で再利用できる順番で学びます。" learningSteps={["モデル設計と前提条件の置き場所を理解する", "売上ドライバーと財務三表をつなげる", "チェックとレビューでモデルの品質を確かめる"]} />;
}
