# Comps Peer Selection Lecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finance Modeling Labに、初学者からM&A実務担当者までComps選定を学べる記事、架空12社の演習、Excel風図解、ダウンロード可能な選定ワークブックを追加する。

**Architecture:** Next.js App Routerの静的ページとして`/comps-peer-selection`を追加する。対象会社、評価軸、候補12社、模範分類は`src/data/comps-selection.ts`を唯一のWebデータ源とし、表示コンポーネントと検証スクリプトが共有する。Excel教材はExcelJSで同じケース定義を読み、`public/downloads/Comps_Selection_Worksheet.xlsx`へ生成する。

**Tech Stack:** Next.js 16、React 19、TypeScript 5、Tailwind CSS 4、ExcelJS 4、tsx、ESLint 9

## Global Constraints

- 架空企業のみを使用し、実在企業の最新市場データは扱わない。
- 初学者向け基礎から、採用・除外理由をレビューできる実務レベルまで段階的に説明する。
- Peer Roleは`core_peer`、`secondary_peer`、`aspirational_peer`、`negative_peer`、`excluded_close_peer`、`not_clean_comp`の6種とする。
- スコアは0～3点だが、合計点だけでCore Peerを自動採用しない。
- 入力セルは青、同一シート数式は黒、他シート参照は緑、警告・エラーは赤で示す。
- JavaScript無効時でも本文、模範回答、ダウンロードリンクへ到達可能にする。
- 金額単位は百万円、ケース企業の基準値は売上高1,100、EBITDAマージン16.4%、海外売上比率25%とする。

## File Map

- `src/data/comps-selection.ts`: ケース企業、評価軸、候補12社、模範分類、FAQを管理する。
- `scripts/validate-comps-case.ts`: データ件数、ID、Role、スコア、理由、Core社数を検証する。
- `src/components/CompsSelectionFigures.tsx`: ファネル、比較カード、分類マップ、Excel風Selection Matrixを描画する。
- `src/app/comps-peer-selection/page.tsx`: 記事本文、目次、FAQ、関連導線、JSON-LDを構成する。
- `scripts/create-comps-selection-workbook.ts`: ケースデータからExcel教材を生成する。
- `scripts/test-comps-selection-workbook.ts`: シート、値、数式、入力規則、チェックを検証する。
- `public/downloads/Comps_Selection_Worksheet.xlsx`: 配布用Excel教材。
- `src/data/lab.ts`: ダウンロードセンターへ教材を登録する。
- `src/data/site.ts`: ヘッダーナビゲーションへCompsページを登録する。
- `src/app/sitemap.ts`: 静的サイトマップへ新規URLを登録する。
- `README.md`: 新規ページとExcel生成・検証コマンドを記載する。

---

### Task 1: ケースデータと機械検証

**Files:**
- Create: `src/data/comps-selection.ts`
- Create: `scripts/validate-comps-case.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `targetProfile: TargetProfile`、`selectionCriteria: SelectionCriterion[]`、`candidatePeers: CandidatePeer[]`、`peerSelectionFaqs: [string, string][]`
- Produces: `npm run validate:comps-case`
- Consumes: なし

- [ ] **Step 1: 検証スクリプトを先に作成する**

`scripts/validate-comps-case.ts`を次の内容で作成する。

```ts
import assert from "node:assert/strict";
import { candidatePeers, selectionCriteria } from "../src/data/comps-selection";

assert.equal(candidatePeers.length, 12, "候補企業は12社であること");
assert.equal(new Set(candidatePeers.map((peer) => peer.id)).size, 12, "候補IDは重複しないこと");
assert.equal(selectionCriteria.length, 12, "評価軸は12項目であること");

const validRoles = new Set([
  "core_peer", "secondary_peer", "aspirational_peer",
  "negative_peer", "excluded_close_peer", "not_clean_comp",
]);

for (const peer of candidatePeers) {
  assert.ok(validRoles.has(peer.role), `${peer.name}: Roleが有効であること`);
  assert.ok(peer.rationale.length >= 20, `${peer.name}: 判断理由を具体的に記載すること`);
  assert.equal(Object.keys(peer.scores).length, selectionCriteria.length, `${peer.name}: 全評価軸を採点すること`);
  for (const score of Object.values(peer.scores)) assert.ok(Number.isInteger(score) && score >= 0 && score <= 3);
  if (peer.role === "core_peer") assert.equal(peer.criticalMismatch, false, `${peer.name}: Coreに重大不一致がないこと`);
}

