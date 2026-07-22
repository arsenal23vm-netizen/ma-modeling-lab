import Link from "next/link";
import { contentCatalog, type ContentEntry } from "@/data/content-catalog";

type TopicHubProps = {
  topic: ContentEntry["topic"];
  eyebrow: string;
  title: string;
  lead: string;
  learningSteps: readonly [string, string, string];
};

const unpublishedHrefs = new Set<string>();

const futureTopics: Record<ContentEntry["topic"], readonly string[]> = {
  "financial-modeling": ["事業計画の高度化", "資金調達・借入スケジュール", "モデルレビューの実務"],
  valuation: ["PPA（買収価格配分）", "Sources & Uses", "LBO（レバレッジド・バイアウト）"],
  "ma-modeling": ["PPA（買収価格配分）", "Sources & Uses", "LBO（レバレッジド・バイアウト）"],
  excel: ["感応度分析の追加テンプレート", "M&A案件のレビュー用シート", "案件引継ぎ用のモデルガイド"],
};

const typeLabels: Record<ContentEntry["type"], string> = {
  article: "解説",
  hub: "案内",
  download: "Excel",
  tool: "ツール",
  reference: "参考",
};

const audienceCopy: Record<ContentEntry["topic"], string> = {
  "financial-modeling": "財務三表や事業計画を、第三者が確認できるExcelモデルとして組み立てたい方に向けたテーマです。",
  valuation: "投資判断やM&Aの検討で、企業価値の根拠を数字と前提で説明したい方に向けたテーマです。",
  "ma-modeling": "M&A案件の論点を、事業計画・価値評価・レビューの順に整理したい方に向けたテーマです。",
  excel: "解説を読むだけでなく、Excelを操作しながら財務モデリングのつながりを確かめたい方に向けた教材です。",
};

function getAvailableContent(topic: ContentEntry["topic"], currentHref: string) {
  const seen = new Set<string>();

  return contentCatalog
    .filter((item) => (
      item.topic === topic || (topic === "excel" && item.href === "/downloads/dcf-valuation-model")
    ) && item.href !== currentHref && !unpublishedHrefs.has(item.href))
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, "ja"));
}

export function TopicHub({ topic, eyebrow, title, lead, learningSteps }: TopicHubProps) {
  const currentHref = contentCatalog.find((item) => item.topic === topic && item.type === "hub" && item.href !== "/downloads")?.href ?? "";
  const availableContent = getAvailableContent(topic, currentHref);

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-white">
        <div className="container max-w-5xl py-16 md:py-20">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-3 text-4xl font-bold tracking-[-.05em] text-[#102235] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#607080]">{lead}</p>
        </div>
      </section>

      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container grid gap-8 py-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="eyebrow">FOR WHO</div>
            <h2 className="section-title mt-2">こんな方のためのテーマです</h2>
          </div>
          <p className="max-w-3xl text-[1.02rem] leading-8 text-[#607080]">{audienceCopy[topic]}</p>
        </div>
      </section>

      <section className="container py-16">
        <div>
          <div className="eyebrow">LEARNING ORDER</div>
          <h2 className="section-title mt-2">3ステップで進める</h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {learningSteps.map((step, index) => (
            <li key={step} className="border border-[#d8e0e5] bg-white p-5">
              <span className="font-mono text-sm font-bold text-[#147d73]">STEP {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 font-bold leading-7 text-[#102235]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">AVAILABLE NOW</div>
              <h2 className="section-title mt-2">現在利用できるコンテンツ</h2>
            </div>
            <p className="max-w-lg text-sm text-[#607080]">注目コンテンツを先頭に、同じリンクを重複させずに掲載しています。</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {availableContent.map((item) => (
              <Link key={item.href} href={item.href} className="border border-[#d8e0e5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#147d73] hover:shadow-lg">
                <span className="text-xs font-bold text-[#147d73]">{typeLabels[item.type]} ・ {item.level} ・ {item.readingTime}</span>
                <h3 className="mt-3 text-xl font-bold text-[#102235]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#607080]">{item.summary}</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#147d73]">読む →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="max-w-4xl border-l-4 border-[#217346] bg-[#f7f8f6] p-6 md:p-8">
          <div className="eyebrow">COMING NEXT</div>
          <h2 className="mt-2 text-2xl font-bold tracking-[-.04em] text-[#102235]">今後扱うテーマ</h2>
          <p className="mt-3 text-sm leading-6 text-[#607080]">公開前のテーマはリンクにせず、学習の見通しとしてのみ掲載しています。</p>
          <ul className="mt-5 grid gap-2 text-sm font-semibold text-[#102235] md:grid-cols-3">
            {futureTopics[topic].map((item) => <li key={item}>・{item}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
