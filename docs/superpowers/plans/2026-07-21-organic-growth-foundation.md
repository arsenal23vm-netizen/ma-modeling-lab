# Organic Growth Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an integrated Japanese DCF learning series, a dedicated DCF workbook landing page, verifiable editorial identity and sourcing, four topic hubs, and full-catalog site search.

**Architecture:** Shared domain data in `dcf-series.ts` drives every DCF calculation and displayed number. Shared editorial and content-catalog records drive bylines, JSON-LD, search, hubs, and related-content links so that dates, authorship, and navigation do not diverge across pages. Focused validation scripts are written before each implementation and run alongside lint and the production static build.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node `assert`, `tsx`, static export to GitHub Pages.

## Global Constraints

- Display the author as `Finance Modeling Lab 編集部`; do not invent qualifications, employers, deal experience, or individual reviewers.
- Rebuild `/downloads/06_DCF評価モデル.xlsx` as a standards-compliant nine-sheet OOXML workbook generated from the shared DCF case.
- Use a shared sample company named `サンプル部品株式会社`, unit `百万円`, forecast period FY2026–FY2030, tax rate 30.0%, and base terminal growth 1.5%.
- Every sensitivity cell must satisfy `WACC > g`; invalid combinations render `N/A` and must never divide by zero or a negative spread.
- Keep the existing visual language: navy `#102235`, teal `#147d73`, Excel green `#217346`, square cards, data tables, and horizontally scrollable worksheet previews.
- Do not add newsletter, RSS, social share buttons, a full browser DCF calculator, PPA/LBO/Sources & Uses articles, or FAQ content written only for rich-result markup.
- New internal URLs must be registered in the content catalog and sitemap and must build under the existing flat static-export convention.

---

## File structure

### Domain and registry files

- Create `src/data/dcf-series.ts`: shared company assumptions, forecasts, valuation functions, sensitivity matrix.
- Create `src/data/editorial.ts`: author identity, per-article dates, revisions, and sources.
- Create `src/data/content-catalog.ts`: complete searchable content registry and related-content selector.
- Create `src/lib/content-search.ts`: normalization and deterministic search ranking.

### Shared components

- Create `src/components/EditorialDetails.tsx`: byline, sources, revision history, Article and BreadcrumbList JSON-LD.
- Create `src/components/DcfLessonShell.tsx`: DCF article shell, series navigation, workbook CTA.
- Create `src/components/DcfFigures.tsx`: FCFF table, WACC bridge, terminal-value comparison, sensitivity grid, EV-to-equity bridge.
- Create `src/components/TopicHub.tsx`: shared hub hero and catalog cards.
- Create `src/components/DcfWorkbookPreview.tsx`: accessible Excel-like worksheet preview.
- Modify `src/components/article-shell.tsx`: consume editorial metadata and catalog-related content.
- Modify `src/components/site-header.tsx`: search the complete content catalog.

### Routes

- Create `src/app/valuation/dcf/page.tsx`.
- Create `src/app/valuation/dcf/fcff/page.tsx`.
- Create `src/app/valuation/dcf/wacc/page.tsx`.
- Create `src/app/valuation/dcf/terminal-value/page.tsx`.
- Create `src/app/valuation/dcf/sensitivity-analysis/page.tsx`.
- Create `src/app/valuation/dcf/enterprise-to-equity/page.tsx`.
- Create `src/app/downloads/dcf-valuation-model/page.tsx`.
- Create `src/app/financial-modeling/page.tsx`.
- Create `src/app/valuation/page.tsx`.
- Create `src/app/ma-modeling/page.tsx`.
- Create `src/app/excel-templates/page.tsx`.
- Modify `src/app/about/page.tsx`, `src/app/page.tsx`, `src/app/sitemap.ts`, and `src/data/site.ts`.
- Modify the nine existing `ArticleShell` call sites plus the custom Valuation and Comps pages.

### Validation

- Create `scripts/validate-dcf-series.ts`.
- Create `scripts/validate-editorial.tsx`.
- Create `scripts/validate-content-catalog.ts`.
- Create `scripts/validate-growth-pages.ts`.
- Create `scripts/validate-dcf-workbook-landing.tsx`.
- Create `scripts/validate-organic-growth-static.ts`.
- Modify `package.json` and `README.md`.

---

### Task 1: Shared DCF case and calculation invariants

