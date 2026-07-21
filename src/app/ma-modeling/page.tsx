import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

export const metadata: Metadata = {
  title: "M&Aモデリング | Finance Modeling Lab",
  description: "買収案件の分析、類似会社選定、モデルレビューに必要なM&Aモデリングの学習順序を案内します。",
};

export default function MaModelingPage() {
  return <TopicHub topic="ma-modeling" eyebrow="M&A MODELING" title="M&Aモデリングを、意思決定に使える形へ" lead="取引の前提、事業計画、価値評価、レビュー観点をつなげて、案件の論点を説明できるモデルを目指します。公開済みの内容から段階的に進められます。" learningSteps={["案件の論点と必要な前提を整理する", "比較対象と価値評価の根拠を確認する", "レビュー観点を使って意思決定資料を磨く"]} />;
}
