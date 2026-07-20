# Task 4: Comps Selection Workbook Report

## RED evidence

- Installed the required pinned generator dependency with `npm.cmd install --save-dev exceljs@4.4.0`.
- Added `scripts/test-comps-selection-workbook.ts` before the generator existed.
- Ran `npx.cmd tsx scripts/test-comps-selection-workbook.ts`; ExcelJS failed at the expected read step because `public/downloads/Comps_Selection_Worksheet.xlsx` did not exist (`Error: File not found: public/downloads/Comps_Selection_Worksheet.xlsx`). ExcelJS 4.4.0 reports this as `File not found` rather than the operating-system `ENOENT` wording in the task brief.

## GREEN evidence

- Ran `npm.cmd run generate:comps-workbook; npm.cmd run test:comps-workbook`.
- Generator output: `Comps selection workbook generated: public/downloads/Comps_Selection_Worksheet.xlsx`.
- Validator output: `Comps workbook validation passed`.
- Ran `npm.cmd run build`; the production build completed successfully. Next.js emitted its pre-existing multi-lockfile workspace-root warning only.

## Changed files

- `package.json` and `package-lock.json`: add ExcelJS 4.4.0 and generation/validation scripts.
- `scripts/create-comps-selection-workbook.ts`: deterministic ExcelJS generator using the shared Task 1 case data.
- `scripts/test-comps-selection-workbook.ts`: mechanical ExcelJS validator for sheet order, target value, long-list row count, matrix formula, Role validation, and checks formula.
- `public/downloads/Comps_Selection_Worksheet.xlsx`: generated downloadable workbook.
- `.superpowers/sdd/task-4-report.md`: this evidence record.

## Workbook QA

- Exactly seven sheets in required order: Guide, Target Profile, Long List, Selection Matrix, Peer Roles, Review Memo, Checks.
- Target Profile B4 is 1100; Long List contains 12 candidates on rows 4-15; Selection Matrix contains `SUM(Dn:On)` formulas; Peer Roles uses Role list validation; Review Memo and Checks contain `COUNTIF`/`TEXTJOIN` and check formulas.
- All sheets use frozen panes, auto filters, bounded column widths, line styling, and role/check conditional formatting where relevant.
- Archive relationship inspection passed with no external workbook relationships. The generated file is 21,319 bytes.

## Commit

- `feat: add comps selection Excel workbook` (this commit includes all Task 4 files above).

## Concerns

- ExcelJS writes formulas but does not calculate them; Excel recalculates them on open because the workbook requests full calculation on load.
- The pinned ExcelJS dependency emits upstream deprecation notices during installation; no generated-workbook validation warnings occurred.

## Review remediation: source flags, metadata, and exhaustive validator

### RED evidence

- Expanded the validator before changing the generator, then ran `npx.cmd tsx scripts/test-comps-selection-workbook.ts` against the existing workbook.
- It failed as intended: `Selection Matrix Q reflects service=false and close=true criticalMismatch source flags` expected `[false, true]`, but Q11 and Q13 contained the score-derived formulas `COUNTIF(D11:F11,"<2")+COUNTIF(K11:K11,"<2")` and `COUNTIF(D13:F13,"<2")+COUNTIF(K13:K13,"<2")`.

### GREEN evidence

- Ran `npm.cmd run generate:comps-workbook`; output: `Comps selection workbook generated: public/downloads/Comps_Selection_Worksheet.xlsx`.
- Ran `npm.cmd run test:comps-workbook`; output: `Comps workbook validation passed`.
- Ran `npm.cmd run build`; the production build completed successfully.

### Remediation details

- Selection Matrix Q now writes `candidatePeers[].criticalMismatch` directly, and R writes `candidatePeers[].role` directly. The score-derived low-critical-score warning moved to S.
- The S formula and note derive all critical criteria from `selectionCriteria.filter((criterion) => criterion.critical)` and dynamically map those criteria to score columns; no critical-score coordinates are hard-coded.
- The validator now checks target values B4:B8; every Task 1 candidate ID/name and D:O score; P formulas for every candidate; Q/R source data; Role list validation; Review Memo and Checks formulas; required sheets, Japanese content, styling, freeze panes, filters, print setup, widths, and no external workbook relationships or parts.
