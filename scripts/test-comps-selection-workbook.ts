import assert from "node:assert/strict";
import ExcelJS from "exceljs";

const workbook = new ExcelJS.Workbook();

async function main() {
  await workbook.xlsx.readFile("public/downloads/Comps_Selection_Worksheet.xlsx");

  assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), [
    "Guide",
    "Target Profile",
    "Long List",
    "Selection Matrix",
    "Peer Roles",
    "Review Memo",
    "Checks",
  ]);
  assert.equal(workbook.getWorksheet("Target Profile")?.getCell("B4").value, 1100);
  assert.equal(workbook.getWorksheet("Long List")?.actualRowCount, 15);
  assert.equal(workbook.getWorksheet("Selection Matrix")?.getCell("P5").formula, "SUM(D5:O5)");
  assert.equal(workbook.getWorksheet("Peer Roles")?.getCell("C5").dataValidation.type, "list");
  assert.ok(workbook.getWorksheet("Checks")?.getCell("B4").formula);

  console.log("Comps workbook validation passed");
}

void main();
