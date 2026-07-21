import type { Metadata } from "next";
import Link from "next/link";
import { EditorialDetails } from "@/components/EditorialDetails";
import { getEditorialRecord } from "@/data/editorial";

export const metadata: Metadata = {
  title: "非上場企業Valuation入門――企業価値から株主価値まで",
  description:
    "非上場企業評価におけるEVと株主価値、EBITDA正常化、EV/EBITDAマルチプル法、DCF法、ネットデット調整、Excelモデル構成を実務者向けに解説。",
};

const caseData = {
  company: "モデル製作株式会社",
  business: "国内B2B産業機器メーカー",
  yearEnd: "3月",
  unit: "百万円",
  revenue: 1100,
  reportedEbitda: 165,
  normalizedAdjustment: 15,
  normalizedEbitda: 180,
  cash: 80,
  debt: 330,
  netDebt: 250,
  nonOperatingAssets: 30,
  shares: 10000,
  ev: 1080,
};

const methods = [
  ["類似上場会社比較法", "対象会社に類似する上場会社", "市場で観察されるマルチプルを使える", "非上場企業との規模・成長性・流動性差が残る", "上場会社の財務数値、株価、EV、EBITDA等", "対象会社に比較可能な上場会社がある場合"],
  ["類似取引比較法", "過去のM&A取引", "実際の取引価格を参照できる", "取引条件、支配権、シナジー、時点差の影響を分解しにくい", "取引価格、対象会社財務、取引背景", "同業・近接業種の取引事例がある場合"],
  ["DCF法", "対象会社の将来FCF", "対象会社固有の事業計画を反映しやすい", "事業計画、WACC、継続価値への依存が大きい", "事業計画、税率、投資、運転資本、割引率", "中期計画の説明力があり、将来CFを作れる場合"],
  ["修正純資産法", "貸借対照表の資産・負債", "資産性の強い会社で説明しやすい", "将来収益力や無形価値を反映しにくい", "時価評価した資産・負債、簿外債務", "不動産保有会社、清算価値が重要な場合"],
  ["配当還元法", "将来配当", "少数株式の保有価値に近い考え方", "M&Aの支配権取引や成長投資の価値を表しにくい", "配当方針、配当可能利益、割引率", "少数株式、同族会社株式の一部評価など"],
];

const adjustmentRows = [
  ["報告EBITDA", "165", "FY2025の報告値"],
  ["過大なオーナー報酬", "+8", "市場水準との差額を正常化"],
  ["一過性のM&A検討費用", "+4", "継続的な事業運営費用ではないものとして調整"],
  ["一時的な工場移転費用", "+3", "将来反復しない前提で加算"],
  ["正常化後EBITDA", "180", "165 + 8 + 4 + 3"],
];

const mistakes = [
  "EVと株主価値を混同し、ネットデット調整を忘れる",
  "EBITDA調整を事業計画側にも入れて二重計上する",
  "現預金と有利子負債の符号を逆にする",
  "非事業用資産の加算を漏らす",
  "評価基準日と財務数値の基準日がずれている",
  "株式数の単位を間違え、1株当たり価値を過大または過小にする",
  "マルチプルの中央値を無条件で採用する",
  "DCFと事業計画の前提が整合していない",
  "簿外債務や偶発債務を株主価値ブリッジで検討していない",
  "過剰現金、運転資本不足、正常運転資本を同じものとして扱う",
  "コントロールプレミアムや非流動性ディスカウントを機械的に乗せる",
  "評価結果を一点で示し、前提感応度やレンジを説明しない",
];

const faqs = [
  ["EVと株主価値は何が違いますか？", "EVは事業そのものの価値を表し、株主価値はEVから有利子負債、現預金、非事業用資産、その他調整項目を反映した株主に帰属する価値です。"],
  ["非上場企業ではEV/EBITDAとDCFのどちらを使うべきですか？", "どちらか一つだけで決めるのではなく、会社の事業計画の説明力、類似会社や取引事例の有無、収益の安定性を踏まえて併用することが多いです。"],
  ["EBITDA正常化では何を調整しますか？", "非反復的な費用、オーナー企業特有の報酬・私的費用、買手には発生しない費用などを検討します。ただし証憑と将来計画との整合が必要です。"],
  ["非事業用資産はなぜ株主価値に加算しますか？", "EVが通常は事業価値を表すため、事業運営に不要な資産を別途株主に帰属する価値として加算する考え方です。"],
  ["評価結果をレンジで示すのはなぜですか？", "マルチプル、WACC、成長率、正常化調整、ネットデットなどの前提が変わると価値が変動するため、一点ではなく合理的な範囲で示す方が実務的です。"],
];

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="data-scroll">
      <table className="data-table min-w-[900px]">
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

