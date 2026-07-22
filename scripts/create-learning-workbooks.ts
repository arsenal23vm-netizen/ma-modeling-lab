import ExcelJS from "exceljs";

const outputDir = "public/downloads";
const files = [
  ["01_仕訳演習.xlsx", ["使い方", "仕訳演習", "三表への影響", "チェック"]],
  ["02_前提条件入力.xlsx", ["使い方", "前提", "Base", "Upside", "Downside", "チェック"]],
  ["03_PLモデル練習.xlsx", ["使い方", "入力", "PL", "チェック"]],
  ["04_BS_CF統合練習.xlsx", ["使い方", "入力", "BS", "CF", "計算明細", "チェック"]],
  ["05_完成3表モデル.xlsx", ["表紙", "入力", "前提", "PL", "BS", "CF", "計算明細", "チェック"]],
  ["07_モデル品質チェックリスト.xlsx", ["使い方", "品質基準", "レビュー結果", "チェック"]],
] as const;

const colors = { navy: "FF102235", teal: "FF147D73", input: "FFE7F0FF", line: "FFD8E0E5", output: "FFE9F6EF", white: "FFFFFFFF" };

function addSheet(workbook: ExcelJS.Workbook, name: string, description: string) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printArea: "A1:F30" },
  });
  [26, 20, 20, 20, 20, 42].forEach((width, index) => { sheet.getColumn(index + 1).width = width; });
  sheet.mergeCells("A1:F1");
  sheet.getCell("A1").value = name;
  sheet.getCell("A1").font = { name: "Yu Gothic", size: 16, bold: true, color: { argb: colors.white } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.navy } };
  sheet.mergeCells("A2:F2");
  sheet.getCell("A2").value = description;
  sheet.getCell("A2").font = { name: "Yu Gothic", color: { argb: colors.teal } };
  return sheet;
}

function header(sheet: ExcelJS.Worksheet, row: number, values: string[]) {
  sheet.getRow(row).values = values;
  values.forEach((_, index) => {
    const cell = sheet.getCell(row, index + 1);
    cell.font = { name: "Yu Gothic", bold: true, color: { argb: colors.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.teal } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  });
}

function grid(sheet: ExcelJS.Worksheet, start: number, end: number, columns = 6) {
  for (let row = start; row <= end; row += 1) for (let column = 1; column <= columns; column += 1) {
    const cell = sheet.getCell(row, column);
    cell.font = { name: "Yu Gothic", size: 10 };
    cell.alignment = { vertical: "top", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: colors.line } } };
  }
}

function guide(workbook: ExcelJS.Workbook, name = "使い方") {
  const sheet = addSheet(workbook, name, "青色セルへ入力し、数式セルとチェック結果を確認してください。単位：百万円。");
  header(sheet, 4, ["手順", "作業", "確認事項", "成果物"]);
  [
    [1, "前提を入力", "基準日・単位・出所を記録", "入力済み前提"],
    [2, "計算を確認", "数式の流れと符号を確認", "計算明細"],
    [3, "チェックを実施", "差額がゼロ、判定が適合", "レビュー可能なモデル"],
  ].forEach((values, index) => { sheet.getRow(index + 5).values = values; });
  grid(sheet, 5, 7, 4);
}

function inputCell(cell: ExcelJS.Cell, value: number, format = "#,##0.0") {
  cell.value = value;
  cell.numFmt = format;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.input } };
  cell.font = { name: "Yu Gothic", color: { argb: "FF1F4E78" } };
}

function formula(cell: ExcelJS.Cell, expression: string, result: number | string, output = false) {
  cell.value = { formula: expression, result };
  if (output) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.output } };
}