const corePeers = candidatePeers.filter((peer) => peer.role === "core_peer");
assert.equal(corePeers.length, 6, "模範回答のCore Peerは6社であること");
console.log("Comps case validation passed: 12 candidates / 6 core peers");
```

- [ ] **Step 2: 検証が失敗することを確認する**

Run: `npx tsx scripts/validate-comps-case.ts`

Expected: `Cannot find module '../src/data/comps-selection'`

- [ ] **Step 3: 型、基準、ケース企業、候補12社を実装する**

`src/data/comps-selection.ts`に次の型を定義する。

```ts
export type PeerRole = "core_peer" | "secondary_peer" | "aspirational_peer" | "negative_peer" | "excluded_close_peer" | "not_clean_comp";
export type Score = 0 | 1 | 2 | 3;
export type CriterionId = "businessModel" | "productMix" | "customerMarket" | "geography" | "scale" | "growth" | "margin" | "capitalIntensity" | "cyclicality" | "leverage" | "accounting" | "liquidity";
export type TargetProfile = { name: string; business: string; revenue: number; ebitdaMargin: number; overseasSales: number; equipmentSales: number; serviceSales: number; customers: string; capitalIntensity: string; cyclicality: string; unit: string };
export type SelectionCriterion = { id: CriterionId; label: string; question: string; critical: boolean };
export type CandidatePeer = { id: string; name: string; business: string; geography: string; revenue: number; growth: number; ebitdaMargin: number | null; serviceMix: number; capitalIntensity: string; customerMarket: string; accounting: string; dataAvailable: boolean; role: PeerRole; criticalMismatch: boolean; rationale: string; scores: Record<CriterionId, Score> };
```

`targetProfile`はモデル製作株式会社の設計値を使用する。`selectionCriteria`はGlobal Constraintsの12評価軸を順番どおり定義する。

候補12社は以下の模範分類を使用し、全12軸に0～3点を付ける。

| id | 架空企業名 | Role | 主な判断 |
| --- | --- | --- | --- |
| takumi | 匠オートメーション | core_peer | 自動化装置、規模、利益率、顧客が近い |
| shinsei | 新生精密システム | core_peer | 電子部品向け装置と保守構成が近い |
| tokai | 東海ファクトリー機器 | core_peer | 国内製造業向け、資本集約度が近い |
| mirai | 未来プロセス装置 | core_peer | 産業装置主体で成長率と利益率が近い |
| nippon | 日本モーション技研 | core_peer | 装置・部品ミックスと循環性が近い |
| kyowa | 協和製造ソリューション | core_peer | 売上規模、顧客、地域が近い |
| global | グローバル産業ロボティクス | secondary_peer | 事業は近いが海外比率と規模が大きい |
| service | サービスリンク工業 | aspirational_peer | 保守比率とマージンが高い将来像 |
| heavy | 大和重機械 | negative_peer | 同じ機械分類だが大型受注・建設向けで異なる |
| close | 中央FAテクノロジー | excluded_close_peer | 経済的に近いがEBITDA情報が取得不能 |
| group | 統合エンジニアリングHD | not_clean_comp | 複合企業で対象セグメントが小さい |
| turnaround | 再生機工 | not_clean_comp | 経営再建中で利益・倍率が正常でない |

各`rationale`は、事業構成、顧客、規模、利益率、資本集約度のうち2項目以上を具体的に言及する。`close`の`ebitdaMargin`は`null`、`dataAvailable`は`false`とする。

- [ ] **Step 4: package scriptを追加する**

`package.json`の`scripts`へ追加する。

```json
"validate:comps-case": "tsx scripts/validate-comps-case.ts"
```

- [ ] **Step 5: データ検証を実行する**

Run: `npm run validate:comps-case`

Expected: `Comps case validation passed: 12 candidates / 6 core peers`

- [ ] **Step 6: コミットする**

```bash
git add package.json src/data/comps-selection.ts scripts/validate-comps-case.ts
git commit -m "feat: add comps peer selection case data"
```

---

### Task 2: Comps選定用の視覚コンポーネント

**Files:**
- Create: `src/components/CompsSelectionFigures.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `TargetProfile`、`SelectionCriterion[]`、`CandidatePeer[]`
- Produces: `SelectionFunnel`、`TargetComparisonCards`、`PeerRoleMap`、`ExcelSelectionMatrix`

- [ ] **Step 1: コンポーネントの型チェックが失敗する状態を作る**

`src/components/CompsSelectionFigures.tsx`で4つのnamed exportを宣言し、未定義の内部実装を参照する。

