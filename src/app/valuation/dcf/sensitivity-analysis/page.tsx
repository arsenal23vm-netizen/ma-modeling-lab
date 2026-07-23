import type { Metadata } from "next";
import { DcfCommonErrors, DcfLessonShell, DcfReviewCheck } from "@/components/DcfLessonShell";
import { SensitivityFigure } from "@/components/DcfFigures";
import { buildSensitivityMatrix, calculateDcf, dcfCase } from "@/data/dcf-series";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/valuation/dcf/sensitivity-analysis";
export const metadata: Metadata = {
  title: "DCF感応度分析の作り方｜WACC×永久成長率をExcelで検証",
  description: "WACCを行、永久成長率を列にしたDCF感応度表を作り、企業価値の方向性とWACCがg以下の無効セルを確認します。",
  alternates: { canonical },
  openGraph: { title: "DCF感応度分析の作り方｜WACC×永久成長率をExcelで検証", description: "共有ケースで5×5感応度表と入力ガードを確認する教育用レッスン。", url: canonical, type: "article" },
};

const sections = [{ id: "definition", label: "定義と使う場面" }, { id: "calculation", label: "ステップ計算" }, { id: "excel", label: "Excelセル式" }, { id: "review", label: "エラーとレビュー" }] as const;

export default function SensitivityAnalysisPage() {
  const valuation = calculateDcf(dcfCase);
  const matrix = buildSensitivityMatrix(dcfCase);
  const lowWacc = dcfCase.sensitivity.waccRates[0];
  const highWacc = dcfCase.sensitivity.waccRates.at(-1)!;
  const lowGrowth = dcfCase.sensitivity.terminalGrowthRates[0];
  const highGrowth = dcfCase.sensitivity.terminalGrowthRates.at(-1)!;
  const lowWaccLowGrowth = matrix[0].cells[0].enterpriseValue!;
  const lowWaccHighGrowth = matrix[0].cells.at(-1)!.enterpriseValue!;
  const highWaccLowGrowth = matrix.at(-1)!.cells[0].enterpriseValue!;
  return (
    <DcfLessonShell number="04" href="/valuation/dcf/sensitivity-analysis" title="DCF感応度分析の作り方――WACCと永久成長率を並べる" lead="単一の評価額を答えにせず、WACCと永久成長率の組合せがEnterprise Valueへ与える影響を5×5表で確認します。" readingTime="約12分" sections={sections} previous={{ href: "/valuation/dcf/terminal-value", label: "03 継続価値を計算する" }} next={{ href: "/valuation/dcf/enterprise-to-equity", label: "05 Enterprise ValueをEquity Valueへつなぐ" }}>
      <h2 id="definition">定義と使う場面</h2>
      <p>感応度分析は、重要な評価前提を一定幅で動かし、結論がどこまで変わるかを確認するレビュー手続です。このケースではWACCを行、永久成長率を列に置きます。</p>
      <div className="formula">WACC × 永久成長率</div>
      <p>WACCが上がるとEnterprise Valueは下がり、永久成長率が上がるとEnterprise Valueは上がります。表の上下左右がこの方向性と反対なら、データテーブルの行入力セル・列入力セルまたは参照先を確認します。</p>

      <h2 id="calculation">ステップ計算</h2>
      <ol><li>基準ケース：WACC {(valuation.wacc * 100).toFixed(2)}%、g {(dcfCase.terminalGrowthRate * 100).toFixed(1)}%、Enterprise Value {valuation.enterpriseValue.toFixed(1)} 百万円</li><li>WACC {(lowWacc * 100).toFixed(1)}% / g {(lowGrowth * 100).toFixed(1)}%：{lowWaccLowGrowth.toFixed(1)} 百万円</li><li>同じWACCでgを{(highGrowth * 100).toFixed(1)}%へ上げる：{lowWaccHighGrowth.toFixed(1)} 百万円</li><li>g {(lowGrowth * 100).toFixed(1)}%のままWACCを{(highWacc * 100).toFixed(1)}%へ上げる：{highWaccLowGrowth.toFixed(1)} 百万円</li></ol>
      <div className="callout"><strong>無効セルのガード</strong><br />各セルでWACC &gt; gを確認し、WACC ≤ gなら計算結果を表示せず該当なしにします。エラー値や極端な正数を評価レンジに混ぜません。</div>

      <h2 id="excel">Excelセル式</h2>
      <p>B3=モデルのWACC入力、B4=永久成長率入力、B6=Enterprise Value出力とし、感応度表の左上セルへ =$B$6、行入力セルへ$B$4、列入力セルへ$B$3を指定します。</p>
      <p>データテーブルの左上セルは、WACC ≤ gでNA()を返す計算条件を組み込んだEnterprise Value出力を参照します。</p>
      <div className="formula">B10: =$B$6 ／ データテーブル: =TABLE($B$4,$B$3)</div>
      <SensitivityFigure />

      <h2 id="review">よくあるエラーとレビュー</h2>
      <DcfCommonErrors errors={[{ title: "行・列の入力セルを逆にする", body: "上段のgは行入力セル、左列のWACCは列入力セルへ対応させます。逆にすると方向性チェックで異常が見つかります。" }, { title: "WACC ≤ gを数値表示する", body: "永久成長法の分母がゼロ以下のセルは経済的に解釈できません。IF式で該当なしとし、評価レンジから除外します。" }]} />
      <DcfReviewCheck>右方向へ移動すると企業価値が上がり、下方向へ移動すると下がること、全25セルの単位が百万円で、無効条件が該当なしになることを確認します。</DcfReviewCheck>
    </DcfLessonShell>
  );
}
