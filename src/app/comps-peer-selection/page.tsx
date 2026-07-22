import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/CtaLink";
import { EditorialDetails } from "@/components/EditorialDetails";
import {
  ExcelSelectionMatrix,
  PeerRoleMap,
  SelectionFunnel,
  TargetComparisonCards,
} from "@/components/CompsSelectionFigures";
import {
  candidatePeers,
  peerSelectionFaqs,
  selectionCriteria,
  targetProfile,
} from "@/data/comps-selection";
import { getEditorialRecord } from "@/data/editorial";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/comps-peer-selection", {
  title: "類似会社の選定方法｜比較対象を選ぶ実務手順",
  description:
    "類似会社候補の探し方、事業モデル・規模・成長率・利益率による比較、主要比較会社と除外企業の整理、Excel選定表まで解説します。",
});

const toc = [
  ["why-peer-selection", "類似会社比較の目的"],
  ["build-long-list", "比較候補会社一覧から候補を絞る"],
  ["selection-criteria", "12の選定基準"],
  ["peer-roles", "比較上の位置づけと評価レンジ"],
  ["case-study", "架空企業の比較事例"],
  ["excel-workflow", "Excelワークフロー"],
  ["review-memo", "レビュー・除外理由メモ"],
  ["review-questions", "レビュー質問10問"],
  ["common-failures", "よくある失敗"],
  ["faq", "よくある質問"],
] as const;

const corePeers = candidatePeers.filter((peer) => peer.role === "core_peer");
const peerRoleLabels = {
  core_peer: "主要比較会社", secondary_peer: "補完比較会社", aspirational_peer: "目標比較会社",
  negative_peer: "非比較会社", excluded_close_peer: "類似するが除外", not_clean_comp: "参考会社",
} as const;

const failureExamples = [
  ["セクター漏れ", "狭い業種分類だけで比較候補会社一覧を閉じると、顧客市場や収益モデルが近い周辺企業を見落とします。地域、製品、サービス、顧客から候補を広げます。"],
  ["規模不一致", "売上規模や時価総額が大きく異なる企業を主要比較会社へ混ぜると、流動性、交渉力、マージン、成長期待の差を見落とします。"],
  ["成長率・利益率の不一致", "一時的な高成長・低収益や再建局面の企業は、通常局面の対象会社と同じレンジに置きません。"],
  ["会計基準不一致", "IFRSと日本基準、会計方針、セグメント開示の違いを確認せずに比較すると、EBITDAやネットデットの意味がずれます。"],
  ["データ取得都合の除外", "入手しやすい企業だけを残すのはバイアスです。中央FAテクノロジーのような情報不足企業は、使えない指標と除外理由を記録します。"],
  ["中央値の盲目的採用", "中央値は正解ではありません。主要比較会社、補完比較会社、除外候補の構成を確認し、対象会社との違いを反映した採用レンジを説明します。"],
  ["除外理由を残さない", "後日のレビューで恣意的に見えないよう、候補ごとの採用・不採用の根拠をメモに残します。"],
  ["データ時点を混在させる", "株価、財務実績、会社予想、為替の基準日をそろえ、時点差は注記します。"],
];

const reviewQuestions = [
  "対象会社の収益源・製品ミックスを一文で説明できるか？",
  "顧客業界と購買行動が近い候補を区別できているか？",
  "主要比較会社に必要な重大基準を事前に定めたか？",
  "規模差がある候補を主要ではなく補完に置く理由を説明できるか？",
  "EBITDA、成長率、セグメント情報の取得可否を確認したか？",
  "資本集約度と設備投資サイクルの違いを見落としていないか？",
  "会計方針、会計基準、非継続事業の影響を確認したか？",
  "除外候補を残し、除外理由をレビュー可能な形で記録したか？",
  "採用したマルチプルのレンジが主要比較会社中心になっているか？",
  "比較可能性の限界を評価メモと最終アウトプットに明記したか？",
];

function DataTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="data-scroll">
      <table className="data-table min-w-[760px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompsPeerSelectionPage() {
  const editorialRecord = getEditorialRecord("/comps-peer-selection");
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: peerSelectionFaqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-14">
          <nav className="mb-5 text-sm text-[#607080]" aria-label="パンくずリスト">
            <Link href="/" className="hover:text-[#147d73]">ホーム</Link>
            <span aria-hidden="true"> / </span>
            <span>類似会社の選定</span>
          </nav>
          <div className="eyebrow">類似会社比較／比較会社選定</div>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">
            類似会社の選定――比較対象を選ぶ実務手順
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">
            対象企業の事業を言語化し、比較候補会社一覧から主要比較会社を選び、除外理由まで記録するための実務フレームワークを学びます。
          </p>
          <dl className="mt-6 grid gap-3 text-sm text-[#607080] md:grid-cols-4">
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">対象</dt><dd>M&amp;A・財務アドバイザリー・投資・経営企画</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">難易度</dt><dd>実務入門〜中級</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">目安時間</dt><dd>30〜45分</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">ケース</dt><dd>架空の製造業</dd></div>
          </dl>
        </div>
      </section>

      <div className="article-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_270px] xl:gap-20">
        <article className="article-copy min-w-0">
          <div className="callout warning">
            <strong>教育目的の架空事例</strong><br />
            本ページの会社名、数値、比較対象、選定結果はすべて学習用の架空事例です。投資判断、会計・税務・法務判断、実案件の評価意見を代替するものではありません。
          </div>

          <section className="mb-10 border border-[#d8e0e5] bg-[#f7f8f6] p-6 md:p-8">
            <div className="eyebrow">Excel演習</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">選定ワークシートで判断を始める</h2>
            <p className="mt-3 max-w-2xl text-sm text-[#607080]">
              本文を読む前に、対象会社の事業特性と比較候補会社一覧の欄を確認し、比較対象の選定基準と除外理由を記録する準備をします。
            </p>
            <CtaLink href="/downloads/類似会社選定ワークシート.xlsx" label="download_peer_selection_worksheet_top" location="peer_selection_top" className="button green mt-5">
              類似会社選定ワークシート.xlsxをダウンロード
            </CtaLink>
          </section>

          <h2 id="why-peer-selection">1. 類似会社比較の目的</h2>
          <p>
            類似会社比較法は、上場市場で観察できる企業価値と財務指標を参照し、対象会社のValuationレンジを検討する方法です。ただし、同じ業種分類に属するだけでは比較可能とはいえません。収益源、製品構成、顧客、地域、規模、成長性、利益率、資本集約度が、評価目的に照らして十分に近いかを確認します。
          </p>
          <p>
            実務では、候補を多く集めることよりも、なぜその候補を主要比較会社として扱うのか、なぜ近い会社を除外したのかを第三者が追える状態にすることが重要です。選定はマルチプルを計算する前の、評価の前提づくりです。
          </p>
          <div className="formula">比較候補会社一覧 → 選定基準 → 比較上の位置づけ → 採用レンジ → 採用・除外理由</div>

          <h2 id="build-long-list">2. 比較候補会社一覧から候補を絞る</h2>
          <p>
            最初から6社だけを探すのではなく、業界分類、製品・サービス、顧客業界、地域から30社程度の比較候補会社一覧を作ります。次に、事業モデルと顧客市場で候補を絞り、規模・成長性・収益性・資本集約度を比較します。候補を減らす各段階で、何を確認したかを記録します。
          </p>
          <SelectionFunnel />
          <p>
            比較候補会社一覧は「候補の母集団」、主要比較会社は「評価レンジの中心を説明する対象」です。後者に必要なのは見た目の近さではなく、収益ドライバーとリスクの近さです。
          </p>

          <h2 id="selection-criteria">3. 12の選定基準</h2>
          <p>
            以下の12基準を0〜3点で評価します。重大基準は事業モデル、製品ミックス、顧客市場、資本集約度です。合計点は会話を構造化するための補助であり、機械的な採用判定ではありません。
          </p>
          <DataTable
            caption="12の選定基準"
            headers={["選定基準", "確認する質問", "扱い"]}
            rows={selectionCriteria.map((criterion) => [criterion.label, criterion.question, criterion.critical ? "重大基準" : "補助基準"])}
          />
          <div className="callout">
            <strong>判定の順序</strong><br />
            重大な不一致やデータ不足があれば、平均スコアが高くても主要比較会社には採用しません。スコアは判断を可視化し、レビュー可能にするためのものです。
          </div>

          <h2 id="peer-roles">4. 比較上の位置づけと評価レンジ</h2>
          <p>
            全候補を同じ重みで扱わず、評価上の役割を分けます。主要比較会社は中心レンジ、補完比較会社は規模や地域の差を注記した補助比較、目標比較会社は改善後の将来像、非比較会社は除外判断の比較対象です。近接していても開示不足の企業は、事業理解の参考にとどめます。
          </p>
          <PeerRoleMap peers={candidatePeers} />
          <p>
            役割を定めることで、中央値や平均値を無条件に使うのを避けられます。最終的なマルチプルの採用レンジは、{corePeers.map((peer) => peer.name).join("、")}のような主要比較会社を中心に説明します。
          </p>

          <h2 id="case-study">5. 架空企業の比較事例</h2>
          <p>
            対象は{targetProfile.name}です。製造業向けの自動化装置・部品と保守サービスを提供し、売上高は{targetProfile.revenue.toLocaleString("ja-JP")} {targetProfile.unit}、EBITDAマージンは{targetProfile.ebitdaMargin}%と仮定します。以下は実在企業を表すものではありません。
          </p>
          <TargetComparisonCards target={targetProfile} peers={candidatePeers} />
          <h3>対象会社と架空候補12社の一覧</h3>
          <DataTable
            caption="対象会社と架空候補12社の一覧"
            headers={["会社", "事業", "地域", "売上高", "成長率", "EBITDAマージン", "比較上の位置づけ"]}
            rows={candidatePeers.map((peer) => [
              peer.name,
              peer.business,
              peer.geography,
              `${peer.revenue.toLocaleString("ja-JP")} ${targetProfile.unit}`,
              `${peer.growth}%`,
              peer.ebitdaMargin === null ? "該当なし（情報不足）" : `${peer.ebitdaMargin.toFixed(1)}%`,
              peerRoleLabels[peer.role],
            ])}
          />
          <p>
            例えば、グローバル産業ロボティクスは事業領域が近くても規模・地域・会計基準が異なるため補完です。中央FAテクノロジーは事業面では近似していますが、EBITDA情報がないためマルチプル検証からは除外します。このように「似ているが採用しない」判断こそ、選定メモに残すべき重要な情報です。
          </p>

          <h2 id="excel-workflow">6. Excelワークフロー</h2>
          <p>
            選定プロセスは一枚の表に詰め込まず、目的と更新頻度に応じてシートを分けます。各シートは入力・判定・出力の役割を明確にし、最終レンジがどの候補と判断に基づくかを追えるようにします。
          </p>
          <DataTable
            caption="Excelワークブックのシート構成"
            headers={["シート", "役割", "主な内容"]}
            rows={[
              ["対象会社の事業特性", "対象会社の定義", "事業、製品ミックス、顧客、地域、規模、利益率、資本集約度"],
              ["比較候補会社一覧", "候補の母集団", "業種候補、情報源、一次コメント、除外前の観察"],
              ["比較会社選定表", "比較可能性の判定", "12基準のスコア、重大不一致、データ可否、役割"],
              ["比較上の位置づけ", "評価上の位置づけ", "主要比較会社、補完比較会社、目標比較会社、非比較会社、除外会社"],
              ["検討記録", "レビュー証跡", "採用・除外理由、残論点、確認者、基準日"],
              ["チェック", "整合性確認", "時点、通貨、単位、計算式、欠損データ、重複候補"],
            ]}
          />
          <ExcelSelectionMatrix peers={candidatePeers} criteria={selectionCriteria} />

          <h2 id="review-memo">7. レビュー・除外理由メモ</h2>
          <p>
            検討記録には、候補名、役割、採用または除外の理由、確認した資料、データ基準日、残論点を残します。除外企業を消すのではなく、理由とともに残すことで、レビュー者が判断の一貫性を確認できます。
          </p>
          <DataTable
            caption="選定理由メモの良い例と悪い例"
            headers={["候補", "判定", "メモに残す理由"]}
            rows={[
              ["悪い例：業界が近いから採用", "根拠不足", "『機械』という分類だけで採用し、収益モデル、顧客、開示、規模の差を記録していない"],
              ["良い採用例：匠オートメーション", "主要", "装置・保守の構成、売上規模、利益率、製造業顧客が対象に近く、重大基準に不一致がない"],
              ["良い除外例：中央FAテクノロジー", "近接除外", "事業面は近いが、EBITDA情報が取得できずマルチプル比較に使えないため、情報不足を明記して除外する"],
              ["良い補助例：グローバル産業ロボティクス", "補完", "事業は近いが、規模・地域・会計基準の差を注記して補助比較にとどめる"],
            ]}
          />

          <h2 id="review-questions">8. レビュー質問10問</h2>
          <ol>{reviewQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
          <p>
            これらの問いに資料と数値で答えられない場合は、候補を増やす前に対象会社の事業特性、情報源、重大基準の定義を見直します。
          </p>

          <h2 id="common-failures">9. よくある失敗</h2>
          <div className="grid gap-4">
            {failureExamples.map(([title, body]) => (
              <section key={title} className="border border-[#d8e0e5] bg-white p-5">
                <h3 className="mt-0 text-lg">{title}</h3>
                <p>{body}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 border border-[#d8e0e5] bg-[#f7f8f6] p-6 md:p-8">
            <div className="eyebrow">Excel演習</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">選定ワークシートで判断を残す</h2>
            <p className="mt-3 max-w-2xl text-sm text-[#607080]">
              対象会社の事業特性、比較候補会社一覧、比較会社選定表、検討記録、チェックの構成で、比較対象の選定と除外理由を一貫して記録します。
            </p>
            <CtaLink href="/downloads/類似会社選定ワークシート.xlsx" label="download_peer_selection_worksheet" location="peer_selection" className="button green mt-5">
              類似会社選定ワークシート.xlsxをダウンロード
            </CtaLink>
          </section>

          <section className="mt-10">
            <div className="eyebrow">関連ページ</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">次に確認するページ</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["非上場企業Valuation入門", "/private-company-valuation", "類似会社比較をEnterprise ValueとEquity Valueの算定へつなげる"],
                ["モデル品質基準", "/quality-standard", "選定シートをレビュー可能な状態に整える"],
                ["ダウンロードセンター", "/downloads", "Excel教材と既存の演習ファイルを確認する"],
              ].map(([title, href, body]) => (
                <Link key={href} href={href} className="border border-[#d8e0e5] bg-white p-5 hover:border-[#147d73]">
                  <strong className="text-[#102235]">{title}</strong>
                  <span className="mt-2 block text-sm text-[#607080]">{body}</span>
                </Link>
              ))}
            </div>
          </section>

          <h2 id="faq">よくある質問</h2>
          <div className="grid gap-3">
            {peerSelectionFaqs.map(([question, answer]) => (
              <details key={question} className="border border-[#d8e0e5] bg-white p-5">
                <summary className="cursor-pointer font-bold text-[#102235]">{question}</summary>
                <p className="mb-0 mt-3">{answer}</p>
              </details>
            ))}
          </div>
          <EditorialDetails
            record={editorialRecord}
            breadcrumbs={[
              { name: "ホーム", href: "/" },
              { name: editorialRecord.title, href: editorialRecord.href },
            ]}
          />
        </article>

        <aside className="lg:pt-1">
          <div className="sticky top-24 border-t-4 border-[#102235] bg-white p-5 shadow-sm">
            <strong className="text-sm text-[#102235]">このページの内容</strong>
            <ol className="mt-3 space-y-2 text-sm text-[#607080]">
              {toc.map(([id, label], index) => (
                <li key={id}><a href={`#${id}`} className="hover:text-[#147d73]">{String(index + 1).padStart(2, "0")} {label}</a></li>
              ))}
            </ol>
            <Link href="/downloads" className="button green mt-5 w-full text-sm">Excel教材を見る</Link>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
