import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

export const metadata: Metadata = {
  title: "Excel教材・テンプレート | Finance Modeling Lab",
  description: "仕訳から財務三表、Comps、モデル品質チェックまで、財務モデリング学習用のExcel教材をまとめています。",
};

export default function ExcelTemplatesPage() {
  return <TopicHub topic="excel" eyebrow="EXCEL TEMPLATES" title="Excel教材で、手を動かして理解する" lead="読むだけで終わらせず、前提の入力、三表の連動、チェックの流れをExcelで確かめます。基礎演習から完成モデルまで、難易度に沿って選べます。" learningSteps={["基礎演習で仕訳と前提条件の流れをつかむ", "PL・BS・CFを連動させる練習をする", "完成モデルとチェックリストで仕上げる"]} />;
}
