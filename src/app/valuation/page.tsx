import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

export const metadata: Metadata = {
  title: "企業価値評価（Valuation） | Finance Modeling Lab",
  description: "企業価値から株主価値まで、DCFと類似会社比較法を使ったValuationの考え方と教材を案内します。",
};

export default function ValuationPage() {
  return <TopicHub topic="valuation" eyebrow="VALUATION" title="企業価値評価を、前提から説明できる形へ" lead="評価手法の暗記ではなく、事業計画、比較対象、資本コストが価値にどうつながるかを整理します。DCFとCompsを使い分ける土台を作りましょう。" learningSteps={["EVと株主価値の違いを理解する", "比較対象とマルチプルの前提を検証する", "DCFの前提を感応度とともに説明する"]} />;
}
