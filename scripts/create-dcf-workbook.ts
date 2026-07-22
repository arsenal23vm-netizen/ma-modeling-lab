import { writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { buildSensitivityMatrix, calculateDcf, calculateEquityBridge, calculateFcff, calculateWacc, dcfCase } from "../src/data/dcf-series";

const defaultOutputPath = "public/downloads/06_DCF評価モデル.xlsx";
const fixedDocumentTimestamp = "2026-07-21T15:00:00Z";
const fixedZipDate = new Date("2000-01-01T00:00:00.000Z");
const colors = {
  navy: "FF102235",
  teal: "FF147D73",
  input: "FFE7F0FF",
  inputText: "FF1F4E78",
  formula: "FFF3F6F8",
  output: "FFE9F6EF",
  warning: "FFFFF4D6",
  line: "FFD8E0E5",
  white: "FFFFFFFF",
  muted: "FF607080",
};

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: colors.line } },
  left: { style: "thin", color: { argb: colors.line } },
  bottom: { style: "thin", color: { argb: colors.line } },
  right: { style: "thin", color: { argb: colors.line } },
};

function addSheet(workbook: ExcelJS.Workbook, name: string, subtitle: string, widths: number[], printArea: string, freezeRow = 4) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", xSplit: name === "表紙" ? 0 : 1, ySplit: freezeRow, topLeftCell: name === "表紙" ? "A3" : "B5", activeCell: "A1" }],
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      printArea,
      margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
  });
  widths.forEach((width, index) => { sheet.getColumn(index + 1).width = Math.max(8, Math.min(32, width)); });
  sheet.mergeCells(1, 1, 1, widths.length);
  sheet.getCell("A1").value = name === "表紙" ? "DCF Valuationモデル" : name;
  sheet.getCell("A1").font = { name: "Yu Gothic", size: 16, bold: true, color: { argb: colors.white } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.navy } };
  sheet.getCell("A1").alignment = { vertical: "middle" };
  sheet.getRow(1).height = 28;
  sheet.mergeCells(2, 1, 2, widths.length);
  sheet.getCell("A2").value = subtitle;
  sheet.getCell("A2").font = { name: "Yu Gothic", size: 10, italic: true, color: { argb: colors.teal } };
  sheet.getCell("A2").alignment = { vertical: "middle", wrapText: true };
  sheet.getRow(2).height = 30;
  return sheet;
}

function styleHeader(sheet: ExcelJS.Worksheet, rowNumber: number, startColumn: number, endColumn: number) {
  const row = sheet.getRow(rowNumber);
  row.height = 28;
  for (let column = startColumn; column <= endColumn; column += 1) {
    const cell = row.getCell(column);
    cell.font = { name: "Yu Gothic", size: 10, bold: true, color: { argb: colors.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.teal } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder;
  }
}

function styleRange(sheet: ExcelJS.Worksheet, range: string) {
  const [start, end] = range.split(":");
  const startCell = sheet.getCell(start);
  const endCell = sheet.getCell(end);
  for (let row = startCell.row; row <= endCell.row; row += 1) {
    for (let column = startCell.col; column <= endCell.col; column += 1) {
      const cell = sheet.getCell(row, column);
      cell.font = { name: "Yu Gothic", size: 10, color: { argb: colors.navy } };
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = thinBorder;
    }
  }
}

function styleInput(cell: ExcelJS.Cell, numberFormat?: string) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.input } };
  cell.font = { name: "Yu Gothic", size: 10, color: { argb: colors.inputText } };
  cell.border = thinBorder;
  if (numberFormat) cell.numFmt = numberFormat;
}

function setFormula(cell: ExcelJS.Cell, formula: string, result: ExcelJS.CellFormulaValue["result"], output = false) {
  cell.value = { formula, result };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: output ? colors.output : colors.formula } };
  cell.font = { name: "Yu Gothic", size: 10, bold: output, color: { argb: output ? colors.teal : colors.navy } };
  cell.border = thinBorder;
}

