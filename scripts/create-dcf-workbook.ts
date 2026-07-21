import ExcelJS from "exceljs";
import { buildSensitivityMatrix, calculateDcf, calculateEquityBridge, calculateFcff, calculateWacc, dcfCase } from "../src/data/dcf-series";

const outputPath = "public/downloads/06_DCF評価モデル.xlsx";
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
    views: [{ state: "frozen", xSplit: name === "Cover" ? 0 : 1, ySplit: freezeRow, topLeftCell: name === "Cover" ? "A3" : "B5", activeCell: "A1" }],
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
  sheet.getCell("A1").value = name === "Cover" ? "DCF Valuation Model" : name;
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

async function main() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Finance Modeling Lab 編集部";
  workbook.title = "DCF評価モデル（教育用サンプル）";
  workbook.subject = "FCFF, WACC, Terminal Value and EV-to-Equity educational model";
  workbook.company = "Finance Modeling Lab";
  workbook.created = new Date("2026-07-21T00:00:00+09:00");
  workbook.modified = new Date("2026-07-21T00:00:00+09:00");
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [{ x: 0, y: 0, width: 16000, height: 9000, firstSheet: 0, activeTab: 0, visibility: "visible" }];

  const valuation = calculateDcf(dcfCase);
  const bridge = calculateEquityBridge(valuation.enterpriseValue, dcfCase.bridge);
  const wacc = calculateWacc(dcfCase.wacc);
  const fcff = dcfCase.forecasts.map(calculateFcff);
  const discountFactors = dcfCase.forecasts.map((_, index) => 1 / (1 + wacc) ** (index + 1));
  const pvFcff = fcff.map((value, index) => value * discountFactors[index]);

  const cover = addSheet(workbook, "Cover", "Educational sample | Shared DCF case | Unit: JPY million", [12, 25, 32, 16, 16, 16], "A1:F15", 2);
  cover.getCell("B4").value = "Model status";
  cover.getCell("B5").value = "Calculation integrity";
  setFormula(cover.getCell("C5"), "Checks!B10", "OK", true);
  cover.getCell("B6").value = "Decision readiness";
  setFormula(cover.getCell("C6"), "Checks!B11", "Educational sample / source review required");
  cover.getCell("B8").value = "Valuation convention";
  cover.getCell("C8").value = "Period-end convention: each forecast year-end / 1–5 periods";
  cover.getCell("B10").value = "Use caution";
  cover.getCell("C10").value = "Inputs are an educational case, not live market data. Review sources and assumptions before any real transaction use.";
  styleRange(cover, "B4:C10");
  cover.getCell("B4").font = { name: "Yu Gothic", bold: true, color: { argb: colors.white } };
  cover.getCell("B4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.teal } };
  cover.getCell("C5").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.output } };
  cover.getCell("C5").font = { name: "Yu Gothic", bold: true, color: { argb: colors.teal } };
  cover.getCell("C6").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.warning } };
  cover.getRow(10).height = 48;

  const inputs = addSheet(workbook, "Inputs", "Blue cells are editable. Forecasts and valuation inputs come from the shared DCF educational case.", [24, 14, 14, 14, 14, 14], "A1:F25");
  inputs.getCell("A4").value = "Operating forecast";
  dcfCase.forecasts.forEach((forecast, index) => { inputs.getCell(4, index + 2).value = forecast.year; });
  styleHeader(inputs, 4, 1, 6);
  const forecastRows = [
    ["Revenue", (row: typeof dcfCase.forecasts[number]) => row.revenue, "#,##0.0"],
    ["EBIT", (row: typeof dcfCase.forecasts[number]) => row.ebit, "#,##0.0"],
    ["Tax Rate", (row: typeof dcfCase.forecasts[number]) => row.taxRate, "0.0%"],
    ["D&A", (row: typeof dcfCase.forecasts[number]) => row.depreciation, "#,##0.0"],
    ["Capex", (row: typeof dcfCase.forecasts[number]) => row.capex, "#,##0.0"],
    ["Increase in NWC", (row: typeof dcfCase.forecasts[number]) => row.increaseInNwc, "#,##0.0"],
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
  inputs.getCell("A13").value = "Valuation and bridge inputs";
  inputs.getCell("B13").value = "Value";
  styleHeader(inputs, 13, 1, 2);
  const scalarRows: Array<[string, number, string]> = [
    ["Risk-free Rate", dcfCase.wacc.riskFreeRate, "0.00%"],
    ["Equity Risk Premium", dcfCase.wacc.equityRiskPremium, "0.00%"],
    ["Beta", dcfCase.wacc.beta, "0.00x"],
    ["Pre-tax Cost of Debt", dcfCase.wacc.preTaxCostOfDebt, "0.00%"],
    ["Tax Rate", dcfCase.wacc.taxRate, "0.0%"],
    ["Equity Weight", dcfCase.wacc.equityWeight, "0.0%"],
    ["Debt Weight", dcfCase.wacc.debtWeight, "0.0%"],
    ["Terminal Growth", dcfCase.terminalGrowthRate, "0.0%"],
    ["Cash", dcfCase.bridge.cash, "#,##0.0"],
    ["Debt", dcfCase.bridge.debt, "#,##0.0"],
    ["Debt-like Items", dcfCase.bridge.debtLikeItems, "#,##0.0"],
    ["Non-controlling Interests", dcfCase.bridge.nonControllingInterests, "#,##0.0"],
  ];
  scalarRows.forEach(([label, value, format], index) => {
    inputs.getCell(14 + index, 1).value = label;
    const cell = inputs.getCell(14 + index, 2);
    cell.value = value;
    styleInput(cell, format);
  });
  styleRange(inputs, "A14:B25");
  scalarRows.forEach(([, , format], index) => styleInput(inputs.getCell(14 + index, 2), format));

  const assumptions = addSheet(workbook, "Assumptions", "Formula-driven WACC and valuation convention. WACC must exceed terminal growth.", [28, 18, 32], "A1:C12");
  assumptions.getCell("A4").value = "Assumption / calculation";
  assumptions.getCell("B4").value = "Value";
  assumptions.getCell("C4").value = "Definition / review";
  styleHeader(assumptions, 4, 1, 3);
  assumptions.getCell("A5").value = "Valuation convention";
  assumptions.getCell("B5").value = "Period-end convention";
  assumptions.getCell("C5").value = "Each forecast year-end / 1–5 periods";
  assumptions.getCell("A8").value = "Cost of Equity";
  setFormula(assumptions.getCell("B8"), "Inputs!B14+Inputs!B16*Inputs!B15", dcfCase.wacc.riskFreeRate + dcfCase.wacc.beta * dcfCase.wacc.equityRiskPremium);
  assumptions.getCell("C8").value = "Risk-free Rate + Beta × Equity Risk Premium";
  assumptions.getCell("A9").value = "After-tax Cost of Debt";
  setFormula(assumptions.getCell("B9"), "Inputs!B17*(1-Inputs!B18)", dcfCase.wacc.preTaxCostOfDebt * (1 - dcfCase.wacc.taxRate));
  assumptions.getCell("C9").value = "Pre-tax Cost of Debt × (1 − Tax Rate)";
  assumptions.getCell("A10").value = "Capital Weights Sum";
  setFormula(assumptions.getCell("B10"), "Inputs!B19+Inputs!B20", dcfCase.wacc.equityWeight + dcfCase.wacc.debtWeight);
  assumptions.getCell("C10").value = "Must equal 100.0%";
  assumptions.getCell("A11").value = "WACC";
  setFormula(assumptions.getCell("B11"), "Inputs!B19*B8+Inputs!B20*B9", wacc, true);
  assumptions.getCell("C11").value = "Equity Weight × CoE + Debt Weight × After-tax CoD";
  assumptions.getCell("A12").value = "Terminal Growth";
  setFormula(assumptions.getCell("B12"), "Inputs!B21", dcfCase.terminalGrowthRate);
  assumptions.getCell("C12").value = "WACC > g required";
  styleRange(assumptions, "A5:C12");
  for (const address of ["B8", "B9", "B10", "B11", "B12"]) percent(assumptions.getCell(address));

  const pl = addSheet(workbook, "PL", "Forecast operating results linked to Inputs. Unit: JPY million.", [24, 14, 14, 14, 14, 14], "A1:F9");
  pl.getCell("A4").value = "Metric";
  dcfCase.forecasts.forEach((forecast, index) => { pl.getCell(4, index + 2).value = forecast.year; });
  styleHeader(pl, 4, 1, 6);
  ["Revenue", "EBIT", "Tax Rate", "Tax on EBIT", "NOPAT"].forEach((label, index) => { pl.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(pl.getCell(`${column}5`), `Inputs!${column}5`, forecast.revenue);
    setFormula(pl.getCell(`${column}6`), `Inputs!${column}6`, forecast.ebit);
    setFormula(pl.getCell(`${column}7`), `Inputs!${column}7`, forecast.taxRate);
    setFormula(pl.getCell(`${column}8`), `-${column}6*${column}7`, -forecast.ebit * forecast.taxRate);
    setFormula(pl.getCell(`${column}9`), `${column}6+${column}8`, forecast.ebit * (1 - forecast.taxRate));
    [5, 6, 8, 9].forEach((row) => amount(pl.getCell(`${column}${row}`)));
    percent(pl.getCell(`${column}7`));
  });
  styleRange(pl, "A5:F9");

  const bs = addSheet(workbook, "BS", "Valuation-date balance sheet references and forecast working-capital movement. Unit: JPY million.", [28, 18, 18, 18, 18, 18], "A1:F15");
  bs.getCell("A4").value = "Valuation-date bridge item";
  bs.getCell("B4").value = "Amount";
  bs.getCell("C4").value = "Treatment";
  styleHeader(bs, 4, 1, 3);
  const bridgeRows: Array<[string, string, number, string]> = [
    ["Cash", "Inputs!B22", dcfCase.bridge.cash, "Add to EV"],
    ["Debt", "Inputs!B23", dcfCase.bridge.debt, "Deduct from EV"],
    ["Debt-like Items", "Inputs!B24", dcfCase.bridge.debtLikeItems, "Deduct from EV"],
    ["Non-controlling Interests", "Inputs!B25", dcfCase.bridge.nonControllingInterests, "Deduct from EV"],
  ];
  bridgeRows.forEach(([label, formula, result, treatment], index) => {
    bs.getCell(5 + index, 1).value = label;
    setFormula(bs.getCell(5 + index, 2), formula, result);
    amount(bs.getCell(5 + index, 2));
    bs.getCell(5 + index, 3).value = treatment;
  });
  bs.getCell("A11").value = "Increase in NWC";
  dcfCase.forecasts.forEach((forecast, index) => {
    bs.getCell(11, index + 2).value = forecast.year;
    setFormula(bs.getCell(12, index + 2), `Inputs!${String.fromCharCode(66 + index)}10`, forecast.increaseInNwc);
    amount(bs.getCell(12, index + 2));
  });
  styleHeader(bs, 11, 1, 6);
  styleRange(bs, "A5:C8");
  styleRange(bs, "A12:F12");

  const cf = addSheet(workbook, "CF", "FCFF is calculated from EBIT after tax, D&A, Capex and Increase in NWC. Unit: JPY million.", [24, 14, 14, 14, 14, 14], "A1:F11");
  cf.getCell("A4").value = "Metric";
  dcfCase.forecasts.forEach((forecast, index) => { cf.getCell(4, index + 2).value = forecast.year; });
  styleHeader(cf, 4, 1, 6);
  ["EBIT", "Tax Rate", "NOPAT", "D&A", "Capex", "Increase in NWC", "FCFF"].forEach((label, index) => { cf.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(cf.getCell(`${column}5`), `PL!${column}6`, forecast.ebit);
    setFormula(cf.getCell(`${column}6`), `Inputs!${column}7`, forecast.taxRate);
    setFormula(cf.getCell(`${column}7`), `${column}5*(1-${column}6)`, forecast.ebit * (1 - forecast.taxRate));
    setFormula(cf.getCell(`${column}8`), `Inputs!${column}8`, forecast.depreciation);
    setFormula(cf.getCell(`${column}9`), `Inputs!${column}9`, forecast.capex);
    setFormula(cf.getCell(`${column}10`), `Inputs!${column}10`, forecast.increaseInNwc);
    setFormula(cf.getCell(`${column}11`), `${column}5*(1-${column}6)+${column}8-${column}9-${column}10`, fcff[index], true);
    [5, 7, 8, 9, 10, 11].forEach((row) => amount(cf.getCell(`${column}${row}`)));
    percent(cf.getCell(`${column}6`));
  });
  styleRange(cf, "A5:F11");

  const schedules = addSheet(workbook, "Schedules", "Operating schedules and period-end discount factors. Unit: JPY million unless stated.", [24, 14, 14, 14, 14, 14], "A1:F10");
  schedules.getCell("A4").value = "Schedule";
  dcfCase.forecasts.forEach((forecast, index) => { schedules.getCell(4, index + 2).value = forecast.year; });
  styleHeader(schedules, 4, 1, 6);
  ["D&A", "Capex", "Increase in NWC", "", "Discount Period", "Discount Factor"].forEach((label, index) => { schedules.getCell(5 + index, 1).value = label; });
  dcfCase.forecasts.forEach((forecast, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(schedules.getCell(`${column}5`), `Inputs!${column}8`, forecast.depreciation);
    setFormula(schedules.getCell(`${column}6`), `Inputs!${column}9`, forecast.capex);
    setFormula(schedules.getCell(`${column}7`), `Inputs!${column}10`, forecast.increaseInNwc);
    schedules.getCell(`${column}9`).value = index + 1;
    setFormula(schedules.getCell(`${column}10`), `1/(1+Assumptions!$B$11)^${column}9`, discountFactors[index]);
    [5, 6, 7].forEach((row) => amount(schedules.getCell(`${column}${row}`)));
    schedules.getCell(`${column}10`).numFmt = "0.0000x";
  });
  styleRange(schedules, "A5:F10");

  const dcf = addSheet(workbook, "DCF", "Period-end DCF valuation, EV-to-Equity bridge and 5×5 WACC–growth sensitivity. Unit: JPY million.", [28, 16, 16, 16, 16, 16, 16], "A1:G30");
  dcf.getCell("A4").value = "Valuation";
  dcfCase.forecasts.forEach((forecast, index) => { dcf.getCell(4, index + 2).value = forecast.year; });
  styleHeader(dcf, 4, 1, 6);
  dcf.getCell("A5").value = "FCFF";
  dcf.getCell("A6").value = "Discount Factor";
  dcf.getCell("A7").value = "PV of FCFF";
  dcfCase.forecasts.forEach((_, index) => {
    const column = String.fromCharCode(66 + index);
    setFormula(dcf.getCell(`${column}5`), `CF!${column}11`, fcff[index]);
    setFormula(dcf.getCell(`${column}6`), `Schedules!${column}10`, discountFactors[index]);
    setFormula(dcf.getCell(`${column}7`), `${column}5*${column}6`, pvFcff[index]);
    amount(dcf.getCell(`${column}5`));
    dcf.getCell(`${column}6`).numFmt = "0.0000x";
    amount(dcf.getCell(`${column}7`));
  });
  const valuationRows: Array<[number, string, string, number, boolean]> = [
    [10, "PV of Explicit FCFF", "SUM(B7:F7)", valuation.pvExplicitFcff, false],
    [11, "FCFF (n+1)", "F5*(1+Assumptions!$B$12)", fcff[4] * (1 + dcfCase.terminalGrowthRate), false],
    [12, "Terminal Value", "IF(Assumptions!$B$11<=Assumptions!$B$12,NA(),B11/(Assumptions!$B$11-Assumptions!$B$12))", valuation.terminalValue, false],
    [13, "PV of Terminal Value", "B12*F6", valuation.pvTerminalValue, false],
    [14, "Enterprise Value", "B10+B13", valuation.enterpriseValue, true],
    [16, "Cash", "Inputs!B22", dcfCase.bridge.cash, false],
    [17, "Debt", "Inputs!B23", dcfCase.bridge.debt, false],
    [18, "Debt-like Items", "Inputs!B24", dcfCase.bridge.debtLikeItems, false],
    [19, "Non-controlling Interests", "Inputs!B25", dcfCase.bridge.nonControllingInterests, false],
    [20, "Equity Value", "B14+B16-B17-B18-B19", bridge.equityValue, true],
  ];
  valuationRows.forEach(([row, label, formula, result, output]) => {
    dcf.getCell(row, 1).value = label;
    setFormula(dcf.getCell(row, 2), formula, result, output);
    amount(dcf.getCell(row, 2));
  });
  dcf.getCell("A24").value = "Enterprise Value Sensitivity";
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

  const checks = addSheet(workbook, "Checks", "Formula-driven model checks. Calculation integrity is distinct from decision readiness.", [30, 24, 20, 32], "A1:D11");
  checks.getCell("A4").value = "Check";
  checks.getCell("B4").value = "Formula result";
  checks.getCell("C4").value = "Status";
  checks.getCell("D4").value = "Purpose";
  styleHeader(checks, 4, 1, 4);
  const checkRows: Array<[number, string, string, ExcelJS.CellFormulaValue["result"], string, string, string]> = [
    [5, "Capital weights sum", "Inputs!B19+Inputs!B20", 1, 'IF(ABS(B5-1)<0.000001,"OK","ERROR")', "OK", "Equity and debt weights must total 100%."],
    [6, "WACC > Terminal Growth", "Assumptions!B11>Assumptions!B12", true, 'IF(B6,"OK","ERROR")', "OK", "Gordon Growth denominator must remain positive."],
    [7, "EV bridge", "DCF!B20-(DCF!B14+DCF!B16-DCF!B17-DCF!B18-DCF!B19)", 0, 'IF(ABS(B7)<0.000001,"OK","ERROR")', "OK", "Equity Value must reconcile to Enterprise Value adjustments."],
    [8, "Formula-error count", "SUMPRODUCT(--ISERROR(Assumptions!B8:B12))+SUMPRODUCT(--ISERROR(PL!B5:F9))+SUMPRODUCT(--ISERROR(BS!B5:F12))+SUMPRODUCT(--ISERROR(CF!B5:F11))+SUMPRODUCT(--ISERROR(Schedules!B5:F10))+SUMPRODUCT(--ISERROR(DCF!B5:G30))", 0, 'IF(B8=0,"OK","ERROR")', "OK", "Counts formula errors in core calculation ranges."],
  ];
  checkRows.forEach(([row, label, resultFormula, result, statusFormula, status, purpose]) => {
    checks.getCell(row, 1).value = label;
    setFormula(checks.getCell(row, 2), resultFormula, result);
    setFormula(checks.getCell(row, 3), statusFormula, status, true);
    checks.getCell(row, 4).value = purpose;
  });
  checks.getCell("A10").value = "Calculation integrity";
  setFormula(checks.getCell("B10"), 'IF(COUNTIF(C5:C8,"<>OK")=0,"OK","ERROR")', "OK", true);
  checks.getCell("A11").value = "Decision readiness";
  setFormula(checks.getCell("B11"), '"Educational sample / source review required"', "Educational sample / source review required");
  styleRange(checks, "A5:D11");
  checkRows.forEach(([row, , resultFormula, result, statusFormula, status]) => {
    setFormula(checks.getCell(row, 2), resultFormula, result);
    setFormula(checks.getCell(row, 3), statusFormula, status, true);
  });
  setFormula(checks.getCell("B10"), 'IF(COUNTIF(C5:C8,"<>OK")=0,"OK","ERROR")', "OK", true);
  setFormula(checks.getCell("B11"), '"Educational sample / source review required"', "Educational sample / source review required");
  percent(checks.getCell("B5"));
  checks.getCell("B7").numFmt = "0.0000";
  checks.getCell("B8").numFmt = "0";

  await workbook.xlsx.writeFile(outputPath);
  console.log(`Generated ${outputPath} (${workbook.worksheets.length} sheets)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
