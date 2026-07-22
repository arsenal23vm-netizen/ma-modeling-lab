import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

const canonical = "https://arsenal23vm-netizen.github.io/ma-modeling-lab/ma-modeling";
const title = "M&Aモデリング";
const description = "買収案件の分析、類似会社選定、モデルレビューに必要なM&Aモデリングの学習順序を案内します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
};

export default function MaModelingPage() {
  return <TopicHub topic="ma-modeling" eyebrow="M&Aモデリング" title="M&Aモデリングを、意思決定に使える形へ" lead="取引の前提、事業計画、Valuation、レビュー観点をつなげて、案件の論点を説明できるモデルを目指します。公開済みの内容から段階的に進められます。" learningSteps={["案件の論点と必要な前提を整理する", "比較対象とValuationの根拠を確認する", "レビュー観点を使って意思決定資料を磨く"]} />;
}
