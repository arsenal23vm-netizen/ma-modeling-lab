import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/editorial-policy", {
  title: "編集方針",
  description: "Finance Modeling Labの記事制作、更新、免責、広告・アフィリエイト表記に関する方針。",
});

export default function EditorialPolicyPage() {
  return (
    <div className="container max-w-4xl py-14">
      <div className="eyebrow">編集方針</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">編集方針</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        Finance Modeling Labは、財務モデリングとM&A実務の学習に役立つ情報を、再現性・検証可能性・読みやすさを重視して編集します。
      </p>
      <div className="article-copy mt-10">
        <h2>記事制作の基準</h2>
        <ul>
          <li>数式、前提条件、勘定科目の意味が追えるように説明します。</li>
          <li>モデルの設計思想とExcel実装を切り離さずに扱います。</li>
          <li>サンプル数値は教育目的の架空データとして扱います。</li>
          <li>実案件で判断が分かれる論点は、専門家確認が必要であることを明示します。</li>
        </ul>
        <h2>更新・訂正</h2>
        <p>
          記事は必要に応じて更新します。誤り、リンク切れ、説明不足に気づいた場合は、
          <Link href="/request" className="font-bold text-[#147d73]">
            リクエストフォーム
          </Link>
          から連絡できます。
        </p>
        <h2>広告・アフィリエイト</h2>
        <p>
          当サイトには、将来的にAmazonアソシエイト等のアフィリエイトリンクを含む場合があります。書籍やサービスの紹介では、読者の学習導線に合うかを優先し、過度な購入誘導を避けます。
        </p>
        <h2>免責</h2>
        <p>
          本サイトは投資助言、税務・法務・会計上の助言、特定取引の推奨を目的としていません。詳細は
          <Link href="/disclaimer" className="font-bold text-[#147d73]">
            免責事項
          </Link>
          をご確認ください。
        </p>
      </div>
    </div>
  );
}
