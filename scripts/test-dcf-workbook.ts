import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { buildSensitivityMatrix, calculateDcf, calculateEquityBridge, calculateFcff, calculateWacc, dcfCase } from "../src/data/dcf-series";

const workbookPath = "public/downloads/06_DCF評価モデル.xlsx";
const expectedSheets = ["Cover", "Inputs", "Assumptions", "PL", "BS", "CF", "Schedules", "DCF", "Checks"];
const inputFill = "FFE7F0FF";
const formulaFill = "FFF3F6F8";
const outputFill = "FFE9F6EF";

async function main() {
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(workbookPath);

assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), expectedSheets, "workbook must contain the exact nine-sheet model in order");
const sheet = (name: string) => {
  const value = workbook.getWorksheet(name);
  assert.ok(value, `missing worksheet: ${name}`);
  return value;
};

const formulaAt = (sheetName: string, address: string) => {
  const value = sheet(sheetName).getCell(address).value;
  assert.ok(value && typeof value === "object" && "formula" in value, `${sheetName}!${address} must contain a formula`);
  return value as ExcelJS.CellFormulaValue;
};

const assertClose = (actual: unknown, expected: number, message: string, tolerance = 1e-9) => {
  if (typeof actual !== "number") throw new TypeError(`${message}: cached result must be numeric`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: expected ${expected}, received ${actual}`);
};

const fillAt = (sheetName: string, address: string) => {
  const fill = sheet(sheetName).getCell(address).fill;
  assert.equal(fill.type, "pattern", `${sheetName}!${address} must use a pattern fill`);
  const color = fill.fgColor?.argb;
  assert.equal(typeof color, "string", `${sheetName}!${address} must define a fill color`);
  return color;
};

const cover = sheet("Cover");
assert.equal(cover.getCell("B5").value, "Calculation integrity");
assert.equal(formulaAt("Cover", "C5").formula, "Checks!B10");
assert.equal(formulaAt("Cover", "C5").result, "OK");
assert.equal(cover.getCell("B6").value, "Decision readiness");
assert.equal(formulaAt("Cover", "C6").formula, "Checks!B11");
assert.equal(formulaAt("Cover", "C6").result, "Educational sample / source review required");

const inputs = sheet("Inputs");
dcfCase.forecasts.forEach((forecast, index) => {
  const column = String.fromCharCode("B".charCodeAt(0) + index);
  const expected = [forecast.revenue, forecast.ebit, forecast.taxRate, forecast.depreciation, forecast.capex, forecast.increaseInNwc];
  expected.forEach((value, rowIndex) => assert.equal(inputs.getCell(`${column}${5 + rowIndex}`).value, value));
});
const scalarInputs: Record<string, number> = {
  B14: dcfCase.wacc.riskFreeRate,
  B15: dcfCase.wacc.equityRiskPremium,
  B16: dcfCase.wacc.beta,
  B17: dcfCase.wacc.preTaxCostOfDebt,
  B18: dcfCase.wacc.taxRate,
  B19: dcfCase.wacc.equityWeight,
  B20: dcfCase.wacc.debtWeight,
  B21: dcfCase.terminalGrowthRate,
  B22: dcfCase.bridge.cash,
  B23: dcfCase.bridge.debt,
  B24: dcfCase.bridge.debtLikeItems,
  B25: dcfCase.bridge.nonControllingInterests,
};
for (const [address, value] of Object.entries(scalarInputs)) assert.equal(inputs.getCell(address).value, value, `Inputs!${address}`);
for (const address of ["B5", "F10", ...Object.keys(scalarInputs)]) assert.equal(fillAt("Inputs", address), inputFill, `Inputs!${address} must be styled as an editable input`);

const expectedWacc = calculateWacc(dcfCase.wacc);
const assumptionsFormulas: Record<string, RegExp> = {
  B8: /^Inputs!B14\+Inputs!B16\*Inputs!B15$/,
  B9: /^Inputs!B17\*\(1-Inputs!B18\)$/,
  B10: /^Inputs!B19\+Inputs!B20$/,
  B11: /^Inputs!B19\*B8\+Inputs!B20\*B9$/,
  B12: /^Inputs!B21$/,
};
for (const [address, dependency] of Object.entries(assumptionsFormulas)) assert.match(formulaAt("Assumptions", address).formula, dependency, `Assumptions!${address} dependency`);
assertClose(formulaAt("Assumptions", "B11").result, expectedWacc, "WACC cached result");
assert.equal(sheet("Assumptions").getCell("B5").value, "Period-end convention");
assert.equal(sheet("Assumptions").getCell("C5").value, "Each forecast year-end / 1–5 periods");

dcfCase.forecasts.forEach((forecast, index) => {
  const column = String.fromCharCode("B".charCodeAt(0) + index);
  assert.match(formulaAt("CF", `${column}11`).formula, new RegExp(`^${column}5\\*\\(1-${column}6\\)\\+${column}8-${column}9-${column}10$`));
  assertClose(formulaAt("CF", `${column}11`).result, calculateFcff(forecast), `CF!${column}11 FCFF`);
  assert.match(formulaAt("Schedules", `${column}10`).formula, new RegExp(String.raw`^1/\(1\+Assumptions!\$B\$11\)\^${column}9$`));
  assert.match(formulaAt("DCF", `${column}5`).formula, new RegExp(`^CF!${column}11$`));
  assert.match(formulaAt("DCF", `${column}6`).formula, new RegExp(`^Schedules!${column}10$`));
  assert.match(formulaAt("DCF", `${column}7`).formula, new RegExp(`^${column}5\\*${column}6$`));
});

const valuation = calculateDcf(dcfCase);
const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
assert.equal(formulaAt("DCF", "B10").formula, "SUM(B7:F7)");
assert.equal(formulaAt("DCF", "B11").formula, "F5*(1+Assumptions!$B$12)");
assert.equal(formulaAt("DCF", "B12").formula, "IF(Assumptions!$B$11<=Assumptions!$B$12,NA(),B11/(Assumptions!$B$11-Assumptions!$B$12))");
assert.equal(formulaAt("DCF", "B13").formula, "B12*F6");
assert.equal(formulaAt("DCF", "B14").formula, "B10+B13");
assert.equal(formulaAt("DCF", "B20").formula, "B14+B16-B17-B18-B19");
assertClose(formulaAt("DCF", "B14").result, valuation.enterpriseValue, "enterprise value", 1e-6);
assertClose(formulaAt("DCF", "B20").result, bridge.equityValue, "equity value", 1e-6);
assert.equal(fillAt("DCF", "B14"), outputFill);
assert.equal(fillAt("DCF", "B20"), outputFill);
assert.equal(fillAt("DCF", "B12"), formulaFill);

const sensitivity = buildSensitivityMatrix(dcfCase);
assert.equal(sheet("DCF").getCell("C25").value, dcfCase.sensitivity.terminalGrowthRates[0]);
assert.equal(sheet("DCF").getCell("G25").value, dcfCase.sensitivity.terminalGrowthRates[4]);
assert.equal(sheet("DCF").getCell("B26").value, dcfCase.sensitivity.waccRates[0]);
assert.equal(sheet("DCF").getCell("B30").value, dcfCase.sensitivity.waccRates[4]);
const cachedMatrix: number[][] = [];
for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
  const row: number[] = [];
  for (let columnIndex = 0; columnIndex < 5; columnIndex += 1) {
    const address = `${String.fromCharCode("C".charCodeAt(0) + columnIndex)}${26 + rowIndex}`;
    const cell = formulaAt("DCF", address);
    assert.match(cell.formula, /^IF\(\$B\d+<=[A-Z]\$25,NA\(\),/u, `${address} must guard WACC <= growth`);
    const expected = sensitivity[rowIndex].cells[columnIndex].enterpriseValue;
    assert.notEqual(expected, null);
    assertClose(cell.result, expected!, `sensitivity ${address}`, 1e-6);
    row.push(cell.result as number);
  }
  cachedMatrix.push(row);
}
for (const row of cachedMatrix) for (let index = 1; index < row.length; index += 1) assert.ok(row[index] > row[index - 1], "enterprise value must rise with terminal growth");
for (let column = 0; column < 5; column += 1) for (let row = 1; row < 5; row += 1) assert.ok(cachedMatrix[row][column] < cachedMatrix[row - 1][column], "enterprise value must fall as WACC rises");

sheet("Checks");
assert.equal(formulaAt("Checks", "B5").formula, "Inputs!B19+Inputs!B20");
assert.equal(formulaAt("Checks", "B6").formula, "Assumptions!B11>Assumptions!B12");
assert.equal(formulaAt("Checks", "B7").formula, "DCF!B20-(DCF!B14+DCF!B16-DCF!B17-DCF!B18-DCF!B19)");
assert.match(formulaAt("Checks", "B8").formula, /^SUMPRODUCT\(--ISERROR\(/, "formula-error count must be formula-driven");
assert.match(formulaAt("Checks", "B8").formula, /PL!B5:F9/u);
assert.match(formulaAt("Checks", "B8").formula, /BS!B5:F12/u);
for (const address of ["C5", "C6", "C7", "C8"]) {
  assert.match(formulaAt("Checks", address).formula, /^IF\(/);
  assert.equal(formulaAt("Checks", address).result, "OK");
}
assert.equal(formulaAt("Checks", "B10").formula, 'IF(COUNTIF(C5:C8,"<>OK")=0,"OK","ERROR")');
assert.equal(formulaAt("Checks", "B10").result, "OK");
assert.equal(formulaAt("Checks", "B11").formula, '"Educational sample / source review required"');
assert.equal(formulaAt("Checks", "B11").result, "Educational sample / source review required");

for (const worksheet of workbook.worksheets) {
  assert.ok(worksheet.views.some((view) => view.state === "frozen" && (view.ySplit ?? 0) >= 1), `${worksheet.name} must freeze its header rows`);
  assert.ok(worksheet.pageSetup.printArea, `${worksheet.name} must define a print area`);
  assert.equal(worksheet.pageSetup.fitToWidth, 1, `${worksheet.name} must fit to one page wide`);
  for (let column = 1; column <= worksheet.columnCount; column += 1) {
    const width = worksheet.getColumn(column).width;
    assert.equal(typeof width, "number", `${worksheet.name} column ${column} must have an explicit width`);
    assert.ok(width! >= 8 && width! <= 32, `${worksheet.name} column ${column} width must be bounded`);
  }
}

const zip = await JSZip.loadAsync(await readFile(workbookPath));
assert.ok(zip.file("xl/workbook.xml"));
const workbookXml = await zip.file("xl/workbook.xml")!.async("string");
assert.match(workbookXml, /<calcPr[^>]*fullCalcOnLoad="1"/u, "workbook must request a full recalculation when opened");
const archiveNames = Object.keys(zip.files);
assert.ok(!archiveNames.some((name) => name.includes("externalLinks")), "workbook must not contain externalLinks parts");
for (const name of archiveNames.filter((entry) => entry.endsWith(".rels"))) {
  const xml = await zip.file(name)!.async("string");
  assert.doesNotMatch(xml, /TargetMode=["']External["']/i, `${name} must not contain external relationships`);
}

console.log(`DCF workbook validation passed (${workbook.worksheets.length} sheets)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