function percent(cell: ExcelJS.Cell) { cell.numFmt = "0.00%"; }
function amount(cell: ExcelJS.Cell) { cell.numFmt = "#,##0.0;[Red](#,##0.0);-"; }

function normalizeCoreProperties(xml: string) {
  return xml
    .replace(/(<dcterms:created[^>]*>)[^<]*(<\/dcterms:created>)/u, `$1${fixedDocumentTimestamp}$2`)
    .replace(/(<dcterms:modified[^>]*>)[^<]*(<\/dcterms:modified>)/u, `$1${fixedDocumentTimestamp}$2`);
}

async function normalizeXlsxArchive(rawBuffer: Buffer) {
  const sourceZip = await JSZip.loadAsync(rawBuffer);
  const normalizedZip = new JSZip();

  for (const name of Object.keys(sourceZip.files).sort()) {
    const sourceEntry = sourceZip.files[name];
    if (sourceEntry.dir) {
      normalizedZip.file(name, null, { createFolders: false, date: fixedZipDate, dir: true });
      continue;
    }

    const content = name === "docProps/core.xml"
      ? normalizeCoreProperties(await sourceEntry.async("string"))
      : await sourceEntry.async("uint8array");
    normalizedZip.file(name, content, {
      binary: typeof content !== "string",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
      createFolders: false,
      date: fixedZipDate,
    });
  }

  return normalizedZip.generateAsync({
    type: "nodebuffer",
    platform: "DOS",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
    streamFiles: false,
  });
}

