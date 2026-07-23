import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/CtaLink";
import { lessons } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "https://data-lab-23.github.io/financial-modeling-lab/" },
};

const principles = [
  { title: "入力・計算・出力を分ける", body: "前提と計算ロジックを混ぜず、第三者が追えるモデルへ。" },
  { title: "勘定科目から設計する", body: "売掛金、棚卸資産、固定資産、借入金までセル接続で理解。" },
  { title: "レビューに耐える形で残す", body: "チェック行、符号規則、参照方向をそろえ、壊れにくくする。" },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-white">
        <div className="container grid min-h-[590px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="eyebrow">理論から実務モデルへ</div>
            <h1 className="mt-4 text-4xl font-bold leading-[1.16] tracking-[-.05em] text-[#102235] md:text-6xl">
              読むだけで終わらない。
              <br />
              <span className="text-[#147d73]">実務で組める財務モデラー</span>へ。
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#607080]">
              各勘定科目の前提設計、財務三表の連動、Excelのセル接続まで。M&Aの現場で検証に耐える財務モデルを、自分の手で構築できるレベルへ引き上げます。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink className="button" href="/learning-roadmap" label="学習を始める" location="home_hero">
                学習を始める
              </CtaLink>
              <CtaLink className="button secondary" href="/downloads/05_完成3表モデル.xlsx" label="完成モデルを見る" location="home_hero">
                完成モデルを見る
              </CtaLink>
              <CtaLink className="button green" href="/downloads" label="Excelをダウンロード" location="home_hero">
                Excelをダウンロード
              </CtaLink>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between bg-[#217346] px-4 py-2 text-sm font-bold text-white">
              <span>買収モデル_v08.xlsx</span>
              <span>モデルチェック：正常</span>
            </div>
            <div className="data-scroll border-0">
              <table className="data-table min-w-[560px]">
                <thead>
                  <tr>
                    <th>基本シナリオ</th>
                    <th>2026年度</th>
                    <th>2027年度</th>
                    <th>2028年度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>売上高</td>
                    <td className="number">1,240</td>
                    <td className="number">1,352</td>
                    <td className="number">1,474</td>
                  </tr>
                  <tr>
                    <td>営業利益</td>
                    <td className="number">161</td>
                    <td className="number">189</td>
                    <td className="number">221</td>
                  </tr>
                  <tr>
                    <td>営業利益率</td>
                    <td className="number">13.0%</td>
                    <td className="number">14.0%</td>
                    <td className="number">15.0%</td>
                  </tr>
                  <tr>
                    <td>有利子負債／営業利益</td>
                    <td className="number">3.2倍</td>
                    <td className="number">2.4倍</td>
                    <td className="number">1.7倍</td>
                  </tr>
                  <tr>
                    <td>株主価値</td>
                    <td colSpan={3} className="number font-bold text-[#217346]">
                      1,630
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-3 border-t border-[#d8e0e5] text-center text-xs font-bold text-[#607080]">
              <span className="p-3">入力</span>
              <span className="border-x border-[#d8e0e5] p-3">計算</span>
              <span className="p-3">出力</span>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container grid gap-4 py-8 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="border border-[#d8e0e5] bg-white p-5">
              <h2 className="font-bold text-[#102235]">{item.title}</h2>
              <p className="mt-2 text-sm text-[#607080]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#f7f8f6]">
        <div className="container py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">分野別ガイド</div>
              <h2 className="section-title mt-2">学習テーマから探す</h2>
            </div>
            <p className="max-w-lg text-sm text-[#607080]">目的に近いテーマを選び、いま読める解説や教材から学習を始められます。</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { href: "/financial-modeling", title: "財務モデリング", body: "三表、事業計画、モデル品質を順に学ぶ。" },
              { href: "/valuation", title: "Valuation", body: "DCFと類似会社比較で価値評価の根拠を組み立てる。" },
              { href: "/ma-modeling", title: "M&Aモデル", body: "案件の論点とレビュー観点を整理する。" },
              { href: "/excel-templates", title: "Excel教材", body: "演習とテンプレートで手を動かして確かめる。" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="border border-[#d8e0e5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#147d73] hover:shadow-lg">
                <h3 className="text-xl font-bold text-[#102235]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#607080]">{item.body}</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#147d73]">テーマを見る →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8f6]">
        <div className="container grid gap-10 py-16 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="eyebrow">このサイトを作った理由</div>
            <h2 className="section-title mt-2">「結局、セルをどうつなぐのか」が見つからなかった。</h2>
          </div>
          <div className="space-y-5 text-[1.02rem]">
            <p>
              書籍や財務モデル紹介サイトでも、モデル全体の設計思想や財務三表の回し方は学べます。しかし実務で必要になる、売掛金、棚卸資産、固定資産、のれん、繰延税金負債といった
              <strong>各勘定科目をどう設計するか</strong>、前提条件シートから計算シート、アウトプットへ
              <strong>Excelでどう接続するか</strong>まで詳しく解説したものは多くありません。
            </p>
            <p>
              Finance Modeling Labは、理論、会計処理、Excel実装を一つにつなげる実務メディアです。初学者にも読める順番を保ちながら、M&Aや財務アドバイザリーの現場でレビューされる粒度を目指します。
            </p>
            <p className="border-l-4 border-[#217346] pl-5 font-semibold text-[#102235]">
              その不便を次の担当者に残さないために、勘定科目からセル参照までを一つにつないだFinance Modeling Labを作りました。
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-[#d8e0e5] bg-white">
        <div className="container grid gap-8 py-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <div className="eyebrow">運営・編集方針</div>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.04em] text-[#102235]">実務メディアとして、誇張せずに積み上げる。</h2>
            <p className="mt-3 text-sm text-[#607080]">教育目的、サンプルデータ、専門家確認が必要な領域を明示しながら、財務モデリングの学習に使える情報へ整えています。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/about" className="border border-[#d8e0e5] p-5 hover:border-[#147d73]">
              <strong className="text-[#102235]">このサイトについて</strong>
              <span className="mt-2 block text-sm text-[#607080]">目的、対象読者、運営方針。</span>
            </Link>
            <Link href="/editorial-policy" className="border border-[#d8e0e5] p-5 hover:border-[#147d73]">
              <strong className="text-[#102235]">編集方針</strong>
              <span className="mt-2 block text-sm text-[#607080]">記事制作、更新、広告表記。</span>
            </Link>
            <Link href="/disclaimer" className="border border-[#d8e0e5] p-5 hover:border-[#147d73]">
              <strong className="text-[#102235]">免責事項</strong>
              <span className="mt-2 block text-sm text-[#607080]">専門家確認と利用上の注意。</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8f6]">
        <div className="container grid gap-4 py-12 md:grid-cols-4">
          {[
            { href: "/learning-roadmap", title: "学ぶ", body: "8段階のロードマップで順番に進める。" },
            { href: "/journal-lab", title: "仕訳する", body: "取引からPL・BS・CFへの流れを確認する。" },
            { href: "/quality-standard", title: "確認する", body: "100点満点の品質基準でレビューする。" },
            { href: "/downloads", title: "持ち帰る", body: "Excel成果物をダウンロードする。" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="border border-[#d8e0e5] bg-white p-5 hover:border-[#147d73]">
              <strong className="text-xl text-[#102235]">{item.title}</strong>
              <span className="mt-2 block text-sm text-[#607080]">{item.body}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="container py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">学習カリキュラム</div>
            <h2 className="section-title mt-2">実務モデルを順番に完成させる</h2>
          </div>
          <p className="max-w-lg text-sm text-[#607080]">前提条件から計算、財務三表、アウトプットへ、一方向に参照を流す順序で学びます。</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => (
            <Link key={lesson.slug} href={`/${lesson.slug}`} className="border border-[#d8e0e5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#147d73] hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <strong className="font-mono text-[#147d73]">{lesson.no}</strong>
                <span className="text-right text-xs text-[#607080]">
                  {lesson.level}・{lesson.time}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-[#102235]">{lesson.title}</h3>
              <p className="mt-2 text-sm text-[#607080]">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-[#102235] text-white">
        <div className="container grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-xs font-bold tracking-[.15em] text-[#77c7bc]">一緒に教材を改善する</div>
            <h2 className="mt-2 text-3xl font-bold">次にほしい解説や機能を教えてください。</h2>
            <p className="mt-3 max-w-2xl text-white/65">扱ってほしい勘定科目、Excelテンプレート、モデル機能などを自由にリクエストできます。</p>
          </div>
          <CtaLink href="/request" label="リクエストを送る" location="home_bottom" className="button green">
            リクエストを送る
          </CtaLink>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Finance Modeling Lab",
            inLanguage: "ja",
            description: "財務モデリングを実務レベルで構築できる力を養う学習サイト",
          }),
        }}
      />
    </>
  );
}
