import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/CtaLink";
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

export const metadata: Metadata = {
  title: "Compsの選定――類似上場会社を選ぶ実務フレームワーク",
  description:
    "Comps選定の考え方、対象企業プロフィール、選定基準、Role Peerと除外基準、Excel選定マトリクスまでを架空事例で解説します。",
};

const toc = [
  ["why-peer-selection", "Compsの意味とComparableの違い"],
  ["build-long-list", "Long Listから候補を絞る"],
  ["selection-criteria", "12の選定基準"],
  ["peer-roles", "Peer Roleと評価レンジ"],
  ["case-study", "架空企業の比較事例"],
  ["excel-workflow", "Excelワークフロー"],
  ["review-memo", "レビュー・除外理由メモ"],
  ["review-questions", "レビュー質問10問"],
  ["common-failures", "よくある失敗"],
  ["faq", "FAQ"],
] as const;

const corePeers = candidatePeers.filter((peer) => peer.role === "core_peer");

const failureExamples = [
  ["セクター名だけで選ぶ", "同じ『機械』でも、顧客、収益源、設備投資の重さが異なればマルチプルの意味が変わります。"],
  ["財務スコアだけで採用する", "高得点でも、セグメント開示が粗い、または一過性要因が強い場合はCore Peerにしません。"],
  ["近い会社を無条件で採用する", "中央FAテクノロジーのように利益情報がない近似企業は、事業理解には使えてもマルチプル比較には使えません。"],
  ["除外理由を残さない", "後日のレビューで恣意的に見えないよう、候補ごとの採用・不採用の根拠をメモに残します。"],
  ["データ時点を混在させる", "株価、財務実績、会社予想、為替の基準日をそろえ、時点差は注記します。"],
];