**Files:**
- Create: `scripts/validate-dcf-series.ts`
- Create: `src/data/dcf-series.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `dcfCase`, `calculateFcff`, `calculateWacc`, `calculateTerminalValue`, `calculateDcf`, `calculateEquityBridge`, `buildSensitivityMatrix`.
- Consumers: Tasks 5 and 6.

- [ ] **Step 1: Write the failing domain validator**

Create assertions that import the planned functions and require five forecasts, FCFF reconciliation, WACC reconciliation, terminal-value guard behavior, Enterprise Value reconciliation, Equity Value reconciliation, and a 5×5 sensitivity matrix.

```ts
import assert from "node:assert/strict";
import {
  buildSensitivityMatrix,
  calculateDcf,
  calculateEquityBridge,
  calculateFcff,
  calculateTerminalValue,
  calculateWacc,
  dcfCase,
} from "../src/data/dcf-series";

assert.equal(dcfCase.forecasts.length, 5);
assert.ok(Math.abs(calculateFcff(dcfCase.forecasts[0]) - 76.8) < 1e-9);
assert.equal(Number(calculateWacc(dcfCase.wacc).toFixed(4)), 0.0651);
assert.throws(() => calculateTerminalValue(100, 0.015, 0.015), /WACC must exceed/);
const valuation = calculateDcf(dcfCase);
assert.equal(valuation.enterpriseValue, valuation.pvExplicitFcff + valuation.pvTerminalValue);
assert.equal(calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge).equityValue,
  valuation.enterpriseValue + dcfCase.bridge.cash - dcfCase.bridge.debt - dcfCase.bridge.debtLikeItems - dcfCase.bridge.nonControllingInterests);
assert.deepEqual(buildSensitivityMatrix(dcfCase).map((row) => row.cells.length), [5, 5, 5, 5, 5]);
console.log("DCF series validation passed");
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-dcf-series.ts`  
Expected: FAIL because `src/data/dcf-series.ts` does not exist.

- [ ] **Step 3: Implement the shared case**

Define exact forecasts and types. Store currency values unrounded; round only at presentation boundaries.

```ts
export type DcfForecast = { year: string; revenue: number; ebit: number; taxRate: number; depreciation: number; capex: number; increaseInNwc: number };
export type WaccInputs = { riskFreeRate: number; equityRiskPremium: number; beta: number; preTaxCostOfDebt: number; taxRate: number; equityWeight: number; debtWeight: number };
export const calculateFcff = (row: DcfForecast) => row.ebit * (1 - row.taxRate) + row.depreciation - row.capex - row.increaseInNwc;
export const calculateWacc = (input: WaccInputs) =>
  input.equityWeight * (input.riskFreeRate + input.beta * input.equityRiskPremium) +
  input.debtWeight * input.preTaxCostOfDebt * (1 - input.taxRate);
export function calculateTerminalValue(finalFcff: number, wacc: number, growth: number) {
  if (wacc <= growth) throw new Error("WACC must exceed terminal growth");
  return finalFcff * (1 + growth) / (wacc - growth);
}
```

Forecast rows must reconcile to FCFF values `76.8`, `91.1`, `104.1`, `116.5`, and `132.3`. Use WACC inputs 1.5% risk-free rate, 6.0% equity risk premium, beta 1.10, 2.5% pre-tax debt cost, 75% equity weight, 25% debt weight, and 30% tax rate. Use bridge values cash 100, debt 350, debt-like items 20, and non-controlling interests 10.

- [ ] **Step 4: Run GREEN and add the package command**

Add `"validate:dcf-series": "tsx scripts/validate-dcf-series.ts"` to `package.json`.

Run: `npm.cmd run validate:dcf-series`  
Expected: `DCF series validation passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/validate-dcf-series.ts src/data/dcf-series.ts
git commit -m "feat: add shared DCF case"
```

---

### Task 2: Editorial identity, sources, revisions, and structured data

**Files:**
- Create: `scripts/validate-editorial.tsx`
- Create: `src/data/editorial.ts`
- Create: `src/components/EditorialDetails.tsx`
- Modify: `src/components/article-shell.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/model-design/page.tsx`
- Modify: `src/app/assumptions/page.tsx`
- Modify: `src/app/revenue-kpi/page.tsx`
- Modify: `src/app/pl-model/page.tsx`
- Modify: `src/app/bs-model/page.tsx`
- Modify: `src/app/cf-model/page.tsx`
- Modify: `src/app/excel-functions/page.tsx`
- Modify: `src/app/roadmap/page.tsx`
- Modify: `src/app/three-statements/page.tsx`
- Modify: `src/app/private-company-valuation/page.tsx`
- Modify: `src/app/comps-peer-selection/page.tsx`

**Interfaces:**
- Produces: `EDITORIAL_AUTHOR`, `editorialRecords`, `getEditorialRecord(href)`, `<EditorialDetails record breadcrumbs />`.
- Consumers: Task 5 DCF pages.

- [ ] **Step 1: Write the failing editorial validator**

Assert author identity, `/about#editorial-team`, distinct modified dates, nonempty revision summaries, external-source field shape, `Article` JSON-LD, `BreadcrumbList` JSON-LD, and coverage of all current article routes.

