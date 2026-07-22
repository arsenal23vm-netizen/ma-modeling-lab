import type { Metadata } from "next";
import { DownloadCard } from "@/components/DownloadCard";
import { downloads } from "@/data/lab";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/downloads", {
  title: "ダウンロードセンター",
  description: "財務モデリング演習に使えるExcelファイルをダウンロードできます。",
});

export default function DownloadsPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">Excel教材一覧</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">ダウンロードセンター</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        仕訳演習、前提条件入力、PL、BS/CF統合、完成3表モデル、DCF、品質チェックリストをExcel形式で配布します。すべて教育目的のサンプルファイルです。
      </p>
      <div className="mt-10 grid gap-5">
        {downloads.map((item) => <DownloadCard key={item.file} item={item} />)}
      </div>
      <div className="callout warning mt-10">
        <strong>利用条件</strong><br />ファイルは学習目的で利用できます。実案件の判断、会計・税務・投資判断を代替するものではありません。機密情報を入力した状態で第三者へ共有しないでください。
      </div>
    </div>
  );
}
