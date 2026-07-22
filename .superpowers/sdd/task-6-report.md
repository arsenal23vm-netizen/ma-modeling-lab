# Task 6 Report: Dedicated DCF Workbook Landing Page

Date: 2026-07-21

## Delivered

- Replaced the legacy `06_DCF評価モデル.xlsx` archive with an ExcelJS-readable OOXML workbook containing exactly `Cover`, `Inputs`, `Assumptions`, `PL`, `BS`, `CF`, `Schedules`, `DCF`, and `Checks`.
- Used `src/data/dcf-series.ts` as the workbook's value source.
- Added formula-driven FCFF, WACC, guarded Terminal Value, period-end discount factors, Enterprise Value, Equity Value, and a cached 5×5 WACC-growth sensitivity matrix.
- Added formula-driven capital-weight, WACC-growth, EV-bridge, and formula-error checks. Calculation integrity and decision readiness remain separate statuses.
- Added the `/downloads/dcf-valuation-model` landing page, an accessible HTML worksheet preview, two direct download CTAs, five lesson links, compatibility/caution copy, canonical metadata, sitemap registration, and catalog/hub discoverability.
- Kept the direct download CTA on the download center and added `詳しい使い方を見る`.
- Made workbook and details links base-path-aware with Next links; a Pages-base-path export confirmed the emitted `/ma-modeling-lab/...` hrefs.
- Made `Cover` calculation integrity and decision readiness formula-reference the corresponding aggregate `Checks` statuses.
- Published the dedicated landing page through both the Valuation and Excel Templates hubs.
- Made workbook generation byte-deterministic by rebuilding the ExcelJS archive with stable lexical entry ordering, fixed ZIP timestamps, fixed core-property timestamps, DOS ZIP platform metadata, and DEFLATE level 9.
- Exposed a side-effect-free `createDcfWorkbookBuffer()` API and an output-path-aware writer so reproducibility tests never overwrite the committed artifact.

## TDD evidence

- Landing RED: `npx.cmd tsx scripts/validate-dcf-workbook-landing.tsx` failed because the landing route module did not exist.
- Workbook RED: `npx.cmd tsx scripts/test-dcf-workbook.ts` read the legacy archive and failed with zero worksheets versus the required nine-sheet list.
- Workbook GREEN: `DCF workbook validation passed (9 sheets)`.
- Landing GREEN: `DCF workbook landing validation passed`.
- Determinism GREEN: three independent generations produced SHA-256 `7858e5f31b5d96ba45e1106add0b9dc3d7568c22a50e7f4dd5befa4bcba3d790`.

## Verification

- All focused validators passed: DCF series, workbook, workbook landing, content catalog, growth pages, editorial, Comps case/page/figures/workbook.
- The workbook validator generates three in-memory archives and asserts identical SHA-256, stable ZIP entry order, fixed timestamps, normalized core properties, and ExcelJS readability.
- `npm.cmd run lint -- --max-warnings=0` passed with zero warnings.
- `npx.cmd tsc --noEmit` passed.
- `PAGES_BASE_PATH=/ma-modeling-lab npx.cmd next build --webpack` passed and statically generated `/downloads/dcf-valuation-model` among 39 pages.
- Emitted-HTML inspection confirmed two base-path-prefixed landing CTAs plus base-path-prefixed direct/details links on the download center.
- `git diff --check` passed. Git reported only the repository's existing LF-to-CRLF checkout notices.

## Build environment note

The default Turbopack build panicked before compilation completion because its generated source-map path exceeded the Windows filesystem path limit inside this deeply nested worktree. Running the same production build with Next.js' supported `--webpack` option completed compilation, type checking, and static export successfully. This was an environment/path-length limitation rather than an application compile failure.
