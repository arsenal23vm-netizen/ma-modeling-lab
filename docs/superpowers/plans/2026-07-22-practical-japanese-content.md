# 実務日本語化・全ページ内容刷新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finance Modeling Labの全公開ページと配布Excelを国内実務向けの日本語と実践的な教材構成へ刷新し、GitHub Pagesへ公開する。

**Architecture:** 表記ルールを単一の用語ポリシーと静的検証へ集約し、共通データ、ページ本文、図表、Excel生成スクリプトを同じ語彙で更新する。ExcelはすべてExcelJSで再現可能な生成物とし、Web上の作成イメージと数式・シート名を検証スクリプトで同期させる。

**Tech Stack:** Next.js 16、React 19、TypeScript、ExcelJS、JSZip、Node.js assert、GitHub Pages

## Global Constraints

- `Valuation`、`Enterprise Value`、`Equity Value`、`Base / Upside / Downside`は英語表記を維持する。
- M&A、DCF、WACC、EBITDA、EV/EBITDA、PL / BS / CF、FCFF、KPI、Excelは略称を維持し、ページ初出時に日本語で説明する。
- 上記以外のユーザー向け表示は原則として日本語にする。内部識別子、URL、Excel内部コードは非表示であれば英語を許容する。
- 編集名義は「Finance Modeling Lab 編集部」とする。
- 数値例は教育用の架空例であり、実在企業・実取引の事実と誤認させない。
- 既存URLを変更せず、旧英語語句でもサイト内検索できる別名を維持する。
- Excelでは入力、計算式、他シート参照、主要出力を視覚的に区別し、計算整合性と意思決定への利用可否を分離する。

---

### Task 1: 表記ポリシーと回帰検証

**Files:**
- Create: `src/data/practical-japanese.ts`
- Create: `scripts/validate-practical-japanese.ts`
- Modify: `package.json`
- Test: `scripts/validate-practical-japanese.ts`

**Interfaces:**
- Produces: `allowedEnglishTerms: readonly string[]`、`displayTermMap: Readonly<Record<string, string>>`、`npm run validate:language`
- Consumes: `src/app`、`src/components`、`src/data`、`scripts/create-*-workbook.ts`のユーザー向け文字列

- [ ] **Step 1: 失敗する表記検証を作る**

```ts
const bannedDisplayTerms = [
  "Home", "Core Peer", "Secondary Peer", "Aspirational Peer", "Negative Peer",
  "Target Profile", "Long List", "Selection Matrix", "Peer Roles", "Review Memo",
  "Cover", "Inputs", "Assumptions", "Schedules", "Checks", "Terminal Growth",
  "Debt-like Items", "Non-controlling Interests", "Calculation integrity", "Decision readiness",
] as const;

for (const term of bannedDisplayTerms) {
  assert.equal(findUserFacingOccurrences(term).length, 0, `${term} remains user-facing`);
}
```

- [ ] **Step 2: 検証を実行し、現状で失敗することを確認する**

Run: `npm.cmd run validate:language`

Expected: `Home remains user-facing`または同等の表記違反でFAIL

- [ ] **Step 3: 用語ポリシーと検出対象・許可対象を実装する**

```ts
export const displayTermMap = {
  Home: "ホーム",
  "Core Peer": "主要比較会社",
  "Terminal Growth": "永久成長率",
  "Debt-like Items": "有利子負債類似項目",
} as const;

export const allowedEnglishTerms = [
  "Valuation", "Enterprise Value", "Equity Value", "Base", "Upside", "Downside",
  "M&A", "DCF", "WACC", "EBITDA", "EV/EBITDA", "PL", "BS", "CF", "FCFF", "KPI", "Excel",
] as const;
```

- [ ] **Step 4: `package.json`へ検証コマンドを追加し、検証器自体が動くことを確認する**

Run: `npm.cmd run validate:language`

Expected: 既存ページの未修正箇所を列挙してFAIL

- [ ] **Step 5: コミットする**

```bash
git add package.json src/data/practical-japanese.ts scripts/validate-practical-japanese.ts
git commit -m "test: enforce practical Japanese terminology"
```

