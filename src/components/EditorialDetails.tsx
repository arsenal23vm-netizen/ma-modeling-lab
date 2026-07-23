import Link from "next/link";
import { EDITORIAL_AUTHOR, type EditorialRecord } from "@/data/editorial";

type Breadcrumb = {
  name: string;
  href: string;
};

const SITE_ROOT = "https://arsenal23vm-netizen.github.io/financial-modeling-lab";

function absoluteUrl(href: string) {
  const relativeHref = href === "/" ? "" : href.replace(/^\//, "");
  return new URL(relativeHref, `${SITE_ROOT}/`).toString();
}

function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function EditorialDetails({
  record,
  breadcrumbs,
}: {
  record: EditorialRecord;
  breadcrumbs: readonly Breadcrumb[];
}) {
  const authorUrl = absoluteUrl(EDITORIAL_AUTHOR.url);
  const articleUrl = absoluteUrl(record.href);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: record.title,
    description: record.description,
    inLanguage: "ja",
    mainEntityOfPage: articleUrl,
    datePublished: record.publishedDate,
    dateModified: record.modifiedDate,
    author: {
      "@type": "Organization",
      name: EDITORIAL_AUTHOR.name,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: EDITORIAL_AUTHOR.name,
      url: absoluteUrl("/"),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: absoluteUrl(breadcrumb.href),
    })),
  };

  return (
    <section className="mt-10 border-t border-[#d8e0e5] pt-8" aria-labelledby="editorial-details-heading">
      <h2 id="editorial-details-heading" className="mt-0 text-2xl font-bold text-[#102235]">
        編集情報
      </h2>
      <dl className="mt-4 grid gap-3 text-sm text-[#607080] sm:grid-cols-3">
        <div>
          <dt className="font-bold text-[#102235]">著者</dt>
          <dd>
            <Link href={EDITORIAL_AUTHOR.url} className="text-[#147d73] underline underline-offset-4">
              {EDITORIAL_AUTHOR.name}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="font-bold text-[#102235]">公開日</dt>
          <dd><time dateTime={record.publishedDate}>{formatDate(record.publishedDate)}</time></dd>
        </div>
        <div>
          <dt className="font-bold text-[#102235]">更新日</dt>
          <dd><time dateTime={record.modifiedDate}>{formatDate(record.modifiedDate)}</time></dd>
        </div>
      </dl>

      <h3 className="mt-8 text-lg font-bold text-[#102235]">参考資料</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {record.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#147d73] underline underline-offset-4"
            >
              {source.title}
            </a>
            <span className="text-[#607080]"> — {source.publisher}（参照日：<time dateTime={source.accessedDate}>{formatDate(source.accessedDate)}</time>）</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-bold text-[#102235]">変更履歴</h3>
      <div className="data-scroll mt-3">
        <table className="data-table min-w-[520px]">
          <thead>
            <tr>
              <th scope="col">更新日</th>
              <th scope="col">変更内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><time dateTime={record.modifiedDate}>{formatDate(record.modifiedDate)}</time></td>
              <td>{record.revisionSummary}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }} />
    </section>
  );
}
