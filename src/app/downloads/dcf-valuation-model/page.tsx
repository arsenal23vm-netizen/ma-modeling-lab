import type { Metadata } from "next";
import Link from "next/link";
import { DcfWorkbookPreview } from "@/components/DcfWorkbookPreview";
import { calculateDcf, calculateEquityBridge, calculateWacc, dcfCase } from "@/data/dcf-series";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/downloads/dcf-valuation-model";
const workbookHref = "/downloads/06_DCF評価モデル.xlsx";

export const metadata: Metadata = {
  title: "DCF評価モデル Excel教材｜9シートの使い方とチェック",
  description: "FCFF、WACC、継続価値、感応度、Enterprise ValueからEquity Valueへの調整を数式で追える標準準拠の9シートDCF Excel教材です。",
  alternates: { canonical },
  openGraph: {
    title: "DCF評価モデル Excel教材｜9シートの使い方とチェック",
    description: "共有DCFケースを使い、青セル入力からEnterprise Value・Equity Valueとチェックまで確認する教育用Excelモデル。",
    url: canonical,
    type: "website",
  },
};

const sheetRoles = [
  ["表紙", "計算の完全性と意思決定準備状況を分けて表示"],
  ["入力", "5年予測、資本コスト、Enterprise ValueからEquity Valueへの調整項目を青セルへ入力"],
  ["前提", "期末割引、WACC、永久成長率を集約"],
  ["PL", "売上高、EBIT、税率、税引後営業利益を予測"],
  ["BS", "現金及び現金同等物、有利子負債、有利子負債類似項目、非支配株主持分を確認"],
  ["CF", "EBITからFCFFを数式で計算"],
  ["計算明細", "減価償却費、設備投資、運転資本増加、割引係数を展開"],
  ["DCF", "継続価値、Enterprise Value、Equity Value、5×5感応度を出力"],
  ["チェック", "資本構成、WACC計算条件、Equity Valueへの調整、数式エラーを検証"],
] as const;

const lessons = [
  ["FCFF", "EBIT × (1 − 税率) + 減価償却費 − 設備投資 − 運転資本増加", "/valuation/dcf/fcff"],
  ["WACC", "株主資本構成比 × 株主資本コスト + 負債構成比 × 税引後負債コスト", "/valuation/dcf/wacc"],
  ["継続価値", "IF(WACC<=g,NA(),FCFF(n+1)/(WACC−g))", "/valuation/dcf/terminal-value"],
  ["感応度分析", "5×5 WACC × 永久成長率", "/valuation/dcf/sensitivity-analysis"],
  ["Enterprise ValueからEquity Valueへの調整", "Enterprise Value + 現金及び現金同等物 − 有利子負債 − 有利子負債類似項目 − 非支配持分", "/valuation/dcf/enterprise-to-equity"],
] as const;

