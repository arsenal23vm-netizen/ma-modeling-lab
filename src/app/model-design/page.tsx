import type { Metadata } from "next";
import Image from "next/image";
import { ArticleShell } from "@/components/article-shell";
import flowDiagram from "../../../public/financial-statements-flow.png";

export const metadata:Metadata={title:"壊れにくいM&Aモデルの設計",description:"入力・計算・出力を分離するM&A財務モデルの基本設計を解説。"};
const sections=[{id:"purpose",label:"モデルの目的"},{id:"statements-flow",label:"財務三表の連動"},{id:"architecture",label:"基本構造"},{id:"rules",label:"Excel設計ルール"},{id:"checks",label:"モデルチェック"}];
export default function Page(){return <ArticleShell no="01" title="壊れにくいM&Aモデルの設計" lead="良いモデルは、計算が合うだけでは足りません。第三者が前提を見つけ、ロジックを追い、短時間で異常値を発見できることが重要です。" sections={sections}>
  <h2 id="purpose">モデルの目的を一文で定義する</h2><p>M&Aモデルの目的は、将来を正確に当てることではありません。限られた情報の下で、取引条件と事業前提が投資リターン、資金繰り、財務健全性へどう波及するかを比較可能にします。</p><div className="callout"><strong>最初に固定する3つの問い</strong><br/>いくらまでなら買えるか。借入金を返済できるか。計画が下振れしたとき、どこで資金が不足するか。</div>
  <h2 id="statements-flow">財務三表は一本の流れで連動する</h2><p>損益計算書の当期純利益を間接法キャッシュ・フロー計算書の起点にし、非資金項目と運転資本増減を調整します。投資活動・財務活動を加えた現金増減を、貸借対照表の期末現金及び預金へ接続します。</p><figure className="my-7 border border-[#d8e0e5] bg-white p-3"><Image src={flowDiagram} alt="損益計算書から当期純利益、間接法キャッシュ・フロー計算書、現金増減、貸借対照表へ連動する財務三表の図" className="h-auto w-full" priority/><figcaption className="px-2 pt-3 text-xs text-[#607080]">財務三表の連動：PL → 当期純利益 → 間接法CF → 現金増減 → BS</figcaption></figure><div className="formula">損益計算書!当期純利益 → キャッシュ・フロー計算書!当期純利益<br/>キャッシュ・フロー計算書!期末現金 → 貸借対照表!現金及び預金</div>
  <h2 id="architecture">入力・計算・出力を分離する</h2><div className="data-scroll"><table className="data-table"><thead><tr><th>レイヤー</th><th>役割</th><th>代表シート</th><th>原則</th></tr></thead><tbody><tr><td>入力</td><td>外部データと仮定</td><td>前提条件・実績</td><td>手入力セルを色で識別</td></tr><tr><td>計算</td><td>事業・会計・取引ロジック</td><td>売上高計画・財務三表・借入金計画</td><td>数式内への定数埋込みを避ける</td></tr><tr><td>出力</td><td>意思決定指標</td><td>概要・投資リターン</td><td>入力値を置かない</td></tr></tbody></table></div>
  <h2 id="rules">Excel設計ルール</h2><ul><li>同じ前提は一度だけ入力し、すべて参照でつなぐ。</li><li>期間軸、単位、符号規則を全シートで統一する。</li><li>手入力、他シート参照、同一シート数式を色分けする。</li><li>複雑な一式より、意味のある中間計算を残す。</li><li>シート間リンクは一方向を基本とし、循環参照を局所化する。</li></ul><div className="formula">事業価値 = 株主価値 + 純有利子負債 + その他調整</div>
  <h2 id="checks">モデルチェックを先に作る</h2><div className="data-scroll"><table className="data-table"><thead><tr><th>チェック</th><th>式</th><th>許容値</th></tr></thead><tbody><tr><td>貸借一致</td><td>資産合計－負債純資産合計</td><td>0</td></tr><tr><td>現金一致</td><td>期首現金＋CF増減－期末現金</td><td>0</td></tr><tr><td>資金調達・使途一致</td><td>資金調達額－資金使途額</td><td>0</td></tr></tbody></table></div>
 </ArticleShell>}
