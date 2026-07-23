import type { Metadata } from "next";
import Link from "next/link";
import { calculateDcf, calculateEquityBridge, calculateFcff, calculateWacc, dcfCase } from "@/data/dcf-series";

const canonical = "https://arsenal23vm-netizen.github.io/financial-modeling-lab/valuation/dcf";

export const metadata: Metadata = {
  title: "DCF評価の基礎｜FCFFから株主価値まで5ステップで学ぶ",
  description: "同じ架空企業の数値を使い、FCFF、WACC、継続価値、感応度、Enterprise ValueからEquity Valueへの調整を順に学ぶDCF講座です。",
  alternates: { canonical },
  openGraph: {
    title: "DCF評価の基礎｜FCFFから株主価値まで5ステップで学ぶ",
    description: "共有ケースとExcelセル式でDCF評価の全体像を学ぶ教育用シリーズ。",
    url: canonical,
    type: "website",
  },
};

const lessons = [
  ["01", "FCFFを予測する", "/valuation/dcf/fcff", "EBITを税引後にし、減価償却費、設備投資、運転資本増加を調整します。"],
  ["02", "WACCを計算する", "/valuation/dcf/wacc", "株主資本コストと税引後負債コストを目標資本構成で加重します。"],
  ["03", "継続価値を求める", "/valuation/dcf/terminal-value", "明示予測期間後の価値を永久成長法で計算し、構成比を確認します。"],
  ["04", "感応度を確認する", "/valuation/dcf/sensitivity-analysis", "WACCと永久成長率の組合せで企業価値の振れ幅を可視化します。"],
  ["05", "EVを株主価値へつなぐ", "/valuation/dcf/enterprise-to-equity", "現金、負債、負債類似項目、非支配株主持分を調整します。"],
] as const;

export default function DcfHubPage() {
  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const firstFcff = calculateFcff(dcfCase.forecasts[0]);

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-12 md:py-16">
          <nav className="mb-5 text-sm text-[#607080]" aria-label="パンくずリスト">
            <Link href="/" className="hover:text-[#147d73]">ホーム</Link><span aria-hidden="true"> / </span>
            <Link href="/valuation" className="hover:text-[#147d73]">Valuation</Link><span aria-hidden="true"> / </span><span>DCF評価</span>
          </nav>
          <div className="eyebrow">DCF学習シリーズ</div>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold leading-tight tracking-[-.04em] text-[#102235] md:text-6xl">DCF評価を、FCFFから株主価値まで一つのケースでつなぐ</h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">サンプル部品株式会社の2026年度から2030年度までの予測を使い、5つの計算をExcelへ落とし込む順番で学びます。</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#dcf-series" className="button green">5ステップを始める</a>
            <Link href="/downloads/dcf-valuation-model" className="button secondary">DCF Excel教材を見る</Link>
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]" aria-labelledby="value-definition">
          <div>
            <div className="eyebrow">価値の定義</div>
            <h2 id="value-definition" className="section-title mt-2">DCFが算定する価値を先に区別する</h2>
            <p className="mt-4 text-[#607080]">Enterprise Value（企業価値）は事業が生むFCFFの現在価値です。資金提供者全体に帰属する価値で、現金・負債の調整前を表します。</p>
            <p className="mt-3 text-[#607080]">Equity Value（株主価値）はEnterprise Valueへ現金及び現金同等物を加え、有利子負債、有利子負債類似項目、非支配持分を控除した普通株主に帰属する価値です。</p>
          </div>
          <dl className="dcf-output-card">
            <div><dt>Enterprise Value</dt><dd>{valuation.enterpriseValue.toFixed(1)} 百万円</dd></div>
            <div><dt>Equity Value</dt><dd>{bridge.equityValue.toFixed(1)} 百万円</dd></div>
            <div><dt>差額</dt><dd>{(valuation.enterpriseValue - bridge.equityValue).toFixed(1)} 百万円</dd></div>
          </dl>
        </section>

        <section className="mt-14" aria-labelledby="shared-case">
          <div className="eyebrow">共通ケース</div>
          <h2 id="shared-case" className="section-title mt-2">共通ケースの前提</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <dl className="dcf-assumption-card"><dt>対象会社 / 通貨単位</dt><dd>サンプル部品株式会社<br />単位：百万円</dd></dl>
            <dl className="dcf-assumption-card"><dt>予測期間 / 割引時点</dt><dd>{dcfCase.forecasts[0].year}–{dcfCase.forecasts.at(-1)?.year}<br />各予測年度末（期末割引）</dd></dl>
            <dl className="dcf-assumption-card"><dt>2026年度FCFF</dt><dd>{firstFcff.toFixed(1)} 百万円<br />税率 {(dcfCase.forecasts[0].taxRate * 100).toFixed(1)}%</dd></dl>
            <dl className="dcf-assumption-card"><dt>割引率 / 永久成長率</dt><dd>WACC {(calculateWacc(dcfCase.wacc) * 100).toFixed(2)}%<br />g {(dcfCase.terminalGrowthRate * 100).toFixed(1)}%</dd></dl>
          </div>
        </section>

        <section id="dcf-series" className="mt-16 scroll-mt-24" aria-labelledby="series-title">
          <div className="eyebrow">5段階の計算手順</div>
          <h2 id="series-title" className="section-title mt-2">入力から株主価値までの5ステップ</h2>
          <div className="mt-7 grid gap-4">
            {lessons.map(([number, title, href, summary]) => (
              <Link key={href} href={href} className="dcf-series-card">
                <span className="dcf-series-number">{number}</span>
                <span><strong>{title}</strong><small>{summary}</small></span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 border-t border-[#d8e0e5] pt-10 md:grid-cols-2" aria-labelledby="outputs-title">
          <div><div className="eyebrow">主要な出力</div><h2 id="outputs-title" className="mt-2 text-2xl font-bold text-[#102235]">このシリーズで確認する出力</h2></div>
          <ul className="m-0 grid gap-2 pl-5 text-[#607080]"><li>2026年度から2030年度までのFCFF（百万円）</li><li>WACCと永久成長率（%）</li><li>継続価値のEnterprise Value構成比（%）</li><li>感応度表のEnterprise Value（百万円）</li><li>Enterprise ValueからEquity Valueへの調整（百万円）</li></ul>
        </section>

        <section className="dcf-workbook-cta mt-14" aria-labelledby="hub-workbook">
          <div className="eyebrow">教育用サンプル</div>
          <h2 id="hub-workbook" className="mt-2">数式とチェックをワークブックで追う</h2>
          <p>このケースは教育目的の画面表示用サンプルです。ライブ市場データを使っておらず、個別案件の意思決定に利用できる状態ではありません。</p>
          <Link href="/downloads/dcf-valuation-model" className="button green mt-5">DCF評価モデルの使い方を見る</Link>
        </section>
      </div>
    </>
  );
}