export default function DcfWorkbookLandingPage() {
  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const wacc = calculateWacc(dcfCase.wacc);

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-12 md:py-16">
          <nav className="mb-5 text-sm text-[#607080]" aria-label="パンくずリスト"><Link href="/">ホーム</Link><span aria-hidden="true"> / </span><Link href="/downloads">ダウンロード</Link><span aria-hidden="true"> / </span><span>DCF評価モデル</span></nav>
          <div className="eyebrow">標準形式のExcel教材</div>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold leading-tight tracking-[-.04em] text-[#102235] md:text-6xl">DCF評価モデルを、入力からチェックまで一つのExcelで追う</h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">サンプル部品株式会社の2026年度から2030年度までの予測を使い、FCFF、WACC、継続価値、Enterprise Value、Equity Valueを数式で接続した教育用ワークブックです。</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={workbookHref} className="button green" download>Excelをダウンロード</Link>
            <a href="#workbook-guide" className="button secondary">使い方を確認する</a>
          </div>
          <p className="mt-4 text-sm text-[#607080]">計算整合性：適合 ／ 意思決定への利用可否：教育用サンプル・出所確認が必要</p>
        </div>
      </section>

      <div id="workbook-guide" className="container scroll-mt-24 py-12 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]" aria-labelledby="audience-title">
          <div><div className="eyebrow">対象読者と到達点</div><h2 id="audience-title" className="section-title mt-2">対象読者と到達点</h2><p className="mt-4 text-[#607080]">三表モデルからDCFへ進む方、評価数式の参照関係をレビューしたい方、感応度とEnterprise ValueからEquity Valueへの調整を同じファイルで練習したい方を対象にしています。</p><p className="mt-3 text-[#607080]">入力セルと計算セルを区別し、WACC {(wacc * 100).toFixed(2)}%、Enterprise Value {valuation.enterpriseValue.toFixed(1)}百万円、Equity Value {bridge.equityValue.toFixed(1)}百万円へ至る参照を追えることが到達点です。</p></div>
          <div className="dcf-model-status"><strong>このファイルで確認できること</strong><ul><li>各予測年度末に割り引く期末割引</li><li>WACC &gt; gという継続価値の計算条件</li><li>WACC低下・g上昇で価値が上がる5×5感応度</li><li>計算整合性と意思決定への利用可否の区別</li></ul></div>
        </section>

        <section className="mt-16" aria-labelledby="sheet-roles"><div className="eyebrow">シート構成</div><h2 id="sheet-roles" className="section-title mt-2">シート構成：9つの役割</h2><div className="dcf-sheet-role-grid mt-6">{sheetRoles.map(([name, role], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{role}</p></article>)}</div></section>

        <section className="mt-16" aria-labelledby="preview-title"><div className="eyebrow">Excel作成イメージ</div><h2 id="preview-title" className="section-title mt-2">入力・数式・出力を見分ける</h2><p className="mt-4 max-w-3xl text-[#607080]">画像ではなく、行番号・列見出し・数式バー・シートタブを持つHTML表でDCFシートを再現しています。横にスクロールして確認できます。</p><DcfWorkbookPreview /></section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2" aria-labelledby="input-title">
          <div><div className="eyebrow">入力ルール</div><h2 id="input-title" className="section-title mt-2">入力方法とセルの色</h2><ol className="mt-5 grid gap-3 pl-5 text-[#607080]"><li><strong className="text-[#102235]">入力の青セル</strong>だけを編集し、2026年度から2030年度までの予測と評価基準日時点の残高を入力します。</li><li>前提で資本構成合計100.0%、WACC &gt; 永久成長率を確認します。</li><li>DCFの出力セルと5×5感応度の方向性を確認してからチェックへ進みます。</li></ol><div className="dcf-cell-legend mt-5"><span className="legend-input">青セル：入力</span><span className="legend-formula">計算セル：数式</span><span className="legend-output">出力セル：評価結果</span></div></div>
          <div><div className="eyebrow">主要数式</div><h2 className="section-title mt-2">主要数式とレッスン</h2><div className="mt-5 grid gap-3">{lessons.map(([label, formula, href]) => <Link href={href} className="dcf-formula-link" key={href}><span><strong>{label}</strong><code>{formula}</code></span><span aria-hidden="true">→</span></Link>)}</div></div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2" aria-labelledby="checks-title">
          <div><div className="eyebrow">モデルチェック</div><h2 id="checks-title" className="section-title mt-2">チェックで確認する4項目</h2><ul className="mt-5 grid gap-2 pl-5 text-[#607080]"><li>株主資本構成比 + 負債構成比 = 100.0%</li><li>WACC &gt; 永久成長率</li><li>Equity Valueと各調整項目の再計算差額 = 0</li><li>主要計算範囲の数式エラー件数 = 0</li></ul><p className="mt-4 text-[#607080]">最終行は計算整合性と意思決定への利用可否を別々に表示します。計算が「適合」でも、出所確認前の教育用サンプルは実案件の意思決定に使える状態ではありません。</p></div>
          <div><div className="eyebrow">対応環境</div><h2 className="section-title mt-2">対応環境</h2><p className="mt-4 text-[#607080]">標準OOXML（.xlsx）としてMicrosoft Excel 2021とMicrosoft 365で開ける構造です。LibreOfficeでも開けますが、数式の再計算結果や印刷レイアウトが異なる場合があります。</p><p className="mt-3 text-[#607080]">数式と必要な表示用キャッシュをExcelJSで書き込み、開いたExcelへ完全再計算を要求しています。ExcelJS自体が数式を計算したものとは扱いません。</p></div>
        </section>

        <section className="callout warning mt-16" aria-labelledby="caution-title"><h2 id="caution-title" className="m-0 text-xl font-bold">利用上の注意</h2><p className="mb-0 mt-3">本ワークブックは教育目的の架空ケースです。最新の市場データ、対象会社固有の事業計画、資本コストの出所、会計・税務・法務・契約上の調整を含みません。実案件では各入力の一次資料と定義を確認し、専門家の判断を経てください。</p></section>

        <section className="dcf-download-panel mt-14" aria-labelledby="download-final"><div><div className="eyebrow">ダウンロード</div><h2 id="download-final">9シートのDCF評価モデルで練習する</h2><p>青セル入力、数式セル、評価出力、チェックを一つの標準準拠ファイルで確認できます。</p></div><Link href={workbookHref} className="button green" download>DCF評価モデル.xlsxをダウンロード</Link></section>
      </div>
    </>
  );
}
