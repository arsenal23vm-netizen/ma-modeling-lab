import type { Metadata } from "next";
import { DcfCommonErrors, DcfLessonShell, DcfReviewCheck } from "@/components/DcfLessonShell";
import { FcffFigure } from "@/components/DcfFigures";
import { calculateFcff, dcfCase } from "@/data/dcf-series";

const canonical = "https://arsenal23vm-netizen.github.io/ma-modeling-lab/valuation/dcf/fcff";
export const metadata: Metadata = {
  title: "FCFFの計算方法｜EBITからExcelで作る5年予測",
  description: "EBIT、税率、D&A、Capex、運転資本増加からFCFFを計算し、FY2026–FY2030予測をExcelセル式へ落とし込みます。",
  alternates: { canonical },
  openGraph: { title: "FCFFの計算方法｜EBITからExcelで作る5年予測", description: "共有ケースでFCFFの符号とExcel式を確認する教育用レッスン。", url: canonical, type: "article" },
};

const sections = [{ id: "definition", label: "定義と使う場面" }, { id: "calculation", label: "ステップ計算" }, { id: "excel", label: "Excelセル式" }, { id: "review", label: "エラーとレビュー" }] as const;

export default function FcffPage() {
  const row = dcfCase.forecasts[0];
  const nopat = row.ebit * (1 - row.taxRate);
  const fcff = calculateFcff(row);
  return (
    <DcfLessonShell number="01" href="/valuation/dcf/fcff" title="FCFFの計算方法――EBITから5年予測を作る" lead="営業利益を税引後にし、非資金費用、設備投資、運転資本増加を同じ符号ルールでつないで事業のフリーキャッシュフローを求めます。" readingTime="約12分" sections={sections} previous={{ href: "/valuation/dcf", label: "DCFシリーズ全体像" }} next={{ href: "/valuation/dcf/wacc", label: "02 WACCを計算する" }}>
      <h2 id="definition">定義と使う場面</h2>
      <p>FCFF（Free Cash Flow to Firm）は、借入金の利払い・返済前に事業が株主と債権者の双方へ生み出すキャッシュフローです。DCFでは各予測年度末のFCFFをWACCで現在価値へ割り引き、Enterprise Valueを求めるときに使います。</p>
      <div className="formula">FCFF = EBIT × (1 − Tax Rate) + D&amp;A − Capex − Increase in NWC</div>
      <p>D&amp;Aは非資金費用のため加算し、CapexとIncrease in NWCはキャッシュの使用なので控除します。表示上も控除項目を括弧書きにし、符号を曖昧にしません。</p>

      <h2 id="calculation">ステップ計算</h2>
      <ol><li>NOPAT：{row.ebit.toFixed(1)} 百万円 × (1 − {(row.taxRate * 100).toFixed(1)}%) = {nopat.toFixed(1)} 百万円</li><li>非資金費用を戻す：{nopat.toFixed(1)} + D&amp;A {row.depreciation.toFixed(1)} = {(nopat + row.depreciation).toFixed(1)} 百万円</li><li>投資支出を控除：− Capex {row.capex.toFixed(1)} − Increase in NWC {row.increaseInNwc.toFixed(1)} 百万円</li><li>FY2026 FCFF：{fcff.toFixed(1)} 百万円</li></ol>
      <p>以後も同じ式をFY2030まで横展開し、期間の途中ではなく各年度末にFCFFが発生するPeriod-end conventionを採用します。</p>

      <h2 id="excel">Excelセル式</h2>
      <p>列BをFY2026とし、B8=EBIT、B9=Tax Rate、B10=D&amp;A、B11=Capex、B12=Increase in NWC、B13=FCFFと置きます。</p>
      <div className="formula">B13: =B8*(1-B9)+B10-B11-B12</div>
      <FcffFigure />

      <h2 id="review">よくあるエラーとレビュー</h2>
      <DcfCommonErrors errors={[{ title: "D&Aを二重に控除する", body: "EBITにはD&Aが費用として含まれるため、NOPAT後は足し戻します。控除するとFCFFを過小評価します。" }, { title: "NWCの残高を控除する", body: "使うのは運転資本の残高ではなく当期の増加額です。NWCが減少した年はFCFFへのプラスになります。" }]} />
      <DcfReviewCheck>FY2026からFY2030まで、FCFF = NOPAT + D&amp;A − Capex − Increase in NWC が各列で再計算値と一致し、控除項目の符号が一貫しているか確認します。</DcfReviewCheck>
    </DcfLessonShell>
  );
}