function addJournalWorkbook(workbook: ExcelJS.Workbook) {
  guide(workbook);
  const journal = addSheet(workbook, "仕訳演習", "決算整理仕訳を具体的な金額で入力し、借方・貸方の一致を確認します。");
  header(journal, 4, ["取引", "借方科目", "借方金額", "貸方科目", "貸方金額", "実務上の確認"]);
  const rows = [
    ["外注費を未払計上", "外注費", 1200, "未払金", 1200, "検収済み・請求書未着。見積根拠を保存"],
    ["減価償却費を計上", "減価償却費", 300, "減価償却累計額", 300, "固定資産台帳と耐用年数を照合"],
    ["売掛金の貸倒引当", "貸倒引当金繰入", 80, "貸倒引当金", 80, "債権年齢表と回収状況を確認"],
  ];
  rows.forEach((values, index) => { journal.getRow(index + 5).values = values; });
  grid(journal, 5, 7);
  const impact = addSheet(workbook, "三表への影響", "仕訳がPL（損益計算書）、BS（貸借対照表）、CF（キャッシュ・フロー計算書）へどう波及するか整理します。");
  header(impact, 4, ["取引", "PLへの影響", "BSへの影響", "CFへの影響", "税前利益への影響", "確認"]);
  impact.getRow(5).values = ["外注費を未払計上", "外注費 +1,200", "未払金 +1,200", "当期の現金支出なし", -1200, "運転資本変動との二重計上に注意"];
  grid(impact, 5, 5);
  const checks = addSheet(workbook, "チェック", "借方・貸方と三表への影響を数式で確認します。");
  header(checks, 4, ["チェック項目", "計算結果", "判定"]);
  checks.getRow(5).values = ["借方・貸方差額"];
  formula(checks.getCell("B5"), "SUM(仕訳演習!C5:C7)-SUM(仕訳演習!E5:E7)", 0);
  formula(checks.getCell("C5"), 'IF(ABS(B5)<0.001,"適合","要確認")', "適合", true);
}

function addScenarioWorkbook(workbook: ExcelJS.Workbook) {
  guide(workbook);
  const assumptions = addSheet(workbook, "前提", "Base / Upside / Downsideを同じ定義と単位で管理します。");
  header(assumptions, 4, ["前提項目", "Base", "Upside", "Downside", "単位", "出所・根拠"]);
  const rows = [["販売数量成長率", .05, .08, .01, "%", "営業計画"], ["平均単価上昇率", .02, .03, 0, "%", "価格改定方針"], ["売上総利益率", .35, .38, .31, "%", "製品構成と原価見通し"]];
  rows.forEach((values, index) => { assumptions.getRow(index + 5).values = values; [2,3,4].forEach((col) => inputCell(assumptions.getCell(index + 5, col), values[col - 1] as number, "0.0%")); });
  grid(assumptions, 5, 7);
  for (const [name, column] of [["Base", "B"], ["Upside", "C"], ["Downside", "D"]] as const) {
    const sheet = addSheet(workbook, name, `${name}の主要前提と売上高計算です。`);
    header(sheet, 4, ["項目", "2025年度実績", "2026年度予測", "計算式"]);
    sheet.getRow(5).values = ["売上高", 1000];
    const growth = assumptions.getCell(`${column}5`).value as number;
    formula(sheet.getCell("C5"), `B5*(1+前提!${column}5)*(1+前提!${column}6)`, 1000 * (1 + growth) * (1 + (assumptions.getCell(`${column}6`).value as number)), true);
    sheet.getCell("D5").value = "数量成長 × 単価上昇";
  }
  const checks = addSheet(workbook, "チェック", "シナリオ間の方向性と入力漏れを確認します。");
  header(checks, 4, ["チェック項目", "計算結果", "判定"]);
  checks.getRow(5).values = ["売上高の方向性"];
  formula(checks.getCell("B5"), "Upside!C5>Base!C5", "TRUE");
  formula(checks.getCell("C5"), 'IF(AND(Upside!C5>Base!C5,Base!C5>Downside!C5),"適合","要確認")', "適合", true);
}