```tsx
import type { CandidatePeer, SelectionCriterion, TargetProfile } from "@/data/comps-selection";
export function SelectionFunnel() { return <FunnelBody />; }
export function TargetComparisonCards(_: { target: TargetProfile; peers: CandidatePeer[] }) { return <CardsBody />; }
export function PeerRoleMap(_: { peers: CandidatePeer[] }) { return <RoleBody />; }
export function ExcelSelectionMatrix(_: { peers: CandidatePeer[]; criteria: SelectionCriterion[] }) { return <MatrixBody />; }
```

- [ ] **Step 2: TypeScriptビルドが失敗することを確認する**

Run: `npm run build`

Expected: `Cannot find name 'FunnelBody'`等でFAIL

- [ ] **Step 3: 4つの図解を実装する**

同ファイル内へ次の表示を実装する。

- `SelectionFunnel`: `業種候補 30社 → 事業モデル 18社 → 財務比較 12社 → Core 6社`の4段階。各段に、落とす理由を短く表示する。
- `TargetComparisonCards`: 対象会社、Core例、Secondary例、Negative例の4カード。対象会社と候補の売上高、成長率、EBITDAマージン、保守比率を表示する。
- `PeerRoleMap`: 6つのRoleごとに該当企業名と「倍率レンジを支える／文脈限定」等の扱いを表示する。
- `ExcelSelectionMatrix`: 列記号、行番号、数式バー、シートタブ、0～3点、重要不一致、模範Roleを表示する。`close`の欠損値は`N/A`と表示する。

表には`caption`、列見出し、`aria-describedby`を付け、モバイルでは既存の`.data-scroll`を使う。Roleは色に加えて日本語ラベルを表示する。

- [ ] **Step 4: 必要最小限のCSSを追加する**

`src/app/globals.css`へ`.selection-funnel`、`.peer-role-chip`、`.score-0`～`.score-3`を追加する。既存色`#102235`、`#147d73`、`#edf3f1`、`#d8e0e5`を使用し、新しいデザイントークンは増やさない。

- [ ] **Step 5: TypeScriptビルドを通す**

Run: `npm run build`

Expected: `✓ Compiled successfully`と静的ページ生成完了

- [ ] **Step 6: コミットする**

```bash
git add src/components/CompsSelectionFigures.tsx src/app/globals.css
git commit -m "feat: add comps selection visual components"
```

---

### Task 3: レクチャーページ

**Files:**
- Create: `src/app/comps-peer-selection/page.tsx`

**Interfaces:**
- Consumes: Task 1のデータ、Task 2の4コンポーネント
- Produces: 静的URL`/comps-peer-selection`

- [ ] **Step 1: ページの存在確認を先に失敗させる**

Run: `Test-Path src\app\comps-peer-selection\page.tsx`

Expected: `False`

- [ ] **Step 2: metadata、hero、記事シェルを実装する**

`page.tsx`へ以下を実装する。

```tsx
export const metadata: Metadata = {
  title: "Compsの選定方法｜類似上場会社を選ぶ実務フレームワーク",
  description: "Comps候補の探し方、事業モデル・規模・成長率・利益率による比較、Core Peerと除外企業の整理、Excel選定マトリクスまで解説します。",
};
```

Heroには`TRADING COMPS / PEER SELECTION`、H1、対象者、難易度、目安時間30～45分、架空事例であることを表示する。既存`private-company-valuation/page.tsx`の`article-container`とsticky目次のパターンを踏襲する。

- [ ] **Step 3: 基礎から実務までの本文を実装する**

次のsection IDと内容を順番どおり実装する。

1. `why-peer-selection`：Compsの目的、同業とComparableの違い
2. `build-long-list`：狭い業種分類から地域、収益モデルへ広げる手順
3. `selection-criteria`：12評価軸、指標ごとに重視点が変わる説明
4. `peer-roles`：6つのRoleと倍率レンジでの扱い
5. `case-study`：モデル製作株式会社と架空候補12社
6. `excel-workflow`：Target Profile、Long List、Selection Matrix、Peer Roles、Review Memo、Checks
7. `review-memo`：良い採用・除外理由と悪い例
8. `review-questions`：レビューで問われる10問
9. `common-failures`：セクター漏れ、規模不一致、会計基準不一致、データ取得都合の除外、中央値の盲目的採用等
10. `faq`：5問

各セクションへTask 2の図解を適切に配置する。模範回答はHTMLの`<details>`で開閉でき、JavaScriptなしでも利用可能にする。

- [ ] **Step 4: Excelダウンロードと関連記事を実装する**

`/downloads/Comps_Selection_Worksheet.xlsx`へのCTAを記事上部と末尾へ置く。関連記事として`/private-company-valuation`、`/quality-standard`、`/downloads`をリンクする。未実装URLへリンクしない。

- [ ] **Step 5: FAQ JSON-LDを実装する**

