import type { Metadata } from "next";
import { DcfCommonErrors, DcfLessonShell, DcfReviewCheck } from "@/components/DcfLessonShell";
import { EnterpriseToEquityFigure } from "@/components/DcfFigures";
import { calculateDcf, calculateEquityBridge, dcfCase } from "@/data/dcf-series";

const canonical = "https://arsenal23vm-netizen.github.io/financial-modeling-lab/valuation/dcf/enterprise-to-equity";
export const metadata: Metadata = {
  title: "Enterprise ValueからEquity Valueへの調整",
  description: "Enterprise Valueへ現金及び現金同等物を加え、有利子負債、有利子負債類似項目、非支配持分を控除してEquity Valueを計算します。",
  alternates: { canonical },
  openGraph: { title: "Enterprise ValueからEquity Valueへの調整", description: "共有ケースでEnterprise ValueからEquity Valueへの調整を確認する教育用レッスン。", url: canonical, type: "article" },
};

const sections = [{ id: "definition", label: "定義と使う場面" }, { id: "calculation", label: "ステップ計算" }, { id: "excel", label: "Excelセル式" }, { id: "review", label: "エラーとレビュー" }] as const;

export default function EnterpriseToEquityPage() {
  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  return (
    <DcfLessonShell number="05" href="/valuation/dcf/enterprise-to-equity" title="Enterprise ValueからEquity Valueへの調整――現金と負債を確認する" lead="DCFで求めたEnterprise Valueから、現金及び現金同等物、有利子負債、有利子負債類似項目、非支配持分を明示的に調整してEquity Valueへつなぎます。" readingTime="約12分" sections={sections} previous={{ href: "/valuation/dcf/sensitivity-analysis", label: "04 感応度を確認する" }} next={{ href: "/valuation/dcf", label: "DCFシリーズ全体像へ戻る" }}>
      <h2 id="definition">定義と使う場面</h2>
      <p>Enterprise Valueは事業に投下された資本全体の価値、Equity Valueは普通株主に帰属する価値です。DCFでEnterprise Valueを算定した後、評価基準日時点の非事業用現金と債務性項目を調整します。</p>
      <div className="formula">Equity Value = Enterprise Value + 現金及び現金同等物 − 有利子負債 − 有利子負債類似項目 − 非支配持分</div>
      <p>このブリッジでは現金及び現金同等物を加算し、有利子負債、退職給付等の有利子負債類似項目、連結価値のうち普通株主に帰属しない非支配持分を控除します。</p>

      <h2 id="calculation">ステップ計算</h2>
      <ol><li>Enterprise Value：{valuation.enterpriseValue.toFixed(1)} 百万円</li><li>現金及び現金同等物を加算：+ {bridge.cash.toFixed(1)} 百万円</li><li>有利子負債を控除：− {bridge.debt.toFixed(1)} 百万円</li><li>有利子負債類似項目を控除：− {bridge.debtLikeItems.toFixed(1)} 百万円</li><li>非支配持分を控除：− {bridge.nonControllingInterests.toFixed(1)} 百万円</li><li>Equity Value：{bridge.equityValue.toFixed(1)} 百万円</li></ol>
      <p>各調整額は共有ケースの評価基準日時点の残高です。FCFF予測期間の途中の残高や、市場から取得したライブ値ではありません。</p>

      <h2 id="excel">Excelセル式</h2>
      <p>B8=Enterprise Value、B9=現金及び現金同等物、B10=有利子負債、B11=有利子負債類似項目、B12=非支配持分、B13=Equity Valueと置きます。</p>
      <div className="formula">B13: =B8+B9-B10-B11-B12</div>
      <EnterpriseToEquityFigure />

      <h2 id="review">よくあるエラーとレビュー</h2>
      <DcfCommonErrors errors={[{ title: "現金の符号を逆にする", body: "Enterprise Valueには余剰現金を含めないため、Equity Valueへのブリッジでは現金及び現金同等物を加算します。ネット有利子負債を使う場合との二重調整に注意します。" }, { title: "有利子負債以外の債務性項目を落とす", body: "有利子負債だけでなく、対象ケースで株主に帰属しない有利子負債類似項目と非支配持分を個別表示して控除します。" }]} />
      <DcfReviewCheck>Enterprise Value + 現金及び現金同等物 − 有利子負債 − 有利子負債類似項目 − 非支配持分がEquity Valueへ一致し、全項目の基準日と単位が同じであることを確認します。</DcfReviewCheck>
    </DcfLessonShell>
  );
}
