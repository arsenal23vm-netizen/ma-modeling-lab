import { CtaLink } from "@/components/CtaLink";

export type DownloadItem = {
  file: string;
  audience: string;
  content: string;
  size: string;
  updated: string;
  terms: string;
};

export function DownloadCard({ item }: { item: DownloadItem }) {
  const href = `/downloads/${item.file}`;
  return (
    <article className="grid gap-4 border border-[#d8e0e5] bg-white p-5 md:grid-cols-[1fr_auto]">
      <div>
        <h2 className="text-xl font-bold text-[#102235]">{item.file}</h2>
        <dl className="mt-3 grid gap-2 text-sm text-[#607080] md:grid-cols-2">
          <div><dt className="font-bold text-[#102235]">対象者</dt><dd>{item.audience}</dd></div>
          <div><dt className="font-bold text-[#102235]">内容</dt><dd>{item.content}</dd></div>
          <div><dt className="font-bold text-[#102235]">ファイル</dt><dd>Excel / {item.size}</dd></div>
          <div><dt className="font-bold text-[#102235]">更新日・利用条件</dt><dd>{item.updated} / {item.terms}</dd></div>
        </dl>
      </div>
      <CtaLink href={href} label={`download_${item.file}`} location="download_center" className="button green self-center">
        Excelをダウンロード
      </CtaLink>
    </article>
  );
}