`peerSelectionFaqs`から`FAQPage`を生成し、`script type="application/ld+json"`で出力する。質問と画面上のFAQ本文を同じデータから生成する。

- [ ] **Step 6: ページをビルド検証する**

Run: `npm run lint && npm run build`

Expected: ESLintエラー0、`/comps-peer-selection`が静的生成される

- [ ] **Step 7: コミットする**

```bash
git add src/app/comps-peer-selection/page.tsx
git commit -m "feat: add comps peer selection lecture"
```

---

### Task 4: Excel教材の生成と検証

**Files:**
- Create: `scripts/create-comps-selection-workbook.ts`
- Create: `scripts/test-comps-selection-workbook.ts`
- Create: `public/downloads/Comps_Selection_Worksheet.xlsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `targetProfile`、`selectionCriteria`、`candidatePeers`
- Produces: `public/downloads/Comps_Selection_Worksheet.xlsx`
- Produces: `npm run generate:comps-workbook`、`npm run test:comps-workbook`

- [ ] **Step 1: ExcelJSを追加する**

Run: `npm install --save-dev exceljs@4.4.0`

Expected: `package.json`のdevDependenciesと`package-lock.json`が更新される

- [ ] **Step 2: ワークブック検証を先に作る**

`scripts/test-comps-selection-workbook.ts`で次をassertする。

```ts
import assert from "node:assert/strict";
import ExcelJS from "exceljs";

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile("public/downloads/Comps_Selection_Worksheet.xlsx");
assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), ["Guide", "Target Profile", "Long List", "Selection Matrix", "Peer Roles", "Review Memo", "Checks"]);
assert.equal(workbook.getWorksheet("Target Profile")?.getCell("B4").value, 1100);
assert.equal(workbook.getWorksheet("Long List")?.actualRowCount, 15);
assert.equal(workbook.getWorksheet("Selection Matrix")?.getCell("P5").formula, "SUM(D5:O5)");
assert.equal(workbook.getWorksheet("Peer Roles")?.getCell("C5").dataValidation.type, "list");
assert.ok(workbook.getWorksheet("Checks")?.getCell("B4").formula);
console.log("Comps workbook validation passed");
```

- [ ] **Step 3: 検証が失敗することを確認する**

Run: `npx tsx scripts/test-comps-selection-workbook.ts`

Expected: `ENOENT: no such file or directory, open 'public/downloads/Comps_Selection_Worksheet.xlsx'`

- [ ] **Step 4: ワークブック生成を実装する**

`scripts/create-comps-selection-workbook.ts`で7シートを設計どおり生成する。共通実装は次を含む。

```ts
const colors = { navy: "102235", teal: "147D73", input: "E7F0FF", link: "E9F6EF", error: "FDECEC", line: "D8E0E5" };
const roleOptions = '"core_peer,secondary_peer,aspirational_peer,negative_peer,excluded_close_peer,not_clean_comp"';
```

- `Guide`: 学習手順、0～3点の定義、Role定義、色凡例、教育目的の免責
- `Target Profile`: B4=1100、B5=16.4%、B6=25%、B7=70%、B8=30%
- `Long List`: 12社を4行目～15行目へ出力し、情報源・基準日列を設ける
- `Selection Matrix`: D:Oを12評価軸、Pを`SUM(Dn:On)`、Qを重要不一致、Rを推奨Roleとする
- `Peer Roles`: C列にRoleのlist validation、D列に採用・除外理由、E列に未解決事項
- `Review Memo`: `COUNTIF`、`TEXTJOIN`、Role別企業一覧、比較可能性の限界を表示する
- `Checks`: Role未入力、理由未入力、候補ID重複、Core重大不一致、データ欠損を数式で判定する

全シートでfreeze panes、auto filter、印刷方向、列幅、見出し色、入力色を設定する。外部リンクは作成しない。

- [ ] **Step 5: 生成・検証スクリプトをpackage.jsonへ追加する**

```json
"generate:comps-workbook": "tsx scripts/create-comps-selection-workbook.ts",
"test:comps-workbook": "tsx scripts/test-comps-selection-workbook.ts"
```

- [ ] **Step 6: Excelを生成し検証する**

Run: `npm run generate:comps-workbook && npm run test:comps-workbook`

Expected: `Comps workbook validation passed`

- [ ] **Step 7: コミットする**

```bash
git add package.json package-lock.json scripts/create-comps-selection-workbook.ts scripts/test-comps-selection-workbook.ts public/downloads/Comps_Selection_Worksheet.xlsx
git commit -m "feat: add comps selection Excel workbook"
```

---

### Task 5: サイト導線、ダウンロード登録、SEO

**Files:**
- Modify: `src/data/lab.ts`
- Modify: `src/data/site.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: `/comps-peer-selection`、`Comps_Selection_Worksheet.xlsx`
- Produces: ヘッダー、ダウンロードセンター、sitemap、READMEの導線

