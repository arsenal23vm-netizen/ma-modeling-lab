import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { candidatePeers, selectionCriteria, targetProfile } from "../src/data/comps-selection";

const workbookPath = "public/downloads/Comps_Selection_Worksheet.xlsx";
const sheetNames = ["Guide", "Target Profile", "Long List", "Selection Matrix", "Peer Roles", "Review Memo", "Checks"];
const colors = { navy: "FF102235", teal: "FF147D73", input: "FFE7F0FF" };

function assertFrozenAndPrintable(sheet: ExcelJS.Worksheet, autoFilter: string) {
  assert.equal(sheet.views[0]?.state, "frozen", `${sheet.name} freezes panes`);
  assert.ok(sheet.views[0]?.ySplit, `${sheet.name} freezes header rows`);
  assert.equal(sheet.autoFilter, autoFilter, `${sheet.name} has the expected auto filter`);
  assert.equal(sheet.pageSetup.fitToPage, true, `${sheet.name} uses fit-to-page printing`);
  assert.equal(sheet.pageSetup.fitToWidth, 1, `${sheet.name} fits to one page width`);
  assert.ok((sheet.getColumn(1).width ?? 0) >= 12, `${sheet.name} has bounded column widths`);
}

function patternFillColor(cell: ExcelJS.Cell) {
  return cell.fill.type === "pattern" ? cell.fill.fgColor?.argb : undefined;
}

async function assertNoExternalRelationships() {
  const zip = await JSZip.loadAsync(await readFile(workbookPath));
  const relationshipXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("string");
  assert.ok(relationshipXml, "workbook relationships exist");
  assert.doesNotMatch(relationshipXml, /externalLink/i, "workbook has no external relationships");
  assert.equal(Object.keys(zip.files).filter((name) => name.startsWith("xl/externalLinks/")).length, 0, "workbook has no external-link parts");
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);

  assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), sheetNames);

  const guide = workbook.getWorksheet("Guide");
  const target = workbook.getWorksheet("Target Profile");
  const longList = workbook.getWorksheet("Long List");
  const matrix = workbook.getWorksheet("Selection Matrix");
  const peerRoles = workbook.getWorksheet("Peer Roles");
  const reviewMemo = workbook.getWorksheet("Review Memo");
  const checks = workbook.getWorksheet("Checks");
  assert.ok(guide && target && longList && matrix && peerRoles && reviewMemo && checks, "all required sheets exist");

  assert.equal(patternFillColor(guide.getCell("A1")), colors.navy, "Guide title uses navy fill");
  assert.match(String(guide.getCell("A2").value), /類似上場会社/, "Guide preserves Japanese instructional content");

  assert.deepEqual(
    [target.getCell("B4").value, target.getCell("B5").value, target.getCell("B6").value, target.getCell("B7").value, target.getCell("B8").value]
      .map((value) => typeof value === "number" ? Number(value.toFixed(4)) : value),
    [1100, 0.164, 0.25, 0.7, 0.3],
    "Target Profile B4:B8 exactly matches the case values",
  );
  assert.equal(patternFillColor(target.getCell("B4")), colors.input, "Target Profile inputs use blue fill");
  assert.equal(target.getCell("B5").numFmt, "0.0%", "Target Profile percentage format is retained");

  assert.equal(longList.actualRowCount, 15, "Long List has headers plus all 12 candidates");
  candidatePeers.forEach((peer, index) => {
    const row = index + 4;
    assert.equal(longList.getCell(row, 1).value, peer.id, `${peer.id} Long List ID matches Task 1 data`);
    assert.equal(longList.getCell(row, 2).value, peer.name, `${peer.id} Long List name matches Task 1 data`);
  });

  candidatePeers.forEach((peer, index) => {
    const row = index + 4;
    selectionCriteria.forEach((criterion, scoreIndex) => {
      assert.equal(matrix.getCell(row, scoreIndex + 4).value, peer.scores[criterion.id], `${peer.id} ${criterion.id} score matches Task 1 data`);
    });
    assert.equal(matrix.getCell(row, 16).formula, `SUM(D${row}:O${row})`, `${peer.id} total-score formula is present`);
  });

  const serviceRow = candidatePeers.findIndex((peer) => peer.id === "service") + 4;
  const closeRow = candidatePeers.findIndex((peer) => peer.id === "close") + 4;
  assert.deepEqual(
    [matrix.getCell(serviceRow, 17).value, matrix.getCell(closeRow, 17).value],
    [false, true],
    "Selection Matrix Q reflects service=false and close=true criticalMismatch source flags",
  );
  candidatePeers.forEach((peer, index) => {
    const row = index + 4;
    assert.equal(matrix.getCell(row, 17).value, peer.criticalMismatch, `${peer.id} criticalMismatch source flag is in Q`);
    assert.equal(matrix.getCell(row, 18).value, peer.role, `${peer.id} source role is in R`);
  });
  assert.equal(matrix.getCell(3, 19).value, "重大基準の低スコア", "score-derived warning is separate from source criticalMismatch");
  const criticalIds = selectionCriteria.filter((criterion) => criterion.critical).map((criterion) => criterion.id).join(", ");
  assert.match(String(matrix.getCell(4, 19).note), new RegExp(criticalIds.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "critical-score note is derived from criterion metadata");

  candidatePeers.forEach((peer, index) => {
    const validation = peerRoles.getCell(index + 5, 3).dataValidation;
    assert.equal(validation.type, "list", `${peer.id} Role cell uses list validation`);
    assert.match(validation.formulae?.[0] ?? "", /core_peer/, `${peer.id} Role validation includes core_peer`);
  });

  ["COUNTIF", "TEXTJOIN", "TEXTJOIN", "TEXTJOIN", "COUNTIF"].forEach((formulaToken, index) => {
    assert.match(reviewMemo.getCell(index + 5, 2).formula ?? "", new RegExp(formulaToken), `Review Memo row ${index + 5} has ${formulaToken}`);
  });
  assert.match(String(reviewMemo.getCell("B10").value), /Core Peer/, "Review Memo has a conclusion");

  const expectedChecks = ["Role未入力", "データ未確認", "重大基準の不一致", "Core Peer数", "候補数", "外部リンク"];
  expectedChecks.forEach((label, index) => {
    assert.equal(checks.getCell(index + 4, 1).value, label, `Checks includes ${label}`);
  });
  ["COUNTBLANK", "COUNTIF", "COUNTIF", "COUNTIF", "COUNTA"].forEach((formulaToken, index) => {
    assert.match(checks.getCell(index + 4, 2).formula ?? "", new RegExp(formulaToken), `Checks row ${index + 4} has ${formulaToken}`);
  });
  assert.equal(checks.getCell("B9").value, "なし", "Checks records no external links");

  [
    [guide, "A4:D9"],
    [target, "A3:C13"],
    [longList, "A3:K15"],
    [matrix, "A3:T15"],
    [peerRoles, "A4:F16"],
    [reviewMemo, "A4:D10"],
    [checks, "A3:C9"],
  ].forEach(([sheet, filter]) => assertFrozenAndPrintable(sheet as ExcelJS.Worksheet, filter as string));
  assert.equal(patternFillColor(matrix.getCell("A3")), colors.teal, "Selection Matrix header uses teal fill");

  await assertNoExternalRelationships();
  console.log("Comps workbook validation passed");
}

void main();
