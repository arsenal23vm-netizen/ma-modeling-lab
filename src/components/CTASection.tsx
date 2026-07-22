import { CtaLink } from "@/components/CtaLink";

type CTASectionProps = {
  title?: string;
  body?: string;
  location: string;
};

export function CTASection({
  title = "次の実務ステップへ進む",
  body = "財務モデルの作り方を読むだけで終わらせず、ツール、書籍、リクエストを使って自分の案件・学習テーマに引き寄せてください。",
  location,
}: CTASectionProps) {
  return (
    <section className="mt-10 border border-[#d8e0e5] bg-[#102235] p-6 text-white md:p-8">
      <div className="text-xs font-bold tracking-[.15em] text-[#77c7bc]">次の実践</div>
      <h2 className="mt-2 text-2xl font-bold tracking-[-.03em]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-white/70">{body}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CtaLink href="/tools" label="実務ツールを試す" location={location} className="button green">
          実務ツールを試す
        </CtaLink>
        <CtaLink href="/downloads" label="Excelをダウンロード" location={location} className="button green">
          Excelをダウンロード
        </CtaLink>
        <CtaLink href="/books" label="推薦書籍を見る" location={location} className="button secondary">
          推薦書籍を見る
        </CtaLink>
        <CtaLink href="/request" label="リクエストを送る" location={location} className="button secondary">
          リクエストを送る
        </CtaLink>
      </div>
    </section>
  );
}
