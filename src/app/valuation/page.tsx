import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

const canonical = "https://arsenal23vm-netizen.github.io/financial-modeling-lab/valuation";
const title = "Valuation";
const description = "企業価値から株主価値まで、DCFと類似会社比較法を使ったValuationの考え方と教材を案内します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
};

export default function ValuationPage() {
  return <TopicHub topic="valuation" eyebrow="Valuation" title="Valuationを、前提から説明できる形へ" lead="評価手法の暗記ではなく、事業計画、比較対象、資本コストが価値にどうつながるかを整理します。DCFと類似会社比較を使い分ける土台を作りましょう。" learningSteps={["Enterprise ValueとEquity Valueの違いを理解する", "比較対象とマルチプルの前提を検証する", "DCFの前提を感応度とともに説明する"]} />;
}
