import Link from "next/link";
import { EditorialDetails } from "@/components/EditorialDetails";
import { EDITORIAL_AUTHOR, getEditorialRecord, type ArticleHref } from "@/data/editorial";
import { getRelatedContent } from "@/data/content-catalog";

type DcfSection = {
  id: string;
  label: string;
};

type DcfStageLink = {
  href: string;
  label: string;
};

export function DcfCommonErrors({ errors }: { errors: readonly [{ title: string; body: string }, { title: string; body: string }] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {errors.map((error) => (
        <section key={error.title} className="dcf-error-card" data-dcf-common-error="true">
          <h3>{error.title}</h3>
          <p>{error.body}</p>
        </section>
      ))}
    </div>
  );
}

export function DcfReviewCheck({ children }: { children: React.ReactNode }) {
  return <div className="callout" data-dcf-review-check="true"><strong>レビュー・チェック</strong><br />{children}</div>;
}

export function DcfLessonShell({
  number,
  href,
  title,
  lead,
  readingTime,
  sections,
  previous,
  next,
  children,
}: {
  number: string;
  href: ArticleHref;
  title: string;
  lead: string;
  readingTime: string;
  sections?: readonly DcfSection[];
  previous: DcfStageLink;
  next: DcfStageLink;
  children: React.ReactNode;
}) {
  const editorialRecord = getEditorialRecord(href);
  const related = getRelatedContent(href, 3);

  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-[#f7f8f6]">
        <div className="container py-10 md:py-14">
          <nav className="mb-5 text-sm text-[#607080]" aria-label="パンくずリスト">
            <Link href="/" className="hover:text-[#147d73]">ホーム</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/valuation" className="hover:text-[#147d73]">Valuation</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/valuation/dcf" className="hover:text-[#147d73]">DCF評価</Link>
            <span aria-hidden="true"> / </span>
            <span>{title}</span>
          </nav>
          <div className="eyebrow">DCFシリーズ {number} / 05</div>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-[-.04em] text-[#102235] md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#607080]">{lead}</p>
          <dl className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#607080]">
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">著者</dt>
              <dd>{EDITORIAL_AUTHOR.name}</dd>
            </div>
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">読了時間</dt>
              <dd>{readingTime}</dd>
            </div>
            <div className="rounded-full border border-[#d8e0e5] bg-white px-3 py-1">
              <dt className="sr-only">更新日</dt>
              <dd>更新日：<time dateTime={editorialRecord.modifiedDate}>{editorialRecord.modifiedDate}</time></dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="article-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_270px] xl:gap-20">
        <article className="article-copy min-w-0">
          {children}

          <div className="callout warning">
            <strong>利用上の注意</strong>
            <br />
            本シリーズは架空企業を使う教育目的のサンプルで、画面上の学習・レビュー用です。外部から取得したライブ市場データではなく、個別案件の意思決定に利用できる状態ではありません。
          </div>

          <section className="dcf-workbook-cta" aria-labelledby={`workbook-${number}`}>
            <div className="eyebrow">DCF Excel教材</div>
            <h2 id={`workbook-${number}`} className="mt-2">同じ数値をExcelで再現する</h2>
            <p>9シート構成の教育用ワークブックで、入力セル、計算セル、チェックを確認できます。</p>
            <Link href="/downloads/dcf-valuation-model" className="button green mt-5">
              DCF評価モデルの使い方を見る
            </Link>
          </section>

          <nav className="dcf-stage-nav" aria-label="DCFシリーズの前後記事">
            <Link href={previous.href} className="dcf-stage-link">
              <span className="eyebrow">前のレッスン</span>
              <strong>{previous.label}</strong>
            </Link>
            <Link href={next.href} className="dcf-stage-link dcf-stage-link-next">
              <span className="eyebrow">次のレッスン</span>
              <strong>{next.label}</strong>
            </Link>
          </nav>

          <EditorialDetails
            record={editorialRecord}
            breadcrumbs={[
              { name: "ホーム", href: "/" },
              { name: "Valuation", href: "/valuation" },
              { name: "DCF評価", href: "/valuation/dcf" },
              { name: editorialRecord.title, href: editorialRecord.href },
            ]}
          />
        </article>

        <aside className="lg:pt-1">
          {sections && sections.length > 0 && (
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
              <Link href="/downloads/dcf-valuation-model" className="button green mt-5 w-full text-sm">
                Excel教材を見る
              </Link>
            </div>
          )}
          <div className="mt-6 border border-[#d8e0e5] bg-white p-5">
            <strong className="text-sm text-[#102235]">関連するValuation教材</strong>
            <div className="mt-3 space-y-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-[#607080] hover:text-[#147d73]">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