function ExcelFigure({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <figure className="my-8 overflow-hidden border border-[#d8e0e5] bg-white">
      <figcaption className="border-b border-[#d8e0e5] bg-[#f7f8f6] px-4 py-3 text-sm font-bold text-[#102235]">{title}</figcaption>
      <div className="border-b border-[#d8e0e5] px-4 py-3 font-mono text-sm">
        数式バー：<span className="text-[#217346]"> =Valuation_Summary!H12</span>
      </div>
      <div className="data-scroll border-0">
        <table className="data-table min-w-[760px]">
          <thead>
            <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.join("-")}>
                <td className="font-mono text-[#607080]">{index + 1}</td>
                {row.map((cell, cellIndex) => {
                  const className = cell.includes("入力") ? "cell-input" : cell.includes("参照") ? "cell-link" : cell.includes("ERROR") ? "cell-error" : cell.includes("OK") ? "cell-check" : "cell-formula";
                  return <td key={`${cell}-${cellIndex}`} className={className}>{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 border-t border-[#d8e0e5] p-4 text-xs md:grid-cols-4">
        <span className="cell-input px-2 py-1">青：入力セル</span>
        <span className="cell-formula px-2 py-1">黒：同一シート数式</span>
        <span className="cell-link px-2 py-1">緑：他シート参照</span>
        <span className="cell-error px-2 py-1">赤：チェックエラー</span>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-[#d8e0e5] bg-[#f7f8f6] px-4 py-3 text-xs">
        {["Guide", "Inputs", "Historical", "Adjustments", "Multiples", "DCF", "Valuation Summary", "Checks"].map((sheet) => (
          <span key={sheet} className="shrink-0 rounded-t border border-[#d8e0e5] bg-white px-3 py-1">{sheet}</span>
        ))}
      </div>
    </figure>
  );
}

export default function PrivateCompanyValuationPage() {
  const editorialRecord = getEditorialRecord("/private-company-valuation");
  const shareholderValue = caseData.ev - caseData.debt + caseData.cash + caseData.nonOperatingAssets;
  const perShareYen = (shareholderValue * 1_000_000) / caseData.shares;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
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
            <span>非上場企業Valuation入門</span>
          </nav>
          <div className="eyebrow">PRIVATE COMPANY VALUATION</div>
          <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">非上場企業Valuation入門――企業価値から株主価値まで</h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">
            EV、株主価値、EBITDA正常化、ネットデット、非事業用資産、評価レンジ、Excelモデル構成を、{caseData.company}の架空事例で実務順に整理します。
          </p>
          <dl className="mt-6 grid gap-3 text-sm text-[#607080] md:grid-cols-4">
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">対象</dt><dd>M&A/FAS/投資/経営企画</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">難易度</dt><dd>実務入門〜中級</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">目安時間</dt><dd>25〜35分</dd></div>
            <div className="border border-[#d8e0e5] bg-white p-3"><dt className="font-bold text-[#102235]">単位</dt><dd>{caseData.unit}</dd></div>
          </dl>
        </div>
      </section>

      <div className="article-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_270px] xl:gap-20">
        <article className="article-copy min-w-0">
          <div className="callout warning">
            <strong>前提</strong><br />
            本ページは教育目的の架空事例です。会計・税務・法務・投資判断の個別助言ではありません。実案件では対象会社固有の事実、契約条件、税務・法務・会計上の論点を専門家と確認してください。
          </div>

          <h2 id="what-is-valuation">1. Valuationとは何か</h2>
          <p>
            Valuationは「会社はいくらか」を一つの数字で当てる作業ではありません。価格、企業価値、株主価値、会計上の純資産はそれぞれ異なる概念です。価格は交渉で決まる取引条件、EVは事業全体の価値、株主価値は株主に帰属する価値、会計上の純資産は帳簿上の資産と負債の差額です。
          </p>
          <div className="formula">企業価値（EV） − 有利子負債 ＋ 現預金 ＋ 非事業用資産 − 株主価値調整項目 ＝ 株主価値</div>
          <p>
            M&Aでよく使うEV/EBITDAマルチプル法は、まずEVを求めます。その後、ネットデットや非事業用資産などを調整して株主価値にブリッジします。
          </p>

          <h2 id="purpose-date">2. 評価目的と基準日</h2>
          <p>
            評価目的が変わると、見るべき前提、採用手法、必要な説明資料も変わります。M&Aでは交渉可能な買収価格、株式譲渡では譲渡対象株式の価値、事業承継では税務・承継設計との整合、資本政策では発行条件や希薄化、減損検討では会計上の回収可能性が問題になります。
          </p>
          <p>
            評価基準日は、どの時点の財務数値・事業計画・ネットデットを使うかを決める土台です。基準日後に発生した事象を安易に織り込むと、評価時点の情報と後知恵が混在します。後発事象を反映する場合は、目的、入手可能性、反映理由を明確にします。
          </p>

          <h2 id="methods">3. 主な評価手法</h2>
          <DataTable headers={["手法", "評価対象", "長所", "短所", "必要なデータ", "適する場面"]} rows={methods} />

          <h2 id="private-company-issues">4. 非上場企業特有の論点</h2>
          <p>
            非上場企業では、オーナー報酬、オーナー関連費用、私的経費、一過性損益、過剰現金、非事業用資産、簿外債務、偶発債務、退職給付、未払残業代など、報告利益や純資産をそのまま使いにくい論点が出ます。
          </p>
          <p>
            また、顧客集中、キーパーソン依存、株式の流動性の低さ、少数株主持分、支配権の有無も評価レンジに影響します。ただし、コントロールプレミアムや非流動性ディスカウントを機械的に適用するのは避けるべきです。すでにマルチプルや取引事例に同様の要素が含まれている場合、二重調整になる可能性があります。
          </p>

          <h2 id="ebitda-normalization">5. EBITDAの正常化</h2>
          <p>
            {caseData.company}のFY2025報告EBITDAは{caseData.reportedEbitda}百万円です。ここでは、過大なオーナー報酬、一過性のM&A検討費用、一時的な工場移転費用を調整し、正常化後EBITDAを{caseData.normalizedEbitda}百万円とします。
          </p>
          <DataTable headers={["項目", "金額", "説明"]} rows={adjustmentRows} />
          <h3>調整可否の判定軸</h3>
          <ul>
            <li>非反復的か</li>
            <li>事業運営に必要か</li>
            <li>買手にも発生するか</li>
            <li>客観的な証憑があるか</li>
            <li>将来の事業計画と整合するか</li>
          </ul>
          <ExcelFigure title="Excel風図解：EBITDA正常化ブリッジ" rows={[
            ["A1 入力: 報告EBITDA", "B1 165", "C1 参照: Historical", "D1 OK"],
            ["A2 入力: Owner comp adj.", "B2 +8", "C2 証憑メモ", "D2 OK"],
            ["A3 入力: M&A cost adj.", "B3 +4", "C3 非反復", "D3 OK"],
            ["A4 入力: Relocation adj.", "B4 +3", "C4 非反復", "D4 OK"],
            ["A5 正常化後EBITDA", "B5 =SUM(B1:B4)", "C5 参照: Summary", "D5 OK"],
          ]} />

          <h2 id="ev-to-equity">6. EVから株主価値へのブリッジ</h2>
          <p>
            EVを{caseData.ev.toLocaleString()}百万円と仮定します。有利子負債{caseData.debt}百万円を控除し、現預金{caseData.cash}百万円と非事業用資産{caseData.nonOperatingAssets}百万円を加算すると、株主価値は{shareholderValue.toLocaleString()}百万円です。
          </p>
          <div className="formula">
            株主価値 = 1,080 − 330 + 80 + 30 = 860百万円<br />
            1株当たり価値 = 860百万円 × 1,000,000円 ÷ 10,000株 = {perShareYen.toLocaleString()}円
          </div>
          <p>
            単位は百万円です。株式数は「株」単位のため、1株当たり価値を計算するときは百万円を円に変換します。この単位変換を忘れると、1株当たり価値が100万倍ずれます。
          </p>
          <ExcelFigure title="Excel風図解：EVから株主価値へのブリッジ" rows={[
            ["A1 入力: EV", "B1 1,080", "C1 参照: Multiples/DCF", "D1 OK"],
            ["A2 入力: Debt", "B2 -330", "C2 Historical BS", "D2 OK"],
            ["A3 入力: Cash", "B3 +80", "C3 Historical BS", "D3 OK"],
            ["A4 入力: Non-operating assets", "B4 +30", "C4 DD memo", "D4 OK"],
            ["A5 Equity value", "B5 =SUM(B1:B4)", "C5 860", "D5 OK"],
          ]} />

          <h2 id="excel-structure">7. Excelモデルの全体構成</h2>
          <DataTable headers={["シート", "役割", "主な内容"]} rows={[
            ["Guide", "利用方法と前提", "評価目的、基準日、単位、セル色ルール、免責"],
            ["Inputs", "主要入力", "評価基準日、株式数、現預金、有利子負債、非事業用資産"],
            ["Historical", "実績財務", "FY2025売上高、報告EBITDA、BS主要項目"],
            ["Adjustments", "正常化調整", "EBITDA調整、証憑、反復性、買手発生有無"],
            ["Business Plan", "事業計画", "売上、利益、投資、運転資本、税金"],
            ["Multiples", "マルチプル法", "EV/EBITDAレンジ、採用マルチプル、EV"],
            ["DCF", "DCF法", "FCF、WACC、継続価値、感応度"],
            ["Valuation Summary", "評価結果", "EVレンジ、株主価値レンジ、1株当たり価値"],
            ["Checks", "検証", "符号、単位、ネットデット、株式数、レンジ整合"],
          ]} />
          <p>入力セルは青、同一シート数式は黒、他シート参照は緑、チェックエラーは赤で統一します。色だけに依存せず、凡例とセル種別ラベルも併用します。</p>

          <h2 id="excel-figures">8. Excelワークシート風図解</h2>
          <ExcelFigure title="Excel風図解：評価手法別の株主価値レンジ" rows={[
            ["A1 Method", "B1 Low", "C1 Mid", "D1 High"],
            ["A2 EV/EBITDA", "B2 760", "C2 860", "D2 940"],
            ["A3 DCF", "B3 790", "C3 880", "D3 990"],
            ["A4 修正純資産", "B4 620", "C4 680", "D4 720"],
            ["A5 Conclusion", "B5 760", "C5 860", "D5 940"],
          ]} />
          <ExcelFigure title="Excel風図解：Valuation Summaryシート" rows={[
            ["A1 入力: Valuation date", "B1 FY2025/3", "C1 Guide参照", "D1 OK"],
            ["A2 Normalized EBITDA", "B2 180", "C2 Adjustments参照", "D2 OK"],
            ["A3 EV", "B3 1,080", "C3 Multiples参照", "D3 OK"],
            ["A4 Net debt", "B4 -250", "C4 Inputs参照", "D4 OK"],
            ["A5 Equity value", "B5 860", "C5 =B3+B4+B6", "D5 OK"],
          ]} />

          <h2 id="multiple-dcf">9. 評価結果の読み方</h2>
          <p>
            評価値は「正解」ではなく、前提条件に基づくレンジです。EV/EBITDAマルチプル法とDCF法の結果が大きく異なる場合は、正常化後EBITDA、採用マルチプル、事業計画の成長率、利益率、設備投資、運転資本、WACC、継続成長率、ネットデット基準日を確認します。
          </p>
          <p>
            マルチプル法は市場・取引事例との相対感を見やすく、DCF法は対象会社固有の将来計画を反映しやすい一方で、長期前提の影響を強く受けます。両者の差は、どちらかが間違いというより、前提と見方の違いを示すサインです。
          </p>

          <h2 id="common-mistakes">10. よくある誤り</h2>
          <ol>{mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ol>

          <h2 id="faq">FAQ</h2>
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <section key={question} className="border border-[#d8e0e5] bg-white p-5">
                <h3 className="mt-0 text-lg">{question}</h3>
                <p>{answer}</p>
              </section>
            ))}
          </div>

          <section className="mt-10">
            <div className="eyebrow">NEXT READS</div>
            <h2 className="mt-2 text-2xl font-bold text-[#102235]">次に学ぶページ</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["EV/EBITDAマルチプル法の実務", "#multiple-dcf", "採用マルチプルと評価レンジの読み方を確認する"],
                ["DCF法のExcel実装", "/downloads", "DCF評価モデルをダウンロードして構造を確認する"],
                ["財務三表モデル", "/three-statements", "PL・BS・CFの連動に戻って確認する"],
                ["前提条件の設計", "/assumptions", "事業計画とシナリオの置き方を学ぶ"],
                ["モデル品質基準", "/quality-standard", "評価モデルのチェック観点を確認する"],
              ].map(([title, href, body]) => (
                <Link key={title} href={href} className="border border-[#d8e0e5] bg-white p-5 hover:border-[#147d73]">
                  <strong className="text-[#102235]">{title}</strong>
                  <span className="mt-2 block text-sm text-[#607080]">{body}</span>
                </Link>
              ))}
            </div>
          </section>
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
              {[
                ["what-is-valuation", "Valuationとは何か"],
                ["purpose-date", "評価目的と基準日"],
                ["methods", "主な評価手法"],
                ["private-company-issues", "非上場企業特有の論点"],
                ["ebitda-normalization", "EBITDA正常化"],
                ["ev-to-equity", "EVから株主価値"],
                ["excel-structure", "Excel構成"],
                ["common-mistakes", "よくある誤り"],
                ["faq", "FAQ"],
              ].map(([id, label], index) => (
                <li key={id}><a href={`#${id}`} className="hover:text-[#147d73]">{String(index + 1).padStart(2, "0")} {label}</a></li>
              ))}
            </ol>
            <Link href="/downloads" className="button green mt-5 w-full text-sm">Excelを確認する</Link>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
