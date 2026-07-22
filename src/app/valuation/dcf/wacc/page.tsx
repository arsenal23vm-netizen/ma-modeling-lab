import type { Metadata } from "next";
import { DcfCommonErrors, DcfLessonShell, DcfReviewCheck } from "@/components/DcfLessonShell";
import { WaccFigure } from "@/components/DcfFigures";
import { calculateWacc, dcfCase } from "@/data/dcf-series";

const canonical = "https://arsenal23vm-netizen.github.io/ma-modeling-lab/valuation/dcf/wacc";
export const metadata: Metadata = {
  title: "WACCの計算方法｜資本コストをExcelで加重する",
  description: "CAPMによる株主資本コスト、税引後負債コスト、目標資本構成からWACCを計算し、永久成長率とのガードを確認します。",
  alternates: { canonical },
  openGraph: { title: "WACCの計算方法｜資本コストをExcelで加重する", description: "共有ケースでWACCの構成、加重、ガードを確認する教育用レッスン。", url: canonical, type: "article" },
};

const sections = [{ id: "definition", label: "定義と使う場面" }, { id: "calculation", label: "ステップ計算" }, { id: "excel", label: "Excelセル式" }, { id: "review", label: "エラーとレビュー" }] as const;

export default function WaccPage() {
  const input = dcfCase.wacc;
  const costOfEquity = input.riskFreeRate + input.beta * input.equityRiskPremium;
  const afterTaxDebtCost = input.preTaxCostOfDebt * (1 - input.taxRate);
  const wacc = calculateWacc(input);
  const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;
  return (
    <DcfLessonShell number="02" href="/valuation/dcf/wacc" title="WACCの計算方法――資本コストを正しく加重する" lead="株主資本コストと税引後負債コストを目標資本構成で加重し、FCFFを現在価値へ変換する割引率を作ります。" readingTime="約12分" sections={sections} previous={{ href: "/valuation/dcf/fcff", label: "01 FCFFを予測する" }} next={{ href: "/valuation/dcf/terminal-value", label: "03 継続価値を計算する" }}>
      <h2 id="definition">定義と使う場面</h2>
      <p>WACC（加重平均資本コスト）は、株主と債権者が求める収益率を資本構成で加重した率です。FCFFは資金提供者全体に帰属するため、その割引にはWACCを使います。</p>
      <div className="formula">WACC = 株主資本構成比 × 株主資本コスト + 負債構成比 × 税引後負債コスト</div>
      <p>このケースの構成比はE {pct(input.equityWeight)}、D {pct(input.debtWeight)}、合計 {pct(input.equityWeight + input.debtWeight)}です。加重は必ず100.0%に整合させます。</p>

      <h2 id="calculation">ステップ計算</h2>
      <ol><li>株主資本コスト：リスクフリーレート {pct(input.riskFreeRate)} + β {input.beta.toFixed(1)} × 株式リスクプレミアム {pct(input.equityRiskPremium)} = {pct(costOfEquity, 2)}</li><li>税引後負債コスト：税引前負債コスト {pct(input.preTaxCostOfDebt)} × (1 − 税率 {pct(input.taxRate)}) = {pct(afterTaxDebtCost, 2)}</li><li>WACC：{pct(input.equityWeight)} × {pct(costOfEquity, 2)} + {pct(input.debtWeight)} × {pct(afterTaxDebtCost, 2)} = {pct(wacc, 2)}</li></ol>
      <div className="callout"><strong>計算条件：WACC &gt; g</strong><br />BaseはWACC {pct(wacc, 2)}、永久成長率 {pct(dcfCase.terminalGrowthRate)}です。WACCがg以下なら永久成長法の分母がゼロ以下になるため計算せず「該当なし」とします。</div>

      <h2 id="excel">Excelセル式</h2>
      <p>B8=株主資本コスト、B9=税引後負債コスト、B11=株主資本構成比、B12=負債構成比、B13=WACCと置きます。</p>
      <div className="formula">B13: =B8*B11+B9*B12</div>
      <WaccFigure />

      <h2 id="review">よくあるエラーとレビュー</h2>
      <DcfCommonErrors errors={[{ title: "税引前負債コストをそのまま使う", body: "FCFFのWACCでは利息の税効果を反映し、税引前負債コスト × (1 − 税率)へ変換します。" }, { title: "構成比が100%にならない", body: "株主資本と有利子負債の構成比について分母・評価時点をそろえ、加重合計が100.0%になることをチェックで確認します。" }]} />
      <DcfReviewCheck>株主資本{pct(input.equityWeight)}と負債{pct(input.debtWeight)}の合計が{pct(input.equityWeight + input.debtWeight)}、再計算WACCが{pct(wacc, 2)}、かつWACC &gt; gであることを同じチェック行で確認します。</DcfReviewCheck>
    </DcfLessonShell>
  );
}