const reviewQuestions = [
  "対象会社の収益源・製品ミックスを一文で説明できるか？",
  "顧客業界と購買行動が近い候補を区別できているか？",
  "Core Peerに必要な重大基準を事前に定めたか？",
  "規模差がある候補をCoreではなくSecondaryに置く理由を説明できるか？",
  "EBITDA、成長率、セグメント情報の取得可否を確認したか？",
  "資本集約度と設備投資サイクルの違いを見落としていないか？",
  "会計方針、会計基準、非継続事業の影響を確認したか？",
  "除外候補を残し、除外理由をレビュー可能な形で記録したか？",
  "採用したマルチプルのレンジがCore Peer中心になっているか？",
  "比較可能性の限界を評価メモと最終アウトプットに明記したか？",
];

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="data-scroll">
      <table className="data-table min-w-[760px]">
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
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
            <span>Compsの選定</span>
          </nav>
          <div className="eyebrow">TRADING COMPS / PEER SELECTION</div>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">
            Compsの選定――類似上場会社を選ぶ実務フレームワーク
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">
            対象企業の事業を言語化し、Long ListからCore Peerを選び、除外理由まで記録するための実務フレームワークを学びます。
          </p>
          <dl className="mt-6 grid gap-3 text-sm text-[#607080] md:grid-cols-4">
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">対象</dt><dd>M&amp;A / FAS / 投資 / 経営企画</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">難易度</dt><dd>実務入門〜中級</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">目安時間</dt><dd>20〜25分</dd></div>
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

          <h2 id="why-peer-selection">1. Compsの意味とComparableの違い</h2>
          <p>
            Trading Compsは、上場市場で観察できる企業価値と財務指標を参照し、対象会社の評価レンジを考える方法です。ただし、同業分類が同じことと、比較可能であることは同義ではありません。Comparableとは、収益源、製品ミックス、顧客、地域、規模、成長性、利益率、資本集約度などが、評価目的に照らして十分に近い企業を指します。
          </p>
          <p>
            実務では、候補を多く集めることよりも、なぜその候補をCore Peerとして扱うのか、なぜ近い会社を除外したのかを第三者が追える状態にすることが重要です。選定はマルチプルを計算する前の、評価の前提づくりです。
          </p>
          <div className="formula">Long List → 選定基準 → Peer Role → 採用レンジ → レビュー・除外理由</div>

          <h2 id="build-long-list">2. Long Listから候補を絞る</h2>
          <p>
            最初から6社だけを探すのではなく、業界分類、製品・サービス、顧客業界、地域から30社程度のLong Listを作ります。次に、事業モデルと顧客市場で候補を絞り、規模・成長性・収益性・資本集約度を比較します。候補を減らす各段階で、何を確認したかを記録します。
          </p>
          <SelectionFunnel />
          <p>
            Long Listは「候補の母集団」、Core Peerは「評価レンジの中心を説明する対象」です。後者に必要なのは見た目の近さではなく、収益ドライバーとリスクの近さです。
          </p>

          <h2 id="selection-criteria">3. 12の選定基準</h2>
          <p>
            以下の12基準を0〜3点で評価します。重大基準は事業モデル、製品ミックス、顧客市場、資本集約度です。合計点は会話を構造化するための補助であり、機械的な採用判定ではありません。
          </p>
          <DataTable
            headers={["選定基準", "確認する質問", "扱い"]}
            rows={selectionCriteria.map((criterion) => [criterion.label, criterion.question, criterion.critical ? "重大基準" : "補助基準"])}
          />
          <div className="callout">
            <strong>判定の順序</strong><br />
            重大な不一致やデータ不足があれば、平均スコアが高くてもCore Peerには採用しません。スコアは判断を可視化し、レビュー可能にするためのものです。
          </div>

          <h2 id="peer-roles">4. Peer Roleと評価レンジ</h2>
          <p>
            全候補を同じ重みで扱わず、評価上の役割を分けます。Core Peerは中心レンジ、Secondary Peerは規模や地域の差を注記した補助比較、Aspirational Peerは改善後の将来像、Negative Peerは除外判断の比較対象です。近接していても開示不足の企業は、事業理解の参考にとどめます。
          </p>
          <PeerRoleMap peers={candidatePeers} />
          <p>
            役割を定めることで、中央値や平均値を無条件に使うのを避けられます。最終的なマルチプルの採用レンジは、{corePeers.map((peer) => peer.name).join("、")}のようなCore Peerを中心に説明します。
          </p>

          <h2 id="case-study">5. 架空企業の比較事例</h2>
          <p>
            対象は{targetProfile.name}です。製造業向けの自動化装置・部品と保守サービスを提供し、売上高は{targetProfile.revenue.toLocaleString("ja-JP")} {targetProfile.unit}、EBITDAマージンは{targetProfile.ebitdaMargin}%と仮定します。以下は実在企業を表すものではありません。
          </p>
          <TargetComparisonCards target={targetProfile} peers={candidatePeers} />
          <p>
            例えば、グローバル産業ロボティクスは事業領域が近くても規模・地域・会計基準が異なるためSecondaryです。中央FAテクノロジーは事業面では近似していますが、EBITDA情報がないためマルチプル検証からは除外します。このように「似ているが採用しない」判断こそ、選定メモに残すべき重要な情報です。
          </p>

          <h2 id="excel-workflow">6. Excelワークフロー</h2>
          <p>
            選定プロセスは一枚の表に詰め込まず、目的と更新頻度に応じてシートを分けます。各シートは入力・判定・出力の役割を明確にし、最終レンジがどの候補と判断に基づくかを追えるようにします。
          </p>
          <DataTable
            headers={["シート", "役割", "主な内容"]}
            rows={[
              ["Target Profile", "対象会社の定義", "事業、製品ミックス、顧客、地域、規模、利益率、資本集約度"],
              ["Long List", "候補の母集団", "業種候補、情報源、一次コメント、除外前の観察"],
              ["Selection Matrix", "比較可能性の判定", "12基準のスコア、重大不一致、データ可否、役割"],
              ["Peer Roles", "評価上の位置づけ", "Core / Secondary / Aspirational / Negative / Excluded"],
              ["Review Memo", "レビュー証跡", "採用・除外理由、残論点、確認者、基準日"],
              ["Checks", "整合性確認", "時点、通貨、単位、計算式、欠損データ、重複候補"],
            ]}
          />
          <ExcelSelectionMatrix peers={candidatePeers} criteria={selectionCriteria} />

          <h2 id="review-memo">7. レビュー・除外理由メモ</h2>
          <p>
            Review Memoには、候補名、役割、採用または除外の理由、確認した資料、データ基準日、残論点を残します。除外企業を消すのではなく、理由とともに残すことで、レビュー者が判断の一貫性を確認できます。
          </p>
          <DataTable
            headers={["候補", "判定", "メモに残す理由"]}
            rows={[
              ["中央FAテクノロジー", "近接除外", "事業面は近いが、EBITDA情報が取得できずマルチプル比較に使えない"],
              ["大和重機械", "Negative", "大型重機・建設顧客中心で、資本集約度と循環性が異なる"],
              ["統合エンジニアリングHD", "比較限定", "近接事業はあるが、複合企業でセグメント純度が低い"],
              ["グローバル産業ロボティクス", "Secondary", "事業は近いが、規模・地域・会計基準の差を注記して補助比較にとどめる"],
            ]}
          />

          <h2 id="review-questions">8. レビュー質問10問</h2>
          <ol>{reviewQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
          <p>
            これらの問いに資料と数値で答えられない場合は、候補を増やす前にTarget Profile、情報源、重大基準の定義を見直します。
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
            <div className="eyebrow">WORKSHEET</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">選定ワークシートで判断を残す</h2>
            <p className="mt-3 max-w-2xl text-sm text-[#607080]">
              Target Profile、Long List、Selection Matrix、Review Memo、Checksの構成で、比較対象の選定と除外理由を一貫して記録します。
            </p>
            <CtaLink href="/downloads/Comps_Selection_Worksheet.xlsx" label="download_comps_selection_worksheet" location="comps_peer_selection" className="button green mt-5">
              Comps_Selection_Worksheet.xlsx をダウンロード
            </CtaLink>
          </section>

          <section className="mt-10">
            <div className="eyebrow">RELATED PAGES</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">次に確認するページ</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["非上場企業Valuation入門", "/private-company-valuation", "CompsをEVと株主価値の評価プロセスへつなげる"],
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

          <h2 id="faq">FAQ</h2>
          <div className="grid gap-3">
            {peerSelectionFaqs.map(([question, answer]) => (
              <details key={question} className="border border-[#d8e0e5] bg-white p-5">
                <summary className="cursor-pointer font-bold text-[#102235]">{question}</summary>
                <p className="mb-0 mt-3">{answer}</p>
              </details>
            ))}
          </div>
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
