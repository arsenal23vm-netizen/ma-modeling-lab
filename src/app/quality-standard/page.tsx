import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCard } from "@/components/DownloadCard";
import { downloads, qualityCriteria } from "@/data/lab";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/quality-standard", {
  title: "モデル品質基準",
  description: "財務モデルを100点満点で自己レビューするための品質基準と主要チェック項目。",
});

export default function QualityStandardPage() {
  const total = qualityCriteria.reduce((sum, item) => sum + item.points, 0);
  return (
    <div className="container py-14">
      <div className="eyebrow">MODEL QUALITY STANDARD</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">モデル品質基準</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">レビュー可能な財務モデルに必要な構造、前提、数式、三表連動、チェック、引継ぎやすさを100点満点で評価します。</p>
      <div className="mt-8 data-scroll">
        <table className="data-table min-w-[760px]">
          <thead><tr><th>評価領域</th><th>配点</th><th>主な確認項目</th></tr></thead>
          <tbody>
            {qualityCriteria.map((item) => (
              <tr key={item.area}>
                <td><strong>{item.area}</strong></td>
                <td className="number">{item.points}</td>
                <td>{item.checks.join(" / ")}</td>
              </tr>
            ))}
            <tr><td><strong>合計</strong></td><td className="number font-bold">{total}</td><td>80点以上をレビュー可能、90点以上を引継ぎ可能の目安とします。</td></tr>
          </tbody>
        </table>
      </div>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {["BS一致", "CF一致", "利益剰余金ロールフォワード", "固定資産ロールフォワード", "借入金ロールフォワード", "予測期間の欠損", "シナリオ選択の妥当性"].map((check) => (
          <div key={check} className="border border-[#d8e0e5] bg-white p-5">
            <h2 className="text-lg font-bold text-[#102235]">{check}</h2>
            <p className="mt-2 text-sm text-[#607080]">正常時はOK、異常時はエラー名と差額を表示します。差額がゼロでない場合、参照元シートとロールフォワードを確認します。</p>
          </div>
        ))}
      </section>
      <div className="callout warning mt-10">
        <strong>実務上の確認</strong><br />本基準は教育目的の自己レビュー表です。税務・会計・契約上の判断は、対象会社固有の事実と専門家確認が必要です。<Link href="/disclaimer" className="font-bold text-[#147d73]">免責事項</Link>も確認してください。
      </div>
      <section className="mt-10"><DownloadCard item={downloads[6]} /></section>
    </div>
  );
}