### Task 2: 共通UI・検索・一覧データの表記統一

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/data/content-catalog.ts`
- Modify: `src/data/lab.ts`
- Modify: `src/data/editorial.ts`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/TopicHub.tsx`
- Modify: `src/components/DownloadCard.tsx`
- Modify: `src/components/EditorialDetails.tsx`
- Modify: `src/lib/content-search.ts`
- Test: `scripts/validate-content-catalog.ts`
- Test: `scripts/validate-editorial.tsx`
- Test: `scripts/validate-practical-japanese.ts`

**Interfaces:**
- Consumes: Task 1の用語ポリシー
- Produces: 全ページが共有する日本語ナビゲーション、検索別名、ダウンロード説明、編集情報

- [ ] **Step 1: 共有表示と検索別名の期待値をテストへ追加する**

```ts
assert.equal(navigation[0].label, "ホーム");
assert.ok(searchContent("Core Peer").some((item) => item.href === "/comps-peer-selection"));
assert.ok(searchContent("主要比較会社").some((item) => item.href === "/comps-peer-selection"));
assert.ok(downloads.every((item) => !/Inputs|Assumptions|Checks/.test(item.content)));
```

- [ ] **Step 2: 対象検証を実行して失敗を確認する**

Run: `npm.cmd run validate:catalog && npm.cmd run validate:editorial && npm.cmd run validate:language`

Expected: 英語表示または日本語検索別名不足でFAIL

- [ ] **Step 3: ナビゲーション、カード、一覧、メタデータを統一語へ変更する**

検索用`keywords`には日本語の表示語と既存英語別名を併記するが、タイトル、要約、ボタン、分類ラベルは日本語を優先する。

- [ ] **Step 4: 検証を再実行する**

Run: `npm.cmd run validate:catalog && npm.cmd run validate:editorial`

Expected: PASS

- [ ] **Step 5: コミットする**

```bash
git add src/data src/components src/lib scripts/validate-content-catalog.ts scripts/validate-editorial.tsx
git commit -m "feat: localize shared site language"
```

