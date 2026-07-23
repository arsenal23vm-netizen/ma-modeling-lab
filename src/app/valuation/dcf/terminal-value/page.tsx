import type { Metadata } from "next";
import { DcfCommonErrors, DcfLessonShell, DcfReviewCheck } from "@/components/DcfLessonShell";
import { TerminalValueFigure } from "@/components/DcfFigures";
import { calculateDcf, calculateFcff, dcfCase } from "@/data/dcf-series";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/valuation/dcf/terminal-value";
export const metadata: Metadata = {
  title: "継続価値の計算方法｜継続価値と構成比を検証する",
  description: "永久成長法でFCFF(n+1)、WACC、永久成長率から継続価値を計算し、期末割引とEnterprise Valueに占める比率を確認します。",
  alternates: { canonical },
  openGraph: { title: "継続価値の計算方法｜継続価値と構成比を検証する", description: "共有ケースで継続価値と価値集中を確認する教育用レッスン。", url: canonical, type: "article" },
};

const sections = [{ id: "definition", label: "定義と使う場面" }, { id: "calculation", label: "ステップ計算" }, { id: "excel", label: "Excelセル式" }, { id: "review", label: "エラーとレビュー" }] as const;

export default function TerminalValuePage() {
  const valuation = calculateDcf(dcfCase);
  const finalFcff = calculateFcff(dcfCase.forecasts.at(-1)!);
  const nextFcff = finalFcff * (1 + dcfCase.terminalGrowthRate);
  const terminalShare = valuation.pvTerminalValue / valuation.enterpriseValue;
  return (
    <DcfLessonShell number="03" href="/valuation/dcf/terminal-value" title="継続価値の計算方法――前提と構成比を検証する" lead="明示予測期間後のFCFFを永久成長法で価値へ変換し、期末時点、割引、Enterprise Valueへの集中度を確認します。" readingTime="約12分" sections={sections} previous={{ href: "/valuation/dcf/wacc", label: "02 WACCを計算する" }} next={{ href: "/valuation/dcf/sensitivity-analysis", label: "04 感応度を確認する" }}>
      <h2 id="definition">定義と使う場面</h2>
      <p>継続価値は、明示予測期間後に事業が生むFCFFの価値です。永久成長法は、最終予測年の翌年FCFFが一定率gで永久に成長すると仮定します。</p>
      <div className="formula">継続価値 = FCFF(n+1) / (WACC − g)</div>
      <p>出口マルチプル法は補助的な照合に使えますが、Baseの算定は共有ケースの永久成長法だけを使い、外部の最新市場マルチプルは使いません。</p>

      <h2 id="calculation">ステップ計算</h2>
      <ol><li>2030年度FCFF：{finalFcff.toFixed(1)} 百万円</li><li>FCFF(n+1)：{finalFcff.toFixed(1)} × (1 + {(dcfCase.terminalGrowthRate * 100).toFixed(1)}%) = {nextFcff.toFixed(1)} 百万円</li><li>継続価値：{nextFcff.toFixed(1)} ÷ ({(valuation.wacc * 100).toFixed(2)}% − {(dcfCase.terminalGrowthRate * 100).toFixed(1)}%) = {valuation.terminalValue.toFixed(1)} 百万円</li><li>2030年度末時点の継続価値を5期間割り引き、現在価値は{valuation.pvTerminalValue.toFixed(1)} 百万円です。</li></ol>
      <div className="callout"><strong>継続価値の構成比：{(terminalShare * 100).toFixed(1)}%</strong><br />Enterprise Value {valuation.enterpriseValue.toFixed(1)} 百万円のうち継続価値の現在価値が占める割合です。比率が大きいほどWACCとgの小さな変更が評価へ強く効きます。</div>

      <h2 id="excel">Excelセル式</h2>
      <p>B8=2030年度FCFF、B9=永久成長率、B10=WACC、B11=継続価値と置きます。</p>
      <div className="formula">B11: =IF(B10&lt;=B9,NA(),B8*(1+B9)/(B10-B9))</div>
      <TerminalValueFigure />

      <h2 id="review">よくあるエラーとレビュー</h2>
      <DcfCommonErrors errors={[{ title: "FCFF(n)を分子に使う", body: "継続価値は予測期間後の価値なので、最終年FCFFではなくFCFF(n) × (1+g)で求める翌年FCFFを使います。" }, { title: "期末価値を現在価値と混同する", body: "継続価値は2030年度末時点です。Enterprise Valueへ足す前に明示予測期間と同じWACCで現在価値へ割り引きます。" }]} />
      <DcfReviewCheck>WACCがgを上回り、継続価値の現在価値と明示予測FCFFの現在価値の合計がEnterprise Valueに一致し、構成比が説明されているか確認します。</DcfReviewCheck>
    </DcfLessonShell>
  );
}
