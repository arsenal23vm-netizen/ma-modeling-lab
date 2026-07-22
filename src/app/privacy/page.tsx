import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/privacy", {
  title: "プライバシーポリシー",
  description: "Finance Modeling Labのアクセス解析、Cookie、アフィリエイトリンク、個人情報の取り扱いについて。",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <div className="eyebrow">プライバシーポリシー</div>
      <h1 className="mt-3 text-4xl font-bold">プライバシーポリシー</h1>
      <div className="prose mt-8 space-y-8">
        <section>
          <h2>アクセス解析について</h2>
          <p>
            Finance Modeling Labでは、サイト改善と利用状況の分析のため、Google Analyticsを使用する場合があります。
            Google AnalyticsはCookie等を利用して、ページ閲覧、流入元、利用端末などの情報を収集することがあります。
          </p>
        </section>
        <section>
          <h2>収集した情報の利用目的</h2>
          <p>
            収集した情報は、人気ページの把握、コンテンツ改善、導線改善、サイト品質の向上のために利用します。
            個人を特定する目的では利用しません。
          </p>
        </section>
        <section>
          <h2>イベント計測について</h2>
          <p>
            Amazonリンク、Excelテンプレート、講座、問い合わせ、ニュースレター登録などのCTAクリックを、サイト改善のために計測する場合があります。
          </p>
        </section>
        <section>
          <h2>アフィリエイトリンクについて</h2>
          <p>
            当サイトには、将来的にAmazonアソシエイト等のアフィリエイトリンクを含む場合があります。
            リンク先の商品・サービスの購入、契約、利用については、リンク先事業者の条件をご確認ください。
          </p>
        </section>
        <section>
          <h2>免責</h2>
          <p>
            当サイトの情報は教育目的で提供しています。実案件では、会計士、税理士、弁護士などの専門家と、対象会社固有の事実関係をご確認ください。
          </p>
        </section>
      </div>
    </div>
  );
}
