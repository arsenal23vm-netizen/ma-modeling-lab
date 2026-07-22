import assert from "node:assert/strict";
import ExcelJS from "exceljs";

const expected = new Map([
  ["01_仕訳演習.xlsx", ["使い方", "仕訳演習", "三表への影響", "チェック"]],
  ["02_前提条件入力.xlsx", ["使い方", "前提", "Base", "Upside", "Downside", "チェック"]],
  ["03_PLモデル練習.xlsx", ["使い方", "入力", "PL", "チェック"]],
  ["04_BS_CF統合練習.xlsx", ["使い方", "入力", "BS", "CF", "計算明細", "チェック"]],
  ["05_完成3表モデル.xlsx", ["表紙", "入力", "前提", "PL", "BS", "CF", "計算明細", "チェック"]],
  ["07_モデル品質チェックリスト.xlsx", ["使い方", "品質基準", "レビュー結果", "チェック"]],
]);

async function main() {
for (const [file, sheets] of expected) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(`public/downloads/${file}`);
  assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), sheets, `${file}のシート構成`);
  assert.ok(workbook.getWorksheet("チェック"), `${file}にチェックシートが必要`);
  for (const sheet of workbook.worksheets) {
    assert.ok(sheet.views.some((view) => view.state === "frozen"), `${file}/${sheet.name}の見出し固定`);
    assert.ok(sheet.pageSetup.printArea, `${file}/${sheet.name}の印刷範囲`);
  }
}

const journal = new ExcelJS.Workbook();
await journal.xlsx.readFile("public/downloads/01_仕訳演習.xlsx");
assert.equal(journal.getWorksheet("仕訳演習")!.getCell("C5").value, 1200);
assert.equal(journal.getWorksheet("仕訳演習")!.getCell("E5").value, 1200);
assert.equal((journal.getWorksheet("チェック")!.getCell("B5").value as ExcelJS.CellFormulaValue).formula, "SUM(仕訳演習!C5:C7)-SUM(仕訳演習!E5:E7)");

console.log("基礎Excel教材6冊の検査に合格しました");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