```tsx
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialDetails } from "../src/components/EditorialDetails";
import { EDITORIAL_AUTHOR, getEditorialRecord } from "../src/data/editorial";

assert.equal(EDITORIAL_AUTHOR.name, "Finance Modeling Lab 編集部");
assert.equal(EDITORIAL_AUTHOR.url, "/about#editorial-team");
const record = getEditorialRecord("/private-company-valuation");
assert.ok(record.revisionSummary.length >= 10);
const html = renderToStaticMarkup(<EditorialDetails record={record} breadcrumbs={[{ name: "ホーム", href: "/" }, { name: record.title, href: record.href }]} />);
assert.match(html, /Finance Modeling Lab 編集部/);
assert.match(html, /BreadcrumbList/);
assert.match(html, /dateModified/);
console.log("Editorial validation passed");
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-editorial.tsx`  
Expected: FAIL because the editorial modules do not exist.

- [ ] **Step 3: Implement editorial records and rendering**

Use these types and identity.

```ts
export const EDITORIAL_AUTHOR = {
  name: "Finance Modeling Lab 編集部",
  url: "/about#editorial-team",
};
export type EditorialSource = { title: string; publisher: string; url: string; accessedDate: string };
export type EditorialRecord = {
  href: string; title: string; description: string;
  publishedDate: string; modifiedDate: string; revisionSummary: string;
  sources: EditorialSource[];
};
```

`EditorialDetails` must render a visible byline, `<time>` elements, sources, and a one-row revision history. Its JSON-LD uses `Organization` for the author and resolves URLs against `https://arsenal23vm-netizen.github.io/ma-modeling-lab`.

- [ ] **Step 4: Integrate all existing article pages**

Add an exact `href` prop to `ArticleShell` and replace its hard-coded `publishedDate`. Add `EditorialDetails` before each article CTA. Add the component to the two custom Valuation/Comps pages. Add an About section with `id="editorial-team"`, honest team wording, the review policy, and a link to `/request`.

- [ ] **Step 5: Run GREEN**

Run: `npx.cmd tsx scripts/validate-editorial.tsx`  
Expected: `Editorial validation passed`.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-editorial.tsx src/data/editorial.ts src/components/EditorialDetails.tsx src/components/article-shell.tsx src/app
git commit -m "feat: add transparent editorial metadata"
```

---

### Task 3: Complete content catalog and full-site search

**Files:**
- Create: `scripts/validate-content-catalog.ts`
- Create: `src/data/content-catalog.ts`
- Create: `src/lib/content-search.ts`
- Modify: `src/components/site-header.tsx`

**Interfaces:**
- Produces: `ContentEntry`, `contentCatalog`, `searchContent(query)`, `getRelatedContent(href, limit)`.
- Consumers: Tasks 4, 5, 6, and 7.

- [ ] **Step 1: Write the failing search validator**

Require unique hrefs, coverage of current articles/downloads/tools and planned routes, Japanese and English query matching, empty-query featured results, and topic-prioritized related content.

```ts
import assert from "node:assert/strict";
import { contentCatalog, getRelatedContent } from "../src/data/content-catalog";
import { searchContent } from "../src/lib/content-search";