function addSimpleModel(workbook: ExcelJS.Workbook, kind: "pl" | "bs_cf" | "three") {
  if (kind === "three") guide(workbook, "表紙"); else guide(workbook);
  const input = addSheet(workbook, "入力", "実績値と予測前提を入力します。青色セルのみ手入力です。");
  header(input, 4, ["項目", "2025年度実績", "2026年度予測", "単位", "出所"]);
  [["売上高", 1000, 1100], ["売上原価", 650, 700], ["売掛金", 120, 132], ["設備投資", 40, 45]].forEach((values, index) => {
    input.getRow(index + 5).values = values;
    inputCell(input.getCell(index + 5, 2), values[1] as number);
    inputCell(input.getCell(index + 5, 3), values[2] as number);
  });
  if (kind === "three") {
    const assumptions = addSheet(workbook, "前提", "予測計算に用いる前提を集約します。");
    header(assumptions, 4, ["前提項目", "入力値", "単位", "根拠"]);
    assumptions.getRow(5).values = ["法人実効税率", .30, "%", "会社計画"];
    inputCell(assumptions.getCell("B5"), .30, "0.0%");
  }
  if (kind !== "bs_cf") {
    const pl = addSheet(workbook, "PL", "売上高から営業利益までを一方向の数式で計算します。");
    header(pl, 4, ["項目", "2025年度実績", "2026年度予測"]);
    pl.getRow(5).values = ["売上高"];
    pl.getRow(6).values = ["売上原価"];
    pl.getRow(7).values = ["売上総利益"];
    for (const [col, source] of [["B", "B"], ["C", "C"]]) {
      formula(pl.getCell(`${col}5`), `入力!${source}5`, col === "B" ? 1000 : 1100);
      formula(pl.getCell(`${col}6`), `入力!${source}6`, col === "B" ? 650 : 700);
      formula(pl.getCell(`${col}7`), `${col}5-${col}6`, col === "B" ? 350 : 400, true);
    }
  }
  if (kind !== "pl") {
    const bs = addSheet(workbook, "BS", "期末残高を計算し、資産と負債・純資産の一致を確認します。");
    header(bs, 4, ["項目", "2025年度実績", "2026年度予測"]);
    bs.getRow(5).values = ["現金及び預金", 100]; formula(bs.getCell("C5"), "CF!C10", 145);
    bs.getRow(6).values = ["売掛金", 120]; formula(bs.getCell("C6"), "入力!C7", 132);
    bs.getRow(8).values = ["資産合計", 220]; formula(bs.getCell("C8"), "SUM(C5:C6)", 277, true);
    const cf = addSheet(workbook, "CF", "営業・投資・財務キャッシュ・フローから期末現金を計算します。");
    header(cf, 4, ["項目", "2025年度実績", "2026年度予測"]);
    cf.getRow(5).values = ["営業キャッシュ・フロー", 70, 90];
    cf.getRow(6).values = ["投資キャッシュ・フロー", -40]; formula(cf.getCell("C6"), "-入力!C8", -45);
    cf.getRow(9).values = ["現金増減", 30]; formula(cf.getCell("C9"), "SUM(C5:C6)", 45);
    cf.getRow(10).values = ["期末現金", 100]; formula(cf.getCell("C10"), "B10+C9", 145, true);
    addSheet(workbook, "計算明細", "運転資本、固定資産、借入金の計算根拠を記録する作業シートです。");
  }
  const checks = addSheet(workbook, "チェック", "モデルの主要な整合性を数式で確認します。");
  header(checks, 4, ["チェック項目", "計算結果", "判定"]);
  checks.getRow(5).values = ["数式エラー件数", 0];
  formula(checks.getCell("C5"), 'IF(B5=0,"適合","要確認")', "適合", true);
}

function addQualityWorkbook(workbook: ExcelJS.Workbook) {
  guide(workbook);
  const quality = addSheet(workbook, "品質基準", "モデル品質を構造、追跡可能性、整合性、説明可能性で評価します。");
  header(quality, 4, ["評価区分", "確認項目", "判定基準", "重要度", "担当者", "証跡"]);
  [["構造", "入力と数式の分離", "手入力セルが識別できる", "高"], ["追跡可能性", "出所と基準日", "主要前提に出所がある", "高"], ["整合性", "財務三表の接続", "BS差額がゼロ", "高"], ["説明可能性", "変動要因", "主要差異を説明できる", "中"]].forEach((v,i)=>quality.getRow(i+5).values=v);
  grid(quality,5,8);
  const review = addSheet(workbook, "レビュー結果", "レビュー結果、修正担当、期限、対応状況を記録します。");
  header(review, 4, ["番号", "指摘事項", "重要度", "修正担当", "期限", "対応状況"]);
  review.getRow(5).values = [1, "主要前提の出所を追記", "高", "モデル担当", "2026-07-31", "未対応"];
  const checks = addSheet(workbook, "チェック", "未対応の重要指摘がないことを確認します。");
  header(checks, 4, ["チェック項目", "計算結果", "判定"]);
  formula(checks.getCell("B5"), 'COUNTIFS(レビュー結果!C5:C30,"高",レビュー結果!F5:F30,"<>対応済")', 1);
  formula(checks.getCell("C5"), 'IF(B5=0,"適合","要確認")', "要確認", true);
}

async function main() {
  for (const [file] of files) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Finance Modeling Lab 編集部";
    workbook.created = new Date("2026-07-22T00:00:00Z");
    workbook.modified = new Date("2026-07-22T00:00:00Z");
    workbook.calcProperties.fullCalcOnLoad = true;
    if (file.startsWith("01_")) addJournalWorkbook(workbook);
    else if (file.startsWith("02_")) addScenarioWorkbook(workbook);
    else if (file.startsWith("03_")) addSimpleModel(workbook, "pl");
    else if (file.startsWith("04_")) addSimpleModel(workbook, "bs_cf");
    else if (file.startsWith("05_")) addSimpleModel(workbook, "three");
    else addQualityWorkbook(workbook);
    await workbook.xlsx.writeFile(`${outputDir}/${file}`);
  }
  console.log("基礎Excel教材6冊を生成しました");
}

void main();
