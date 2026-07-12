import Link from "next/link";

export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`callout ${compact ? "text-sm" : ""}`}>
      <strong>広告・アフィリエイト表記</strong>
      <br />
      当サイトには、将来的にAmazonアソシエイト等のアフィリエイトリンクを含む場合があります。現在の書籍リンクはISBNによるAmazon検索ページであり、価格・在庫・版はリンク先で確認してください。
      <Link href="/privacy" className="ml-1 font-bold text-[#147d73]">
        詳細はプライバシーポリシーへ
      </Link>
    </div>
  );
}
