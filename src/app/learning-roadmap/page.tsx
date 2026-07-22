import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCard } from "@/components/DownloadCard";
import { caseCompany, downloads, roadmapSteps } from "@/data/lab";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/learning-roadmap", {
  title: "学習ロードマップ",
  description: "財務三表モデルとDCFモデルを実務順に組み立てる8段階の学習ロードマップ。",
});

export default function LearningRoadmapPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">実務学習ロードマップ</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">学習ロードマップ</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        {caseCompany.name}を共通ケースとして、会計、仕訳、Excel設計、財務三表、DCF、品質レビューまでを8段階で進めます。進捗保存は行わず、すべて静的に読める構成です。
      </p>
      <section className="mt-10 grid gap-4">
        {roadmapSteps.map((step) => (
          <article key={step.no} className="grid gap-5 border border-[#d8e0e5] bg-white p-5 lg:grid-cols-[90px_1fr_260px]">
            <div className="font-mono text-4xl font-bold text-[#147d73]">{String(step.no).padStart(2, "0")}</div>
            <div>
              <h2 className="text-2xl font-bold text-[#102235]">{step.title}</h2>
              <dl className="mt-4 grid gap-3 text-sm text-[#607080] md:grid-cols-2">
                <div><dt className="font-bold text-[#102235]">学習目標</dt><dd>{step.goal}</dd></div>
                <div><dt className="font-bold text-[#102235]">前提知識</dt><dd>{step.prerequisite}</dd></div>
                <div><dt className="font-bold text-[#102235]">目安時間</dt><dd>{step.time}</dd></div>
                <div><dt className="font-bold text-[#102235]">完了条件</dt><dd>{step.done}</dd></div>
              </dl>
            </div>
            <div className="flex flex-col gap-3 self-center">
              <Link href={step.href} className="button secondary">関連ページを読む</Link>
              <Link href={`/downloads/${step.file}`} className="button green">練習ファイル</Link>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-12">
        <div className="eyebrow">最初の練習ファイル</div>
        <h2 className="section-title mt-2">最初に使うファイル</h2>
        <div className="mt-6"><DownloadCard item={downloads[0]} /></div>
      </section>
    </div>
  );
}