export async function createDcfWorkbookBuffer() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Finance Modeling Lab 編集部";
  workbook.title = "DCF評価モデル（教育用サンプル）";
  workbook.subject = "FCFF、WACC、継続価値、Enterprise ValueからEquity Valueへの調整を学ぶ実務演習モデル";
  workbook.company = "Finance Modeling Lab";
  workbook.created = new Date(fixedDocumentTimestamp);
  workbook.modified = new Date(fixedDocumentTimestamp);
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [{ x: 0, y: 0, width: 16000, height: 9000, firstSheet: 0, activeTab: 0, visibility: "visible" }];

  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const wacc = calculateWacc(dcfCase.wacc);
  const fcff = dcfCase.forecasts.map(calculateFcff);
  const discountFactors = dcfCase.forecasts.map((_, index) => 1 / (1 + wacc) ** (index + 1));
  const pvFcff = fcff.map((value, index) => value * discountFactors[index]);

  const cover = addSheet(workbook, "表紙", "教育用サンプル｜共通DCFケース｜単位：百万円", [12, 25, 32, 16, 16, 16], "A1:F15", 2);
  cover.getCell("B4").value = "モデルの状態";
  cover.getCell("B5").value = "計算整合性";
  setFormula(cover.getCell("C5"), "チェック!B10", "適合", true);
  cover.getCell("B6").value = "意思決定への利用可否";
  setFormula(cover.getCell("C6"), "チェック!B11", "教育用サンプル・出所確認が必要");
  cover.getCell("B8").value = "Valuationの基準";
  cover.getCell("C8").value = "各予測年度末を基準とする期末割引（1～5期間）";
  cover.getCell("B10").value = "利用上の注意";
  cover.getCell("C10").value = "入力値は教育用の仮定であり、市場データではありません。実案件で利用する前に出所、基準日、前提条件を確認してください。";
  styleRange(cover, "B4:C10");
  cover.getCell("B4").font = { name: "Yu Gothic", bold: true, color: { argb: colors.white } };
  cover.getCell("B4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.teal } };
  cover.getCell("C5").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.output } };
  cover.getCell("C5").font = { name: "Yu Gothic", bold: true, color: { argb: colors.teal } };
  cover.getCell("C6").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.warning } };
  cover.getRow(10).height = 48;

  const inputs = addSheet(workbook, "入力", "青字セルが手入力欄です。事業計画、WACC、永久成長率、ネット有利子負債調整を入力します。", [24, 14, 14, 14, 14, 14], "A1:F25");
  inputs.getCell("A4").value = "事業計画";
  dcfCase.forecasts.forEach((forecast, index) => { inputs.getCell(4, index + 2).value = forecast.year; });
  styleHeader(inputs, 4, 1, 6);
  const forecastRows = [
    ["売上高", (row: typeof dcfCase.forecasts[number]) => row.revenue, "#,##0.0"],
    ["EBIT", (row: typeof dcfCase.forecasts[number]) => row.ebit, "#,##0.0"],
    ["税率", (row: typeof dcfCase.forecasts[number]) => row.taxRate, "0.0%"],
    ["減価償却費", (row: typeof dcfCase.forecasts[number]) => row.depreciation, "#,##0.0"],
    ["設備投資", (row: typeof dcfCase.forecasts[number]) => row.capex, "#,##0.0"],
    ["運転資本増加", (row: typeof dcfCase.forecasts[number]) => row.increaseInNwc, "#,##0.0"],
  ] as const;
  forecastRows.forEach(([label, getter, format], rowIndex) => {
    inputs.getCell(5 + rowIndex, 1).value = label;
    dcfCase.forecasts.forEach((forecast, columnIndex) => {
      const cell = inputs.getCell(5 + rowIndex, 2 + columnIndex);
      cell.value = getter(forecast);
      styleInput(cell, format);
    });
  });
  styleRange(inputs, "A5:F10");
  forecastRows.forEach(([, , format], rowIndex) => dcfCase.forecasts.forEach((_, columnIndex) => styleInput(inputs.getCell(5 + rowIndex, 2 + columnIndex), format)));
  inputs.getCell("A13").value = "Valuation・株主価値調整の入力";
  inputs.getCell("B13").value = "入力値";
  styleHeader(inputs, 13, 1, 2);
  const scalarRows: Array<[string, number, string]> = [
    ["リスクフリーレート", dcfCase.wacc.riskFreeRate, "0.00%"],
    ["株式リスクプレミアム", dcfCase.wacc.equityRiskPremium, "0.00%"],
    ["ベータ", dcfCase.wacc.beta, "0.00x"],
    ["税引前負債コスト", dcfCase.wacc.preTaxCostOfDebt, "0.00%"],
    ["税率", dcfCase.wacc.taxRate, "0.0%"],
    ["株主資本構成比", dcfCase.wacc.equityWeight, "0.0%"],
    ["有利子負債構成比", dcfCase.wacc.debtWeight, "0.0%"],
    ["永久成長率", dcfCase.terminalGrowthRate, "0.0%"],
    ["現金及び現金同等物", dcfCase.bridge.cash, "#,##0.0"],
    ["有利子負債", dcfCase.bridge.debt, "#,##0.0"],
    ["有利子負債類似項目", dcfCase.bridge.debtLikeItems, "#,##0.0"],
    ["非支配持分", dcfCase.bridge.nonControllingInterests, "#,##0.0"],
  ];
  scalarRows.forEach(([label, value, format], index) => {
    inputs.getCell(14 + index, 1).value = label;
    const cell = inputs.getCell(14 + index, 2);
    cell.value = value;
    styleInput(cell, format);
  });
  styleRange(inputs, "A14:B25");
  scalarRows.forEach(([, , format], index) => styleInput(inputs.getCell(14 + index, 2), format));

  const assumptions = addSheet(workbook, "前提", "WACCとValuationの基準を数式で集約します。WACCが永久成長率を上回ることを確認します。", [28, 18, 32], "A1:C12");
  assumptions.getCell("A4").value = "前提・計算項目";
  assumptions.getCell("B4").value = "計算値";
  assumptions.getCell("C4").value = "定義・確認事項";
  styleHeader(assumptions, 4, 1, 3);
  assumptions.getCell("A5").value = "Valuationの基準";
  assumptions.getCell("B5").value = "期末割引";
  assumptions.getCell("C5").value = "各予測年度末を基準とする1～5期間";
  assumptions.getCell("A8").value = "株主資本コスト";
  setFormula(assumptions.getCell("B8"), "入力!B14+入力!B16*入力!B15", dcfCase.wacc.riskFreeRate + dcfCase.wacc.beta * dcfCase.wacc.equityRiskPremium);
  assumptions.getCell("C8").value = "リスクフリーレート + ベータ × 株式リスクプレミアム";
  assumptions.getCell("A9").value = "税引後負債コスト";
  setFormula(assumptions.getCell("B9"), "入力!B17*(1-入力!B18)", dcfCase.wacc.preTaxCostOfDebt * (1 - dcfCase.wacc.taxRate));
  assumptions.getCell("C9").value = "税引前負債コスト ×（1 − 税率）";
  assumptions.getCell("A10").value = "資本構成比合計";
  setFormula(assumptions.getCell("B10"), "入力!B19+入力!B20", dcfCase.wacc.equityWeight + dcfCase.wacc.debtWeight);
  assumptions.getCell("C10").value = "100.0%となること";
  assumptions.getCell("A11").value = "WACC";
  setFormula(assumptions.getCell("B11"), "入力!B19*B8+入力!B20*B9", wacc, true);
  assumptions.getCell("C11").value = "株主資本構成比 × 株主資本コスト + 有利子負債構成比 × 税引後負債コスト";
  assumptions.getCell("A12").value = "永久成長率";
  setFormula(assumptions.getCell("B12"), "入力!B21", dcfCase.terminalGrowthRate);
  assumptions.getCell("C12").value = "WACCが永久成長率を上回ること";
  styleRange(assumptions, "A5:C12");
  for (const address of ["B8", "B9", "B10", "B11", "B12"]) percent(assumptions.getCell(address));

  const pl = addSheet(workbook, "PL", "入力シートに連動する予測損益計算書です。単位：百万円。", [24, 14, 14, 14, 14, 14], "A1:F9");
  pl.getCell("A4").value = "項目";
  dcfCase.forecasts.forEach((forecast, index) => { pl.getCell(4, index + 2).value = forecast.year; });
  styleHeader(pl, 4, 1, 6);
  ["売上高", "EBIT", "税率", "営業利益に係る税金", "税引後営業利益"].forEach((label, index) => { pl.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(pl.getCell(`${column}5`), `入力!${column}5`, forecast.revenue);
    setFormula(pl.getCell(`${column}6`), `入力!${column}6`, forecast.ebit);
    setFormula(pl.getCell(`${column}7`), `入力!${column}7`, forecast.taxRate);
    setFormula(pl.getCell(`${column}8`), `-${column}6*${column}7`, -forecast.ebit * forecast.taxRate);
    setFormula(pl.getCell(`${column}9`), `${column}6+${column}8`, forecast.ebit * (1 - forecast.taxRate));
    [5, 6, 8, 9].forEach((row) => amount(pl.getCell(`${column}${row}`)));
    percent(pl.getCell(`${column}7`));
  });
  styleRange(pl, "A5:F9");

  const bs = addSheet(workbook, "BS", "評価基準日の株主価値調整項目と予測運転資本増加を整理します。単位：百万円。", [28, 18, 18, 18, 18, 18], "A1:F15");
  bs.getCell("A4").value = "評価基準日の調整項目";
  bs.getCell("B4").value = "金額";
  bs.getCell("C4").value = "調整方法";
  styleHeader(bs, 4, 1, 3);
  const bridgeRows: Array<[string, string, number, string]> = [
    ["現金及び現金同等物", "入力!B22", dcfCase.bridge.cash, "Enterprise Valueに加算"],
    ["有利子負債", "入力!B23", dcfCase.bridge.debt, "Enterprise Valueから控除"],
    ["有利子負債類似項目", "入力!B24", dcfCase.bridge.debtLikeItems, "Enterprise Valueから控除"],
    ["非支配持分", "入力!B25", dcfCase.bridge.nonControllingInterests, "Enterprise Valueから控除"],
  ];
  bridgeRows.forEach(([label, formula, result, treatment], index) => {
    bs.getCell(5 + index, 1).value = label;
    setFormula(bs.getCell(5 + index, 2), formula, result);
    amount(bs.getCell(5 + index, 2));
    bs.getCell(5 + index, 3).value = treatment;
  });
  bs.getCell("A11").value = "運転資本増加";
  dcfCase.forecasts.forEach((forecast, index) => {
    bs.getCell(11, index + 2).value = forecast.year;
    setFormula(bs.getCell(12, index + 2), `入力!${String.fromCharCode(66 + index)}10`, forecast.increaseInNwc);
    amount(bs.getCell(12, index + 2));
  });
  styleHeader(bs, 11, 1, 6);
  styleRange(bs, "A5:C8");
  styleRange(bs, "A12:F12");

  const cf = addSheet(workbook, "CF", "FCFF（企業向けフリーキャッシュフロー）を税引後営業利益、減価償却費、設備投資、運転資本増加から計算します。単位：百万円。", [24, 14, 14, 14, 14, 14], "A1:F11");
  cf.getCell("A4").value = "項目";
  dcfCase.forecasts.forEach((forecast, index) => { cf.getCell(4, index + 2).value = forecast.year; });
  styleHeader(cf, 4, 1, 6);
  ["EBIT", "税率", "税引後営業利益", "減価償却費", "設備投資", "運転資本増加", "FCFF"].forEach((label, index) => { cf.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(cf.getCell(`${column}5`), `PL!${column}6`, forecast.ebit);
    setFormula(cf.getCell(`${column}6`), `入力!${column}7`, forecast.taxRate);
    setFormula(cf.getCell(`${column}7`), `${column}5*(1-${column}6)`, forecast.ebit * (1 - forecast.taxRate));
    setFormula(cf.getCell(`${column}8`), `入力!${column}8`, forecast.depreciation);
    setFormula(cf.getCell(`${column}9`), `入力!${column}9`, forecast.capex);
    setFormula(cf.getCell(`${column}10`), `入力!${column}10`, forecast.increaseInNwc);
    setFormula(cf.getCell(`${column}11`), `${column}5*(1-${column}6)+${column}8-${column}9-${column}10`, fcff[index], true);
    [5, 7, 8, 9, 10, 11].forEach((row) => amount(cf.getCell(`${column}${row}`)));
    percent(cf.getCell(`${column}6`));
  });
  styleRange(cf, "A5:F11");

  const schedules = addSheet(workbook, "計算明細", "設備投資、運転資本、割引係数の計算明細です。記載がない限り単位：百万円。", [24, 14, 14, 14, 14, 14], "A1:F10");
  schedules.getCell("A4").value = "計算項目";
  dcfCase.forecasts.forEach((forecast, index) => { schedules.getCell(4, index + 2).value = forecast.year; });
  styleHeader(schedules, 4, 1, 6);
  ["減価償却費", "設備投資", "運転資本増加", "", "割引期間", "割引係数"].forEach((label, index) => { schedules.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(schedules.getCell(`${column}5`), `入力!${column}8`, forecast.depreciation);
    setFormula(schedules.getCell(`${column}6`), `入力!${column}9`, forecast.capex);
    setFormula(schedules.getCell(`${column}7`), `入力!${column}10`, forecast.increaseInNwc);
    schedules.getCell(`${column}9`).value = index + 1;
    setFormula(schedules.getCell(`${column}10`), `1/(1+前提!$B$11)^${column}9`, discountFactors[index]);
    [5, 6, 7].forEach((row) => amount(schedules.getCell(`${column}${row}`)));
    schedules.getCell(`${column}10`).numFmt = "0.0000x";
  });
  styleRange(schedules, "A5:F10");

  const dcf = addSheet(workbook, "DCF", "期末割引によるValuation、Enterprise ValueからEquity Valueへの調整、WACC・永久成長率の感応度分析です。単位：百万円。", [28, 16, 16, 16, 16, 16, 16], "A1:G30");
  dcf.getCell("A4").value = "Valuation";
  dcfCase.forecasts.forEach((forecast, index) => { dcf.getCell(4, index + 2).value = forecast.year; });
  styleHeader(dcf, 4, 1, 6);
  dcf.getCell("A5").value = "FCFF";
  dcf.getCell("A6").value = "割引係数";
  dcf.getCell("A7").value = "FCFFの現在価値";
  dcfCase.forecasts.forEach((_, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(dcf.getCell(`${column}5`), `CF!${column}11`, fcff[index]);
    setFormula(dcf.getCell(`${column}6`), `計算明細!${column}10`, discountFactors[index]);
    setFormula(dcf.getCell(`${column}7`), `${column}5*${column}6`, pvFcff[index]);
    amount(dcf.getCell(`${column}5`));
    dcf.getCell(`${column}6`).numFmt = "0.0000x";
    amount(dcf.getCell(`${column}7`));
  });
  const valuationRows: Array<[number, string, string, number, boolean]> = [
    [10, "明示予測期間のFCFF現在価値", "SUM(B7:F7)", valuation.pvExplicitFcff, false],
    [11, "FCFF (n+1)", "F5*(1+前提!$B$12)", fcff[4] * (1 + dcfCase.terminalGrowthRate), false],
    [12, "継続価値", "IF(前提!$B$11<=前提!$B$12,NA(),B11/(前提!$B$11-前提!$B$12))", valuation.terminalValue, false],
    [13, "継続価値の現在価値", "B12*F6", valuation.pvTerminalValue, false],
    [14, "Enterprise Value", "B10+B13", valuation.enterpriseValue, true],
    [16, "現金及び現金同等物", "入力!B22", dcfCase.bridge.cash, false],
    [17, "有利子負債", "入力!B23", dcfCase.bridge.debt, false],
    [18, "有利子負債類似項目", "入力!B24", dcfCase.bridge.debtLikeItems, false],
    [19, "非支配持分", "入力!B25", dcfCase.bridge.nonControllingInterests, false],
    [20, "Equity Value", "B14+B16-B17-B18-B19", bridge.equityValue, true],
  ];
  valuationRows.forEach(([row, label, formula, result, output]) => {
    dcf.getCell(row, 1).value = label;
    setFormula(dcf.getCell(row, 2), formula, result, output);
    amount(dcf.getCell(row, 2));
  });
  dcf.getCell("A24").value = "Enterprise Value 感応度分析";
  dcf.getCell("B25").value = "WACC / g";
  dcfCase.sensitivity.terminalGrowthRates.forEach((growth, index) => {
    dcf.getCell(25, index + 3).value = growth;
    percent(dcf.getCell(25, index + 3));
  });
  dcfCase.sensitivity.waccRates.forEach((rate, index) => {
    dcf.getCell(26 + index, 2).value = rate;
    percent(dcf.getCell(26 + index, 2));
  });
  styleHeader(dcf, 25, 2, 7);
  dcf.getCell("B25").value = "WACC / g";
  const sensitivity = buildSensitivityMatrix(dcfCase);
  for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < 5; columnIndex += 1) {
      const row = 26 + rowIndex;
      const column = String.fromCharCode(67 + columnIndex);
      const formula = `IF($B${row}<=${column}$25,NA(),$B$5/(1+$B${row})^1+$C$5/(1+$B${row})^2+$D$5/(1+$B${row})^3+$E$5/(1+$B${row})^4+$F$5/(1+$B${row})^5+($F$5*(1+${column}$25)/($B${row}-${column}$25))/(1+$B${row})^5)`;
      setFormula(dcf.getCell(`${column}${row}`), formula, sensitivity[rowIndex].cells[columnIndex].enterpriseValue!);
      amount(dcf.getCell(`${column}${row}`));
    }
  }
  styleRange(dcf, "A5:F7");
  styleRange(dcf, "A10:B20");
  styleRange(dcf, "B26:G30");
  valuationRows.forEach(([row, , , , output]) => setFormula(dcf.getCell(row, 2), (dcf.getCell(row, 2).value as ExcelJS.CellFormulaValue).formula, (dcf.getCell(row, 2).value as ExcelJS.CellFormulaValue).result, output));
  valuationRows.forEach(([row]) => amount(dcf.getCell(row, 2)));
  for (let row = 26; row <= 30; row += 1) for (let column = 3; column <= 7; column += 1) amount(dcf.getCell(row, column));

  const checks = addSheet(workbook, "チェック", "数式で計算整合性を確認します。計算が合うことと、意思決定に使えることは別に判定します。", [30, 24, 20, 32], "A1:D11");
  checks.getCell("A4").value = "チェック項目";
  checks.getCell("B4").value = "計算結果";
  checks.getCell("C4").value = "判定";
  checks.getCell("D4").value = "確認目的";
  styleHeader(checks, 4, 1, 4);
  const checkRows: Array<[number, string, string, ExcelJS.CellFormulaValue["result"], string, string, string]> = [
    [5, "資本構成比合計", "入力!B19+入力!B20", 1, 'IF(ABS(B5-1)<0.000001,"適合","要確認")', "適合", "株主資本と有利子負債の構成比が100%となること。"],
    [6, "WACCと永久成長率", "前提!B11>前提!B12", true, 'IF(B6,"適合","要確認")', "適合", "継続価値の分母が正となること。"],
    [7, "株主価値への調整", "DCF!B20-(DCF!B14+DCF!B16-DCF!B17-DCF!B18-DCF!B19)", 0, 'IF(ABS(B7)<0.000001,"適合","要確認")', "適合", "Equity ValueがEnterprise Valueからの調整に一致すること。"],
    [8, "数式エラー件数", "SUMPRODUCT(--ISERROR(前提!B8:B12))+SUMPRODUCT(--ISERROR(PL!B5:F9))+SUMPRODUCT(--ISERROR(BS!B5:F12))+SUMPRODUCT(--ISERROR(CF!B5:F11))+SUMPRODUCT(--ISERROR(計算明細!B5:F10))+SUMPRODUCT(--ISERROR(DCF!B5:G30))", 0, 'IF(B8=0,"適合","要確認")', "適合", "主要計算範囲に数式エラーがないこと。"],
  ];
  checkRows.forEach(([row, label, resultFormula, result, statusFormula, status, purpose]) => {
    checks.getCell(row, 1).value = label;
    setFormula(checks.getCell(row, 2), resultFormula, result);
    setFormula(checks.getCell(row, 3), statusFormula, status, true);
    checks.getCell(row, 4).value = purpose;
  });
  checks.getCell("A10").value = "計算整合性";
  setFormula(checks.getCell("B10"), 'IF(COUNTIF(C5:C8,"<>適合")=0,"適合","要確認")', "適合", true);
  checks.getCell("A11").value = "意思決定への利用可否";
  setFormula(checks.getCell("B11"), '"教育用サンプル・出所確認が必要"', "教育用サンプル・出所確認が必要");
  styleRange(checks, "A5:D11");
  checkRows.forEach(([row, , resultFormula, result, statusFormula, status]) => {
    setFormula(checks.getCell(row, 2), resultFormula, result);
    setFormula(checks.getCell(row, 3), statusFormula, status, true);
  });
  setFormula(checks.getCell("B10"), 'IF(COUNTIF(C5:C8,"<>適合")=0,"適合","要確認")', "適合", true);
  setFormula(checks.getCell("B11"), '"教育用サンプル・出所確認が必要"', "教育用サンプル・出所確認が必要");
  percent(checks.getCell("B5"));
  checks.getCell("B7").numFmt = "0.0000";
  checks.getCell("B8").numFmt = "0";

  const rawBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
  return normalizeXlsxArchive(rawBuffer);
}

export async function generateDcfWorkbook(outputPath = defaultOutputPath) {
  const buffer = await createDcfWorkbookBuffer();
  await writeFile(outputPath, buffer);
  console.log(`${outputPath}を生成しました（9シート）`);
}

if (require.main === module) {
  generateDcfWorkbook(process.argv[2]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