assert.equal(new Set(contentCatalog.map((item) => item.href)).size, contentCatalog.length);
for (const href of ["/private-company-valuation", "/comps-peer-selection", "/journal-lab", "/downloads", "/tools", "/valuation/dcf/wacc", "/downloads/dcf-valuation-model"]) {
  assert.ok(contentCatalog.some((item) => item.href === href), `catalog includes ${href}`);
}
assert.equal(searchContent("WACC")[0].href, "/valuation/dcf/wacc");
assert.ok(searchContent("割引率").some((item) => item.href === "/valuation/dcf/wacc"));
assert.ok(searchContent("").every((item) => item.featured));
assert.ok(getRelatedContent("/valuation/dcf/fcff", 3).every((item) => item.topic === "valuation"));
console.log("Content catalog validation passed");
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-content-catalog.ts`  
Expected: FAIL because the catalog does not exist.

- [ ] **Step 3: Implement catalog and search ranking**

Normalize with Unicode NFKC, lowercase, and whitespace removal. Score exact title match 100, title inclusion 50, keyword inclusion 25, and summary inclusion 10. Sort by score descending, then title. Empty queries return featured entries only.

```ts
export type ContentEntry = {
  href: string; title: string; summary: string;
  type: "article" | "hub" | "download" | "tool" | "reference";
  topic: "financial-modeling" | "valuation" | "ma-modeling" | "excel";
  level: string; readingTime: string; keywords: string[]; featured: boolean;
};
export const normalizeSearchText = (value: string) => value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
export function scoreContent(entry: ContentEntry, needle: string) {
  const title = normalizeSearchText(entry.title);
  if (title === needle) return 100;
  return (title.includes(needle) ? 50 : 0)
    + (entry.keywords.some((word) => normalizeSearchText(word).includes(needle)) ? 25 : 0)
    + (normalizeSearchText(entry.summary).includes(needle) ? 10 : 0);
}
export function searchContent(query: string) {
  const needle = normalizeSearchText(query);
  if (!needle) return contentCatalog.filter((item) => item.featured);
  return contentCatalog.map((item) => ({ item, score: scoreContent(item, needle) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "ja"))
    .map(({ item }) => item);
}
```

- [ ] **Step 4: Replace header search data source**

Remove the direct `lessons` dependency from `site-header.tsx`. Use `searchContent(query)`, show type/topic badges, include all results in a scrollable list, and link zero-results copy to `/request`.

- [ ] **Step 5: Run GREEN**

Run: `npx.cmd tsx scripts/validate-content-catalog.ts`  
Expected: `Content catalog validation passed`.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-content-catalog.ts src/data/content-catalog.ts src/lib/content-search.ts src/components/site-header.tsx
git commit -m "feat: search the full content catalog"
```

---

### Task 4: Four topic hubs and navigation

**Files:**
- Create: `scripts/validate-growth-pages.ts`
- Create: `src/components/TopicHub.tsx`
- Create: `src/app/financial-modeling/page.tsx`
- Create: `src/app/valuation/page.tsx`
- Create: `src/app/ma-modeling/page.tsx`
- Create: `src/app/excel-templates/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/data/site.ts`

**Interfaces:**
- Consumes: `contentCatalog` from Task 3.
- Produces: four public hub routes and simplified primary navigation.

- [ ] **Step 1: Write the failing hub validator**

Read the four page files and assert unique H1 copy, catalog-driven `TopicHub`, metadata descriptions, no links to unpublished PPA/LBO pages, and Home links to all four hubs.

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const home = readFileSync("src/app/page.tsx", "utf8");
for (const route of ["financial-modeling", "valuation", "ma-modeling", "excel-templates"]) {
  const page = readFileSync(`src/app/${route}/page.tsx`, "utf8");
  assert.match(page, /<TopicHub/);
  assert.ok(home.includes(`/${route}`));
}
assert.ok(!home.includes("/valuation/ppa"));
console.log("Growth hub validation passed");
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-growth-pages.ts`  
Expected: FAIL because the hub routes do not exist.

- [ ] **Step 3: Implement `TopicHub` and the routes**

`TopicHub` accepts `topic`, `eyebrow`, `title`, `lead`, and `learningSteps`. It filters catalog entries by topic and renders featured first without duplicating hrefs. Each hub explains who it is for, a three-step learning order, available content, and future themes as plain text.

- [ ] **Step 4: Update Home and navigation**

Replace the dense individual-topic header list with Home, 財務モデリング, Valuation, M&Aモデル, Excel教材, 検索. Keep About/legal pages in the footer. Add a Home section titled `学習テーマから探す` linking the four hubs.

- [ ] **Step 5: Run GREEN and accessibility checks**

Run: `npx.cmd tsx scripts/validate-growth-pages.ts`  
Expected: `Growth hub validation passed`.

Run: `npm.cmd run lint -- --max-warnings=0`  
Expected: exit 0 with no warnings.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-growth-pages.ts src/components/TopicHub.tsx src/app/financial-modeling src/app/valuation src/app/ma-modeling src/app/excel-templates src/app/page.tsx src/data/site.ts
git commit -m "feat: add topic discovery hubs"
```

---

### Task 5: DCF hub and five formula-driven lessons

**Files:**
- Create: `src/components/DcfLessonShell.tsx`
- Create: `src/components/DcfFigures.tsx`
- Create: `src/app/valuation/dcf/page.tsx`
- Create: `src/app/valuation/dcf/fcff/page.tsx`
- Create: `src/app/valuation/dcf/wacc/page.tsx`
- Create: `src/app/valuation/dcf/terminal-value/page.tsx`
- Create: `src/app/valuation/dcf/sensitivity-analysis/page.tsx`
- Create: `src/app/valuation/dcf/enterprise-to-equity/page.tsx`
- Modify: `scripts/validate-growth-pages.ts`
- Modify: `src/app/globals.css`
- Modify: `src/data/editorial.ts`
- Modify: `src/data/content-catalog.ts`

**Interfaces:**
- Consumes: DCF functions from Task 1, editorial records from Task 2, catalog from Task 3.
- Produces: DCF hub plus five complete lesson routes.

- [ ] **Step 1: Extend the failing page validator**

For each lesson assert metadata, one H1, its required formula string, a numeric example sourced through `dcfCase`, workbook CTA, previous/next links, EditorialDetails, and breadcrumbs. Assert the hub links all five in order.

Required formula markers:

```ts
const required = {
  fcff: "FCFF = EBIT × (1 − Tax Rate) + D&amp;A − Capex − Increase in NWC",
  wacc: "WACC = E / (D + E) × Cost of Equity + D / (D + E) × After-tax Cost of Debt",
  "terminal-value": "Terminal Value = FCFF(n+1) / (WACC − g)",
  "sensitivity-analysis": "WACC × Terminal Growth",
  "enterprise-to-equity": "Equity Value = Enterprise Value + Cash − Debt − Debt-like Items − Non-controlling Interests",
};
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-growth-pages.ts`  
Expected: FAIL because DCF routes are missing.

- [ ] **Step 3: Implement shared DCF shells and figures**

`DcfLessonShell` renders breadcrumb, series number, reading time, title, lead, byline, optional TOC, article body, workbook CTA, related/previous/next links, and EditorialDetails. `DcfFigures` exports five accessible figure components using real HTML tables, captions, `scope="col"`, and `.data-scroll`.

- [ ] **Step 4: Implement the DCF hub**

Explain the five-stage flow, show the sample-company assumption card, list outputs, and include start/download CTAs. The hub must distinguish Enterprise Value and Equity Value before linking to lessons.

- [ ] **Step 5: Implement the five lessons**

Each lesson must contain:

- definition and when it is used;
- step-by-step calculation with the shared numbers;
- an Excel formula using explicit example cells;
- one Excel-style figure;
- two common errors and one review check;
- links to the previous/next DCF stage and workbook landing page;
- sources and revision history from the editorial registry.

The sensitivity page displays WACC rows `5.5%, 6.0%, 6.5%, 7.0%, 7.5%` and growth columns `0.5%, 1.0%, 1.5%, 2.0%, 2.5%`. Invalid cells display `N/A`.

- [ ] **Step 6: Run domain, content, and page validators**

Run:

```powershell
npm.cmd run validate:dcf-series
npx.cmd tsx scripts/validate-editorial.tsx
npx.cmd tsx scripts/validate-content-catalog.ts
npx.cmd tsx scripts/validate-growth-pages.ts
```

Expected: all four exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/DcfLessonShell.tsx src/components/DcfFigures.tsx src/app/valuation/dcf src/app/globals.css src/data/editorial.ts src/data/content-catalog.ts scripts/validate-growth-pages.ts
git commit -m "feat: publish the DCF learning series"
```

---

### Task 6: Dedicated DCF workbook landing page

**Files:**
- Create: `scripts/validate-dcf-workbook-landing.tsx`
- Create: `scripts/create-dcf-workbook.ts`
- Create: `scripts/test-dcf-workbook.ts`
- Create: `src/components/DcfWorkbookPreview.tsx`
- Create: `src/app/downloads/dcf-valuation-model/page.tsx`
- Replace: `public/downloads/06_DCF評価モデル.xlsx`
- Modify: `src/app/downloads/page.tsx`
- Modify: `src/data/content-catalog.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: shared DCF case and catalog.
- Produces: a standards-compliant nine-sheet workbook, `/downloads/dcf-valuation-model`, and two direct workbook CTAs.

- [ ] **Step 1: Write the failing landing-page validator**

Assert that the generated workbook is present, the page renders two links with the exact encoded browser path, all required sections, nine named sheet roles, an accessible preview caption, and links to all five DCF lessons.

```tsx
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "../src/app/downloads/dcf-valuation-model/page";

assert.ok(existsSync("public/downloads/06_DCF評価モデル.xlsx"));
const html = renderToStaticMarkup(<Page />);
assert.equal((html.match(/06_DCF評価モデル\.xlsx/g) ?? []).length >= 2, true);
for (const heading of ["対象読者", "シート構成", "入力方法", "主要数式", "Checks", "利用上の注意"]) assert.ok(html.includes(heading));
assert.match(html, /<caption/);
console.log("DCF workbook landing validation passed");
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-dcf-workbook-landing.tsx`  
Expected: FAIL because the landing route does not exist.

- [ ] **Step 3: Write the failing workbook validator**

Load the existing workbook with ExcelJS and assert nine exact sheet names. This must fail against the pre-existing nonstandard archive because ExcelJS reads zero sheets.

```ts
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile("public/downloads/06_DCF評価モデル.xlsx");
assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), ["Cover", "Inputs", "Assumptions", "PL", "BS", "CF", "Schedules", "DCF", "Checks"]);
assert.equal(workbook.getWorksheet("Cover")?.getCell("B5").value, "Calculation integrity");
assert.equal(workbook.getWorksheet("Cover")?.getCell("B6").value, "Decision readiness");
const zip = await JSZip.loadAsync(await readFile("public/downloads/06_DCF評価モデル.xlsx"));
assert.ok(zip.file("xl/workbook.xml"));
assert.ok(!Object.keys(zip.files).some((name) => name.includes("externalLinks")));
console.log("DCF workbook validation passed");
```

Run: `npx.cmd tsx scripts/test-dcf-workbook.ts`
Expected: FAIL because the old workbook is not readable as a standard nine-sheet archive.

- [ ] **Step 4: Implement the workbook generator**

Generate exact sheets `Cover`, `Inputs`, `Assumptions`, `PL`, `BS`, `CF`, `Schedules`, `DCF`, `Checks` with ExcelJS. `Cover` opens first and displays `Calculation integrity: OK` and `Decision readiness: Educational sample / source review required`. Use blue fill for editable assumptions, formulas for FCFF/WACC/Terminal Value/discount factors/EV/Equity Value, a 5×5 WACC-growth sensitivity, and Checks formulas for weights sum, WACC greater than growth, EV bridge, and formula-error count. Freeze headers, set print areas and fit-to-width, bound column widths, and create no external relationships.

Add package scripts:

```json
"generate:dcf-workbook": "tsx scripts/create-dcf-workbook.ts",
"test:dcf-workbook": "tsx scripts/test-dcf-workbook.ts"
```

Run:

```powershell
npm.cmd run generate:dcf-workbook
npm.cmd run test:dcf-workbook
```

Expected: `DCF workbook validation passed` and ExcelJS reports all nine sheets.

- [ ] **Step 5: Implement the preview and landing page**

Render Cover, Inputs, Assumptions, PL, BS, CF, Schedules, DCF, and Checks roles. The preview must show blue input cells, formula cells, output cells, a formula bar, row/column headers, and sheet tabs without using an image asset.

- [ ] **Step 6: Link from the download center**

Add a `詳しい使い方を見る` link for the DCF workbook card while keeping the direct download available. Register the landing route in the catalog.

- [ ] **Step 7: Run GREEN**

Run: `npx.cmd tsx scripts/validate-dcf-workbook-landing.tsx`  
Expected: `DCF workbook landing validation passed`.

- [ ] **Step 8: Commit**

```bash
git add scripts/create-dcf-workbook.ts scripts/test-dcf-workbook.ts scripts/validate-dcf-workbook-landing.tsx public/downloads/06_DCF評価モデル.xlsx src/components/DcfWorkbookPreview.tsx src/app/downloads/dcf-valuation-model src/app/downloads/page.tsx src/data/content-catalog.ts src/app/globals.css package.json package-lock.json
git commit -m "feat: add DCF workbook landing page"
```

---

### Task 7: Sitemap, canonical metadata, static-link QA, docs, and final acceptance

**Files:**
- Create: `scripts/validate-organic-growth-static.ts`
- Modify: `src/app/sitemap.ts`
- Modify: metadata exports in all new route files
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: all routes and catalog entries from Tasks 1–6.
- Produces: deployable static export and final validation command.

- [ ] **Step 1: Write the failing integration validator**

Require all 11 new routes plus the previously omitted existing `/three-statements` route in the sitemap and generated `out` files, canonical URLs, unique titles/descriptions, internal links resolving to an exported page/public file, the workbook in `out/downloads`, and catalog coverage.

```ts
const newRoutes = [
  "/financial-modeling", "/valuation", "/ma-modeling", "/excel-templates", "/valuation/dcf",
  "/valuation/dcf/fcff", "/valuation/dcf/wacc", "/valuation/dcf/terminal-value",
  "/valuation/dcf/sensitivity-analysis", "/valuation/dcf/enterprise-to-equity",
  "/downloads/dcf-valuation-model", "/three-statements",
];
```

The validator reads `out/<route>.html` because this project intentionally uses flat static export.

- [ ] **Step 2: Run the validator and verify RED**

Run: `npx.cmd tsx scripts/validate-organic-growth-static.ts`  
Expected: FAIL before the production build and sitemap integration.

- [ ] **Step 3: Integrate sitemap and canonical metadata**

Add each route with an accurate `lastModified` of `2026-07-21`, appropriate priority, and monthly change frequency. Set `alternates.canonical` on every new page. Do not assign a shared canonical to multiple pages.

- [ ] **Step 4: Add commands and README documentation**

Add package scripts:

```json
"validate:dcf-series": "tsx scripts/validate-dcf-series.ts",
"validate:editorial": "tsx scripts/validate-editorial.tsx",
"validate:catalog": "tsx scripts/validate-content-catalog.ts",
"validate:growth-pages": "tsx scripts/validate-growth-pages.ts",
"validate:dcf-landing": "tsx scripts/validate-dcf-workbook-landing.tsx",
"validate:growth-static": "tsx scripts/validate-organic-growth-static.ts"
```

Document the routes, shared data source, author identity, and validation commands in README.

- [ ] **Step 5: Build and run full verification**

Run:

```powershell
npm.cmd run validate:dcf-series
npm.cmd run validate:editorial
npm.cmd run validate:catalog
npm.cmd run validate:growth-pages
npm.cmd run validate:dcf-landing
npm.cmd run test:dcf-workbook
npm.cmd run lint -- --max-warnings=0
npm.cmd run build
npm.cmd run validate:growth-static
git diff --check
git status --short
```

Expected: every command exits 0; lint has no warnings; all new routes appear as static in the build; only intended files are modified.

- [ ] **Step 6: Visual acceptance**

Serve `out` and inspect desktop 1280px and mobile 390px for `/valuation/dcf`, `/valuation/dcf/wacc`, `/downloads/dcf-valuation-model`, and the header search. Verify sticky navigation, table scrolling, visible focus, search closing via Escape, result links, and both workbook CTAs.

- [ ] **Step 7: Final code review and fixes**

Review the complete branch against `docs/superpowers/specs/2026-07-21-organic-growth-foundation-design.md`. Fix all Critical and Important findings, rerun Step 5, and request a clean re-review.

- [ ] **Step 8: Commit**

```bash
git add src/app/sitemap.ts src/app package.json README.md scripts/validate-organic-growth-static.ts
git commit -m "feat: integrate organic growth foundation"
```

- [ ] **Step 9: Publish after user-selected branch completion**

Merge or create a PR according to `superpowers:finishing-a-development-branch`. After push, verify the DCF hub, all five lessons, workbook landing page, four topic hubs, and the workbook URL return HTTP 200.