### Task 3: 基礎・会計・財務三表ページと基礎Excelの刷新

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/learning-roadmap/page.tsx`
- Modify: `src/app/roadmap/page.tsx`
- Modify: `src/app/quality-standard/page.tsx`
- Modify: `src/app/financial-modeling/page.tsx`
- Modify: `src/app/model-design/page.tsx`
- Modify: `src/app/assumptions/page.tsx`
- Modify: `src/app/revenue-kpi/page.tsx`
- Modify: `src/app/pl-model/page.tsx`
- Modify: `src/app/bs-model/page.tsx`
- Modify: `src/app/cf-model/page.tsx`
- Modify: `src/app/three-statements/page.tsx`
- Modify: `src/app/journal-lab/page.tsx`
- Modify: `src/app/excel-functions/page.tsx`
- Modify: `src/data/statements.ts`
- Modify: `src/components/JournalEntryCard.tsx`
- Modify: `src/components/ExcelWorksheetDiagram.tsx`
- Create: `scripts/create-learning-workbooks.ts`
- Create: `scripts/test-learning-workbooks.ts`
- Modify: `package.json`
- Replace: `public/downloads/01_仕訳演習.xlsx`
- Replace: `public/downloads/02_前提条件入力.xlsx`
- Replace: `public/downloads/03_PLモデル練習.xlsx`
- Replace: `public/downloads/04_BS_CF統合練習.xlsx`
- Replace: `public/downloads/05_完成3表モデル.xlsx`
- Replace: `public/downloads/07_モデル品質チェックリスト.xlsx`

**Interfaces:**
- Produces: `createLearningWorkbooks(): Promise<void>`、6個のExcelJS互換ワークブック
- Workbook sheets: `使い方 / 入力 / 前提 / PL / BS / CF / 計算明細 / チェック`から教材ごとに必要な部分集合

- [ ] **Step 1: ページとExcelの必要構成を検証するテストを書く**

```ts
assert.deepEqual(journalWorkbook.worksheets.map((sheet) => sheet.name), ["使い方", "仕訳演習", "三表への影響", "チェック"]);
assert.equal(journalWorkbook.getWorksheet("仕訳演習")?.getCell("B5").value, "外注費");
assert.equal(journalWorkbook.getWorksheet("仕訳演習")?.getCell("C5").value, 1200);
assert.deepEqual(modelWorkbook.worksheets.map((sheet) => sheet.name), ["表紙", "入力", "前提", "PL", "BS", "CF", "計算明細", "チェック"]);
```

- [ ] **Step 2: テストを実行して既存ファイルがExcelJSで認識されず失敗することを確認する**

Run: `npm.cmd run test:learning-workbooks`

Expected: `worksheets`が空または期待シート不足でFAIL

- [ ] **Step 3: 基礎Excel生成器を実装する**

共通スタイル、入力色、数式色、単位、印刷範囲、ウィンドウ枠固定、教育用注記を共通関数にし、各教材へ具体的な金額・式・チェックを入れる。

```ts
export async function createLearningWorkbooks() {
  await Promise.all([
    createJournalWorkbook("public/downloads/01_仕訳演習.xlsx"),
    createAssumptionWorkbook("public/downloads/02_前提条件入力.xlsx"),
    createPlWorkbook("public/downloads/03_PLモデル練習.xlsx"),
    createIntegratedWorkbook("public/downloads/04_BS_CF統合練習.xlsx"),
    createThreeStatementWorkbook("public/downloads/05_完成3表モデル.xlsx"),
    createQualityWorkbook("public/downloads/07_モデル品質チェックリスト.xlsx"),
  ]);
}
```

- [ ] **Step 4: 各ページを成果物、資料、手順、式、数値例、三表連動、確認事項、誤りの順へ書き直す**

仕訳例には「借方 外注費1,200千円 / 貸方 未払費用1,200千円」とPL・BS・CFの影響を含める。前提条件ではBase / Upside / Downsideを列で管理し、数式の複製ではなく選択セルから有効値を取得する。

- [ ] **Step 5: Excelを生成してページ・Excel検証を通す**

Run: `npm.cmd run generate:learning-workbooks && npm.cmd run test:learning-workbooks && npm.cmd run validate:language`

Expected: 基礎Excel検証PASS。表記検証は未対応のValuation領域だけを報告。

- [ ] **Step 6: コミットする**

```bash
git add src/app src/data/statements.ts src/components scripts package.json public/downloads
git commit -m "feat: rebuild practical modeling lessons"
```

### Task 4: 類似会社比較ページとExcelの刷新

**Files:**
- Modify: `src/app/comps-peer-selection/page.tsx`
- Modify: `src/app/private-company-valuation/page.tsx`
- Modify: `src/data/comps-selection.ts`
- Modify: `src/data/comps-selection-controls.ts`
- Modify: `src/components/CompsSelectionFigures.tsx`
- Modify: `scripts/create-comps-selection-workbook.ts`
- Modify: `scripts/test-comps-selection-workbook.ts`
- Modify: `scripts/validate-comps-page.ts`
- Modify: `scripts/validate-comps-selection-figures.tsx`
- Replace: `public/downloads/Comps_Selection_Worksheet.xlsx`

**Interfaces:**
- Produces: 日本語の比較上の位置づけ、7シートの類似会社選定Excel、Web上の同一選定表
- Preserves: 内部ロールコード`core_peer`等は数式と型の安定性のため維持

- [ ] **Step 1: 日本語シート名・表示ラベル・選定判断を期待するテストへ変更する**

```ts
const sheetNames = ["使い方", "対象会社", "比較候補会社一覧", "比較会社選定表", "比較上の位置づけ", "検討記録", "チェック"];
assert.equal(roleLabels.core_peer, "主要比較会社");
assert.match(renderedPage, /収益構造/);
assert.match(renderedPage, /会計方針/);
assert.match(renderedPage, /除外理由/);
```

- [ ] **Step 2: 対象テストを実行して失敗を確認する**

Run: `npm.cmd run validate:comps-case && npm.cmd run test:comps-workbook`

Expected: 旧英語シート名・ラベルのためFAIL

- [ ] **Step 3: ページ、図、データを主要比較会社・補完比較会社等の日本語へ統一する**

採点合計と重大な不一致を分け、業種、収益構造、顧客、地域、規模、成長率、利益率、資本集約度、会計方針、開示の質を評価軸として説明する。

- [ ] **Step 4: Excel生成器と数式参照を新しいシート名へ変更する**

```ts
const sheetNames = {
  guide: "使い方",
  target: "対象会社",
  longList: "比較候補会社一覧",
  matrix: "比較会社選定表",
  roles: "比較上の位置づけ",
  memo: "検討記録",
  checks: "チェック",
} as const;
```

- [ ] **Step 5: 生成・検証する**

Run: `npm.cmd run generate:comps-workbook && npm.cmd run validate:comps-case && npm.cmd run test:comps-workbook`

Expected: PASS

- [ ] **Step 6: コミットする**

```bash
git add src/app/comps-peer-selection src/app/private-company-valuation src/data/comps-selection* src/components/CompsSelectionFigures.tsx scripts/*comps* public/downloads/Comps_Selection_Worksheet.xlsx
git commit -m "feat: localize practical comps selection"
```

### Task 5: Valuation・DCFページとExcelの刷新

**Files:**
- Modify: `src/app/valuation/page.tsx`
- Modify: `src/app/valuation/dcf/page.tsx`
- Modify: `src/app/valuation/dcf/fcff/page.tsx`
- Modify: `src/app/valuation/dcf/wacc/page.tsx`
- Modify: `src/app/valuation/dcf/terminal-value/page.tsx`
- Modify: `src/app/valuation/dcf/sensitivity-analysis/page.tsx`
- Modify: `src/app/valuation/dcf/enterprise-to-equity/page.tsx`
- Modify: `src/app/downloads/dcf-valuation-model/page.tsx`
- Modify: `src/components/DcfFigures.tsx`
- Modify: `src/components/DcfLessonShell.tsx`
- Modify: `src/components/DcfWorkbookPreview.tsx`
- Modify: `scripts/create-dcf-workbook.ts`
- Modify: `scripts/test-dcf-workbook.ts`
- Modify: `scripts/validate-dcf-series.ts`
- Modify: `scripts/validate-dcf-workbook-landing.tsx`
- Replace: `public/downloads/06_DCF評価モデル.xlsx`

**Interfaces:**
- Produces: `表紙 / 入力 / 前提 / PL / BS / CF / 計算明細 / DCF / チェック`の9シート
- Preserves: `Valuation`、`Enterprise Value`、`Equity Value`とDCF/WACC/FCFF/EBITDA

- [ ] **Step 1: 日本語シート名・表示項目・実務説明を期待するテストへ変更する**

```ts
const expectedSheets = ["表紙", "入力", "前提", "PL", "BS", "CF", "計算明細", "DCF", "チェック"];
assert.equal(cover.getCell("B5").value, "計算整合性");
assert.equal(cover.getCell("B6").value, "意思決定への利用可否");
assert.equal(inputs.getCell("A24").value, "有利子負債類似項目");
assert.equal(assumptions.getCell("A12").value, "永久成長率");
```

- [ ] **Step 2: テストを実行して旧英語表示で失敗することを確認する**

Run: `npm.cmd run test:dcf-workbook && npm.cmd run validate:dcf-series`

Expected: 旧シート名または旧表示名でFAIL

- [ ] **Step 3: DCFページ群を一連の実務作業として書き直す**

FCFFの符号、類似上場会社βのアンレバリング／リレバリング、負債コストと税効果、永久成長率、期末割引、継続価値構成比、Enterprise ValueからEquity Valueへの調整、Base / Upside / Downsideと感応度の違いを具体例で説明する。

- [ ] **Step 4: DCF生成器・プレビュー・数式参照を日本語シート名へ同期する**

```ts
const SHEETS = {
  cover: "表紙", inputs: "入力", assumptions: "前提", pl: "PL", bs: "BS",
  cf: "CF", schedules: "計算明細", dcf: "DCF", checks: "チェック",
} as const;
```

式の例：`='入力'!B19*B8+'入力'!B20*B9`、`=B14+B16-B17-B18-B19`。シート名変更後もキャッシュ値とチェック結果を維持する。

- [ ] **Step 5: 生成・検証する**

Run: `npm.cmd run generate:dcf-workbook && npm.cmd run test:dcf-workbook && npm.cmd run validate:dcf-series && npm.cmd run validate:dcf-landing`

Expected: PASS

- [ ] **Step 6: コミットする**

```bash
git add src/app/valuation src/app/downloads/dcf-valuation-model src/components/Dcf* scripts/*dcf* public/downloads/06_DCF評価モデル.xlsx
git commit -m "feat: rebuild Japanese DCF learning series"
```

### Task 6: 残りの公開ページ・法務ページ・ダウンロード導線の総点検

**Files:**
- Modify: `src/app/downloads/page.tsx`
- Modify: `src/app/excel-templates/page.tsx`
- Modify: `src/app/ma-modeling/page.tsx`
- Modify: `src/app/tools/page.tsx`
- Modify: `src/app/books/page.tsx`
- Modify: `src/app/request/page.tsx`
- Modify: `src/app/editorial-policy/page.tsx`
- Modify: `src/app/disclaimer/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/validate-growth-pages.ts`
- Modify: `scripts/validate-organic-growth-static.ts`

**Interfaces:**
- Produces: 全公開ページを覆う表記検証と、Excel・次ページへ到達できる導線

- [ ] **Step 1: 全公開ルートとダウンロードリンクの期待値をテストへ追加する**

```ts
for (const route of publicRoutes) assert.ok(catalogHrefs.has(route), `${route} is discoverable`);
for (const file of downloads) assert.ok(existsSync(`public/downloads/${file.file}`));
assert.doesNotMatch(renderedRequestPage, />Submit</);
```

- [ ] **Step 2: 検証を実行して残存箇所を確認する**

Run: `npm.cmd run validate:language && npm.cmd run validate:growth-pages && npm.cmd run validate:growth-static`

Expected: 残存英語または導線不足があればFAIL

- [ ] **Step 3: 残りの全公開ページを修正し、法務文の意味を変えず表示を統一する**

ページ内に不要な英語小見出しを残さず、目的、対象者、成果物、利用条件を日本語で明示する。

- [ ] **Step 4: 全静的検証を実行する**

Run: `npm.cmd run validate:language && npm.cmd run validate:editorial && npm.cmd run validate:catalog && npm.cmd run validate:growth-pages && npm.cmd run validate:growth-static`

Expected: PASS

- [ ] **Step 5: コミットする**

```bash
git add src/app scripts
git commit -m "feat: complete sitewide practical Japanese copy"
```

### Task 7: 全体QA・画面確認・公開

**Files:**
- Modify: 検証結果が特定したTasks 1–6の対象ファイル

**Interfaces:**
- Consumes: Tasks 1–6の全成果物
- Produces: 公開可能な静的サイト、検証済みExcel、GitHub Pagesの公開URL

- [ ] **Step 1: 全テストを実行する**

Run:

```powershell
npm.cmd run lint
npm.cmd run validate:language
npm.cmd run validate:editorial
npm.cmd run validate:catalog
npm.cmd run validate:growth-pages
npm.cmd run validate:dcf-series
npm.cmd run validate:dcf-landing
npm.cmd run validate:growth-static
npm.cmd run validate:comps-case
npm.cmd run test:learning-workbooks
npm.cmd run test:dcf-workbook
npm.cmd run test:comps-workbook
npm.cmd run build
```

Expected: すべてPASS、Next.js静的書き出し成功

- [ ] **Step 2: PC・スマートフォンで主要画面を確認する**

確認対象：ホーム、学習ロードマップ、仕訳演習、財務三表、非上場企業Valuation、類似会社比較、DCF、ダウンロード。表の横スクロール、ページ内目次、Excel図、ボタン、フッターを確認する。

- [ ] **Step 3: 配布Excelを開いて目視確認する**

確認対象：各ファイルの先頭シート、入力色、式、主要出力、チェック、印刷範囲、不要な英語表示、外部リンクなし。

- [ ] **Step 4: 最終差分をコミットする**

```bash
git add .
git commit -m "fix: complete Japanese content quality review"
```

- [ ] **Step 5: ブランチをGitHubへpushしてPRを作成し、チェック合格後にmainへマージする**

```bash
git push -u origin feature/practical-japanese-content
gh pr create --base main --head feature/practical-japanese-content --title "実務日本語化と全教材の刷新" --body "全公開ページと配布Excelを国内実務向けの日本語へ統一し、会計・財務三表・Valuation・DCF・類似会社比較の解説と数値例を刷新します。"
gh pr checks --watch
gh pr merge --merge
```

- [ ] **Step 6: GitHub Pages公開とURLを確認する**

Run: Pagesワークフローを完了まで監視し、主要HTMLと全Excel URLへHTTPアクセスする。

Expected: 主要ページとダウンロードファイルがHTTP 200。公開ファイルのハッシュが生成物と一致。
