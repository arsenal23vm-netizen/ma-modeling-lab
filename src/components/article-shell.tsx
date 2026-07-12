import Link from "next/link";
import { StatementOverview } from "@/components/statement-overview";
import { bsRows, cfRows, plRows } from "@/data/statements";
import { lessons } from "@/data/site";

type Section = {
  id: string;
  label: string;
};

export function ArticleShell({
  no,
  title,
  lead,
  sections,
  children,
}: {
  no: string;
  title: string;
  lead: string;
  sections: Section[];
  children: React.ReactNode;
}) {
  const lesson = lessons.find((item) => item.no === no);
  const lessonIndex = lessons.findIndex((item) => item.no === no);
  const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : undefined;
  const relatedLessons = lessons.filter((item) => item.no !== no).slice(0, 3);
  const publishedDate = "2026-07-12";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: lead,
    inLanguage: "ja",
    dateModified: publishedDate,
    datePublished: publishedDate,
    author: { "@type": "Organization", name: "Finance Modeling Lab" },
    publisher: { "@type": "Organization", name: "Finance Modeling Lab" },
  };

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-10 md:py-14">
          <nav className="mb-5 text-sm text-[#607080]" aria-label="パンくずリスト">
            <Link href="/" className="hover:text-[#147d73]">
              ホーム
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{title}</span>
          </nav>
          <div className="eyebrow">LESSON {no} / FINANCIAL MODELING</div>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-[-.04em] text-[#102235] md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">{lead}</p>
          <dl className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#607080]">
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">カテゴリ</dt>
              <dd>{lesson?.level ?? "実務"}</dd>
            </div>
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">読了時間</dt>
              <dd>{lesson?.time ?? "約10分"}</dd>
            </div>
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">更新日</dt>
              <dd>更新日：2026年7月12日</dd>
            </div>
          </dl>
        </div>
      </section>
      <div className="article-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_270px] xl:gap-20">
        <article className="article-copy min-w-0">
          {title.includes("損益計算書") && (
            <>
              <h2 id="overview">損益計算書の全体像</h2>
              <p>各勘定科目の意味、算定方法、計画前提、Excel実装を一つの表で確認します。</p>
              <StatementOverview rows={plRows} />
            </>
          )}
          {title.includes("貸借対照表") && (
            <>
              <h2 id="overview">貸借対照表の全体像</h2>
              <p>通常の運転資本に加え、M&Aで生じる取得対価配分、のれん、識別可能無形資産、税効果まで整理します。</p>
              <StatementOverview rows={bsRows} />
            </>
          )}
          {title.includes("キャッシュ・フロー計算書") && (
            <>
              <h2 id="overview">キャッシュ・フロー計算書の全体像（間接法）</h2>
              <p>税引前当期純利益を起点とする間接法で、非資金項目、運転資本、投資活動、財務活動を整理します。</p>
              <StatementOverview rows={cfRows} />
            </>
          )}
          {children}
          <div className="callout warning">
            <strong>重要</strong>
            <br />
            本ページは教育目的です。実案件では会計士・税理士・弁護士などの専門家と、対象会社固有の事実関係を確認してください。
          </div>
          {nextLesson && (
            <Link href={`/${nextLesson.slug}`} className="mt-8 block border border-[#d8e0e5] bg-white p-5 shadow-sm hover:border-[#147d73]">
              <span className="eyebrow">NEXT LESSON</span>
              <strong className="mt-2 block text-xl text-[#102235]">{nextLesson.title}</strong>
              <span className="mt-1 block text-sm text-[#607080]">{nextLesson.summary}</span>
            </Link>
          )}
        </article>
        <aside className="lg:pt-1">
          <div className="sticky top-24 border-t-4 border-[#102235] bg-white p-5 shadow-sm">
            <strong className="text-sm text-[#102235]">このページの内容</strong>
            <ol className="mt-3 space-y-2 text-sm text-[#607080]">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:text-[#147d73]">
                    {String(index + 1).padStart(2, "0")} {section.label}
                  </a>
                </li>
              ))}
            </ol>
            <Link href="/tools" className="button green mt-5 w-full text-sm">
              ツールで試す
            </Link>
          </div>
          <div className="mt-6 border border-[#d8e0e5] bg-white p-5">
            <strong className="text-sm text-[#102235]">関連する記事</strong>
            <div className="mt-3 space-y-3">
              {relatedLessons.map((item) => (
                <Link key={item.slug} href={`/${item.slug}`} className="block text-sm text-[#607080] hover:text-[#147d73]">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </>
  );
}
