import type { Metadata } from "next";
import { DownloadCard } from "@/components/DownloadCard";
import { ExcelWorksheetDiagram } from "@/components/ExcelWorksheetDiagram";
import { JournalEntryCard } from "@/components/JournalEntryCard";
import { caseCompany, downloads, journalEntries } from "@/data/lab";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/journal-lab", {
  title: "会計仕訳ラボ",
  description: "取引、仕訳、PL・BS・CFへの反映、Excel入力場所を同じ順序で確認する会計仕訳ラボ。",
});

export default function JournalLabPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">ACCOUNTING JOURNAL LAB</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">会計仕訳ラボ</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        {caseCompany.name}の取引を使い、取引内容、仕訳、PL・BS・CFへの反映、Excelの入力・参照先、モデル上の注意点を同じ順序で確認します。単位は{caseCompany.unit}、{caseCompany.yearEnd}です。
      </p>
      <ExcelWorksheetDiagram />
      <section className="grid gap-5">
        {journalEntries.map((entry) => <JournalEntryCard key={entry.title} entry={entry} />)}
      </section>
      <div className="callout warning mt-10">
        <strong>簡略化の前提</strong><br />仕訳は学習用に単純化しています。収益認識、税効果、表示区分、利息のCF区分などは案件や会計基準により異なるため、実務では専門家確認が必要です。
      </div>
      <section className="mt-10"><DownloadCard item={downloads[0]} /></section>
    </div>
  );
}
