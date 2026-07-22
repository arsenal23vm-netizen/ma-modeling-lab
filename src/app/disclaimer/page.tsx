import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/disclaimer", { title: "免責事項", description: "Finance Modeling Labの情報利用、専門家確認、正確性、サンプル数値、広告表示に関する免責事項。" });

export default function Page() {
  return (
    <div className="container max-w-4xl py-14">
      <div className="eyebrow">LEGAL & EDITORIAL POLICY</div>
      <h1 className="mt-2 text-4xl font-bold tracking-[-.04em] text-[#102235]">免責事項</h1>
      <div className="article-copy mt-8">
        <h2>情報の目的</h2>
        <p>本サイトは、M&A、財務モデリング、会計およびExcel設計に関する一般的な学習情報を提供するものです。投資助言、税務・法務・会計上の助言、特定取引の推奨を目的としていません。</p>
        <h2>専門家への確認</h2>
        <p>実際の取引では、適用される法令、会計基準、税制、契約条件および対象会社の事実関係が異なります。意思決定の前に、資格を有する専門家へ確認してください。</p>
        <h2>正確性と責任</h2>
        <p>掲載内容の正確性・完全性・最新性の確保に努めますが、これらを保証するものではありません。本サイトの利用により生じた損害について責任を負いません。誤りや更新希望がある場合は、リクエストフォームからご連絡ください。</p>
        <h2>サンプル数値</h2>
        <p>記事およびツール内の企業名・数値・計算例は説明目的の架空データです。実在する企業や取引との関連はありません。</p>
        <h2>広告・アフィリエイト</h2>
        <p>当サイトには、将来的にAmazonアソシエイト等のアフィリエイトリンクを含む場合があります。詳しい掲載方針は<Link href="/editorial-policy" className="font-bold text-[#147d73]">編集方針</Link>をご確認ください。</p>
      </div>
    </div>
  );
}