- [ ] **Step 1: ダウンロードセンター登録を追加する**

`src/data/lab.ts`の`downloads`末尾へ次を追加する。

```ts
{ file: "Comps_Selection_Worksheet.xlsx", audience: "類似会社の選定根拠を整理したい方", content: "対象会社プロファイル、候補12社、選定マトリクス、Peer Role、Review Memo、Checks", size: "生成後の実ファイルサイズ", updated: "2026-07-20", terms: "教育目的・再配布不可" }
```

ファイルサイズはPowerShellの`[math]::Round((Get-Item public\downloads\Comps_Selection_Worksheet.xlsx).Length/1KB)`で測定し、表示値を`約NNKB`へ置き換える。

- [ ] **Step 2: ナビゲーションとサイトマップを追加する**

`src/data/site.ts`のValuation直後へ`{ href: "/comps-peer-selection", label: "Comps選定" }`を追加する。

`src/app/sitemap.ts`へ次を追加する。

```ts
{ path: "/comps-peer-selection", priority: 0.9, changeFrequency: "monthly" as const },
```

- [ ] **Step 3: READMEを更新する**

主なページへ`/comps-peer-selection`を追加し、Excel教材の再生成・検証コマンドを記載する。

```bash
npm run generate:comps-workbook
npm run test:comps-workbook
```

- [ ] **Step 4: 統合検証を実行する**

Run: `npm run validate:comps-case && npm run test:comps-workbook && npm run lint && npm run build`

Expected: 全コマンドがexit 0、静的exportに`comps-peer-selection/index.html`が含まれる

- [ ] **Step 5: コミットする**

```bash
git add src/data/lab.ts src/data/site.ts src/app/sitemap.ts README.md
git commit -m "feat: link comps selection lesson across site"
```

---

### Task 6: 表示・ダウンロード・アクセシビリティの受入確認

**Files:**
- Modify if required: `src/app/comps-peer-selection/page.tsx`
- Modify if required: `src/components/CompsSelectionFigures.tsx`
- Modify if required: `src/app/globals.css`

**Interfaces:**
- Consumes: 完成済み静的ページとXLSX
- Produces: 受入確認済みページ

- [ ] **Step 1: 本番相当の静的サイトを起動する**

Run: `npm run build`

Expected: build成功

Run: `npx serve out -l 4173`

Expected: `http://localhost:4173`で静的サイトが開く

- [ ] **Step 2: デスクトップ表示を確認する**

`http://localhost:4173/comps-peer-selection/`で次を確認する。

- Hero直下で対象者、難易度、時間が読める
- ファネル、比較カード、分類マップ、Selection Matrixが重ならない
- sticky目次の全リンクが正しいsectionへ移動する
- 模範回答の`details`が開閉できる
- FAQと関連記事が表示される

- [ ] **Step 3: モバイル表示を確認する**

幅390pxで、表がページ全体を押し広げず横スクロールし、CTA、目次、カードが切れないことを確認する。

- [ ] **Step 4: ダウンロードを確認する**

`/downloads/Comps_Selection_Worksheet.xlsx`がHTTP 200で取得でき、ExcelJSの検証スクリプトが取得対象と同じファイルを読めることを確認する。

- [ ] **Step 5: JavaScript無効時の内容を確認する**

本文、候補12社、模範回答、ダウンロードリンク、FAQがHTML内に存在することを確認する。クライアント状態へ内容を隠さない。

- [ ] **Step 6: 最終検証を再実行する**

Run: `npm run validate:comps-case && npm run test:comps-workbook && npm run lint && npm run build`

Expected: 全コマンドがexit 0

- [ ] **Step 7: 必要な受入修正をコミットする**

変更がある場合のみ実行する。

```bash
git add src/app/comps-peer-selection/page.tsx src/components/CompsSelectionFigures.tsx src/app/globals.css
git commit -m "fix: polish comps selection lesson acceptance issues"
```

## Completion Criteria

- `/comps-peer-selection`が静的生成され、基礎からレビュー用メモまで読める。
- 架空候補12社とCore 6社の模範回答がWebとExcelで一致する。
- Excel教材に7シート、入力規則、数式、チェックがあり、検証スクリプトが通る。
- ダウンロードセンター、ヘッダー、サイトマップ、関連記事から到達できる。
- lint、case validation、workbook validation、production buildがすべて成功する。
