import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Finance Modeling Labについて",
  description: "Finance Modeling Labの目的、対象読者、運営方針について。",
};

const values = [
  {
    title: "実務で再現できること",
    body: "概念だけで終わらせず、Excelシート、セル参照、チェック行、前提条件の置き方まで落とし込みます。",
  },
  {
    title: "会計・ファイナンス・M&Aをつなぐこと",
    body: "PL、BS、CF、企業価値評価、財務デューデリジェンスを別々に扱わず、モデル上の流れとして整理します。",
  },
  {
    title: "誇張しないこと",
    body: "投資助言や案件判断の代替ではなく、学習・検討の土台として使える情報を目指します。",
  },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-14">
      <div className="eyebrow">ABOUT FINANCE MODELING LAB</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">Finance Modeling Labについて</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        Finance Modeling Labは、非上場企業M&A、財務モデリング、Excel設計、会計論点を、実務で手を動かせる粒度まで整理する学習メディアです。
      </p>
      <div className="article-copy mt-10">
        <h2>このサイトの目的</h2>
        <p>
          財務モデリングを学ぶとき、多くの人が「理論は分かるが、Excelでどう組むのか」で手が止まります。このサイトでは、勘定科目、前提条件、財務三表、チェック行、アウトプットのつなぎ方を、実務で検証しやすい順番で解説します。
        </p>
        <h2>対象読者</h2>
        <ul>
          <li>M&A、FAS、投資、経営企画、事業承継支援に関わる実務者</li>
          <li>財務三表モデルやDCFモデルをExcelで作れるようになりたい学習者</li>
          <li>自己流のExcelモデルを、他人がレビューできる構造へ改善したい方</li>
        </ul>
        <h2>運営方針</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <section key={value.title} className="border border-[#d8e0e5] bg-white p-5">
              <h3 className="mt-0 text-base">{value.title}</h3>
              <p className="text-sm">{value.body}</p>
            </section>
          ))}
        </div>
        <div className="callout warning">
          <strong>利用上の注意</strong>
          <br />
          本サイトは教育目的の情報提供サイトです。実案件では、会計士、税理士、弁護士、ファイナンシャルアドバイザー等の専門家と個別事実を確認してください。
        </div>
        <p>
          掲載内容の考え方や修正方針については、
          <Link href="/editorial-policy" className="font-bold text-[#147d73]">
            編集方針
          </Link>
          をご確認ください。
        </p>
      </div>
    </div>
  );
}
