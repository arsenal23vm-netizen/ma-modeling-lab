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
