import ExcelJS from "exceljs";
import { candidatePeers, selectionCriteria, targetProfile } from "../src/data/comps-selection";

const outputPath = "public/downloads/Comps_Selection_Worksheet.xlsx";
const colors = { navy: "102235", teal: "147D73", input: "E7F0FF", link: "E9F6EF", error: "FDECEC", line: "D8E0E5" };
const roleOptions = '"core_peer,secondary_peer,aspirational_peer,negative_peer,excluded_close_peer,not_clean_comp"';

const roleLabels: Record<(typeof candidatePeers)[number]["role"], string> = {
  core_peer: "Core Peer",
  secondary_peer: "Secondary Peer",
  aspirational_peer: "Aspirational Peer",
  negative_peer: "Negative Peer",
  excluded_close_peer: "Excluded Close Peer",
  not_clean_comp: "Not Clean Comp",
};

function styleTitle(sheet: ExcelJS.Worksheet, title: string, subtitle: string, lastColumn: number) {
  sheet.mergeCells(1, 1, 1, lastColumn);
  const titleCell = sheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { name: "Yu Gothic", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.navy}` } };
  titleCell.alignment = { vertical: "middle" };
  sheet.getRow(1).height = 28;

  sheet.mergeCells(2, 1, 2, lastColumn);
  const subtitleCell = sheet.getCell("A2");
  subtitleCell.value = subtitle;
  subtitleCell.font = { name: "Yu Gothic", italic: true, color: { argb: `FF${colors.teal}` } };
  subtitleCell.alignment = { wrapText: true, vertical: "middle" };
  sheet.getRow(2).height = 30;
}

function styleHeader(row: ExcelJS.Row) {
  row.font = { name: "Yu Gothic", bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.teal}` } };
  row.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  row.height = 34;
  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: `FF${colors.line}` } },
      left: { style: "thin", color: { argb: `FF${colors.line}` } },
      bottom: { style: "thin", color: { argb: `FF${colors.line}` } },
      right: { style: "thin", color: { argb: `FF${colors.line}` } },
    };
  });
}

function styleDataRange(sheet: ExcelJS.Worksheet, startRow: number, endRow: number, endColumn: number) {
  for (let row = startRow; row <= endRow; row += 1) {
    for (let column = 1; column <= endColumn; column += 1) {
      const cell = sheet.getCell(row, column);
      cell.font = { name: "Yu Gothic", size: 10 };
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: `FF${colors.line}` } },
        left: { style: "thin", color: { argb: `FF${colors.line}` } },
        bottom: { style: "thin", color: { argb: `FF${colors.line}` } },
        right: { style: "thin", color: { argb: `FF${colors.line}` } },
      };
    }
  }
}

function setWidths(sheet: ExcelJS.Worksheet, widths: number[]) {
  widths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width;
  });
}

function addGuide(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Guide");
  styleTitle(sheet, "Comps Selection Worksheet", "類似上場会社の選定根拠を、一貫した手順で記録する教育用ワークブックです。", 4);
  sheet.getRow(4).values = ["手順", "作業", "確認すること", "出力"];
  styleHeader(sheet.getRow(4));
  const steps = [
    ["1", "Target Profileを確認", "対象会社の規模、収益性、製品・サービス構成を把握する", "比較可能性の前提"],
    ["2", "Long Listを確認", "候補の情報源と基準日を記録し、母集団を広げる", "候補12社"],
    ["3", "Selection Matrixを採点", "12の評価軸を0〜3点で採点し、重大基準の不一致を確認する", "総合スコア"],
    ["4", "Peer Rolesを分類", "各候補をRoleとして分類し、根拠と追加調査事項を残す", "Core Peer候補"],
    ["5", "Review MemoとChecksを確認", "Role別の一覧、除外理由、未入力項目、データ欠損をレビューする", "レビュー記録"],
  ];
  steps.forEach((step, index) => {
    sheet.getRow(index + 5).values = step;
    sheet.getRow(index + 5).height = 44;
  });
  styleDataRange(sheet, 5, 9, 4);
  sheet.getCell("A11").value = "Roleの定義";
  sheet.getCell("A11").font = { name: "Yu Gothic", bold: true, color: { argb: `FF${colors.navy}` } };
  const definitions = Object.entries(roleLabels).map(([role, label]) => [role, label]);
  definitions.forEach((definition, index) => { sheet.getRow(index + 12).values = definition; });
  styleDataRange(sheet, 12, 17, 2);
  setWidths(sheet, [15, 31, 53, 24]);
  sheet.views = [{ state: "frozen", ySplit: 4 }];
  sheet.autoFilter = "A4:D9";
}

function addTargetProfile(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Target Profile");
  styleTitle(sheet, "Target Profile", "比較対象の基準となる対象会社のプロファイル。青色セルは確認・更新対象です。", 3);
  sheet.getRow(3).values = ["項目", "対象会社", "比較時の見方"];
  styleHeader(sheet.getRow(3));
  const rows: [string, string | number, string][] = [
    ["売上高（百万円）", targetProfile.revenue, "規模が近いか"],
    ["EBITDAマージン", targetProfile.ebitdaMargin / 100, "収益性が近いか"],
    ["海外売上比率", targetProfile.overseasSales / 100, "地域・顧客構成が近いか"],
    ["装置売上比率", targetProfile.equipmentSales / 100, "製品とサービスの構成が近いか"],
    ["サービス売上比率", targetProfile.serviceSales / 100, "製品とサービスの構成が近いか"],
    ["会社名", targetProfile.name, "対象会社の識別"],
    ["事業内容", targetProfile.business, "収益モデルと製品ミックス"],
    ["顧客市場", targetProfile.customers, "顧客・最終市場の近さ"],
    ["資本集約度", targetProfile.capitalIntensity, "設備投資と固定費構造"],
    ["循環性", targetProfile.cyclicality, "景気感応度と需要変動"],
  ];
  rows.forEach((row, index) => { sheet.getRow(index + 4).values = row; });
  styleDataRange(sheet, 4, 13, 3);
  for (let row = 4; row <= 13; row += 1) {
    sheet.getCell(row, 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.input}` } };
  }
  [5, 6, 7, 8].forEach((row) => { sheet.getCell(row, 2).numFmt = "0.0%"; });
  sheet.getRow(10).height = 42;
  sheet.getRow(11).height = 36;
  setWidths(sheet, [22, 42, 34]);
  sheet.views = [{ state: "frozen", ySplit: 3 }];
  sheet.autoFilter = "A3:C13";
}

function addLongList(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Long List");
  styleTitle(sheet, "Long List", "候補企業の母集団。情報源と基準日を明記し、除外前の観察を残します。", 11);
  sheet.getRow(3).values = ["ID", "候補企業", "事業内容", "地域", "売上高（百万円）", "成長率", "EBITDAマージン", "サービス比率", "情報源", "基準日", "一次コメント"];
  styleHeader(sheet.getRow(3));
  candidatePeers.forEach((peer, index) => {
    const row = index + 4;
    sheet.getRow(row).values = [peer.id, peer.name, peer.business, peer.geography, peer.revenue, peer.growth / 100, peer.ebitdaMargin === null ? "N/A" : peer.ebitdaMargin / 100, peer.serviceMix / 100, "教育用ケースデータ", new Date(2026, 6, 20), peer.rationale];
    sheet.getCell(row, 6).numFmt = "0.0%";
    if (peer.ebitdaMargin !== null) sheet.getCell(row, 7).numFmt = "0.0%";
    sheet.getCell(row, 8).numFmt = "0.0%";
    sheet.getCell(row, 10).numFmt = "yyyy-mm-dd";
    sheet.getRow(row).height = 62;
  });
  styleDataRange(sheet, 4, 15, 11);
  setWidths(sheet, [12, 24, 31, 15, 16, 12, 17, 14, 20, 14, 58]);
  sheet.views = [{ state: "frozen", ySplit: 3, xSplit: 2 }];
  sheet.autoFilter = "A3:K15";
}

function addSelectionMatrix(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Selection Matrix");
  styleTitle(sheet, "Selection Matrix", "0〜3点で採点（0=不一致、3=高い一致）。重大基準の不一致はRole判断時に必ず確認します。", 18);
  sheet.getRow(3).values = ["ID", "候補企業", "Role", ...selectionCriteria.map((criterion) => criterion.label), "総合スコア", "重大基準", "コメント"];
  styleHeader(sheet.getRow(3));
  candidatePeers.forEach((peer, index) => {
    const row = index + 4;
    const criticalFailures = selectionCriteria.filter((criterion) => criterion.critical && peer.scores[criterion.id] < 2).length;
    sheet.getRow(row).values = [peer.id, peer.name, peer.role, ...selectionCriteria.map((criterion) => peer.scores[criterion.id]), { formula: `SUM(D${row}:O${row})` }, { formula: `COUNTIF(D${row}:F${row},"<2")+COUNTIF(K${row}:K${row},"<2")` }, peer.rationale];
    sheet.getCell(row, 16).numFmt = "0";
    sheet.getCell(row, 17).numFmt = "0";
    sheet.getCell(row, 17).note = `重大基準の低スコア: ${criticalFailures}`;
    sheet.getRow(row).height = 58;
  });
  styleDataRange(sheet, 4, 15, 18);
  for (let row = 4; row <= 15; row += 1) {
    for (let column = 4; column <= 15; column += 1) sheet.getCell(row, column).alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell(row, 16).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.link}` } };
  }
  sheet.addConditionalFormatting({ ref: "D4:O15", rules: [{ type: "colorScale", priority: 1, cfvo: [{ type: "min" }, { type: "percentile", value: 50 }, { type: "max" }], color: [{ argb: "FFFDECEC" }, { argb: "FFFFF2CC" }, { argb: "FFE9F6EF" }] }] });
  sheet.addConditionalFormatting({ ref: "Q4:Q15", rules: [{ type: "cellIs", priority: 2, operator: "greaterThan", formulae: ["0"], style: { fill: { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.error}` } } } }] });
  setWidths(sheet, [12, 24, 22, ...selectionCriteria.map(() => 13), 14, 14, 58]);
  sheet.views = [{ state: "frozen", ySplit: 3, xSplit: 3 }];
  sheet.autoFilter = "A3:R15";
}

function addPeerRoles(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Peer Roles");
  styleTitle(sheet, "Peer Roles", "Roleを分類し、採用・除外の根拠と追加調査事項を残します。Role列はプルダウンから選択します。", 6);
  sheet.getRow(4).values = ["ID", "候補企業", "Role", "採用・除外の根拠", "追加調査事項", "データ利用可否"];
  styleHeader(sheet.getRow(4));
  candidatePeers.forEach((peer, index) => {
    const row = index + 5;
    sheet.getRow(row).values = [peer.id, peer.name, peer.role, peer.rationale, peer.dataAvailable ? "なし" : "EBITDAマージンの確認", peer.dataAvailable ? "利用可" : "未確認"];
    sheet.getCell(row, 3).dataValidation = { type: "list", allowBlank: false, formulae: [roleOptions], showErrorMessage: true, errorStyle: "stop", errorTitle: "Roleを選択してください", error: "プルダウンのRoleから選択してください。" };
    sheet.getCell(row, 3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.input}` } };
    sheet.getRow(row).height = 70;
  });
  styleDataRange(sheet, 5, 16, 6);
  setWidths(sheet, [12, 25, 24, 58, 32, 16]);
  sheet.views = [{ state: "frozen", ySplit: 4, xSplit: 2 }];
  sheet.autoFilter = "A4:F16";
}

function addReviewMemo(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Review Memo");
  styleTitle(sheet, "Review Memo", "Role別の候補一覧と、採用レンジ・除外理由をレビュー用に要約します。", 4);
  sheet.getRow(4).values = ["レビュー項目", "結果", "確認事項", "メモ"];
  styleHeader(sheet.getRow(4));
  const rows: (string | { formula: string })[][] = [
    ["Core Peer数", { formula: 'COUNTIF(\'Peer Roles\'!$C$5:$C$16,"core_peer")' }, "中心レンジとして十分な数か", ""],
    ["Core Peer候補", { formula: 'TEXTJOIN(", ",TRUE,IF(\'Peer Roles\'!$C$5:$C$16="core_peer",\'Peer Roles\'!$B$5:$B$16,""))' }, "名称とRoleを確認", ""],
    ["Secondary Peer候補", { formula: 'TEXTJOIN(", ",TRUE,IF(\'Peer Roles\'!$C$5:$C$16="secondary_peer",\'Peer Roles\'!$B$5:$B$16,""))' }, "補助的に参照する範囲", ""],
    ["除外・非Clean Comp", { formula: 'TEXTJOIN(", ",TRUE,IF((\'Peer Roles\'!$C$5:$C$16="excluded_close_peer")+(\'Peer Roles\'!$C$5:$C$16="not_clean_comp"),\'Peer Roles\'!$B$5:$B$16,""))' }, "除外理由を説明可能にする", ""],
    ["データ未確認数", { formula: 'COUNTIF(\'Peer Roles\'!$F$5:$F$16,"未確認")' }, "必要な追加確認を実施", ""],
    ["レビュー結論", "Core Peerを中心にレンジを検討。重大基準の不一致とデータ未確認を再確認する。", "最終採用レンジを別途記録", ""],
  ];
  rows.forEach((row, index) => { sheet.getRow(index + 5).values = row; sheet.getRow(index + 5).height = 50; });
  styleDataRange(sheet, 5, 10, 4);
  sheet.getCell("B10").fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.input}` } };
  setWidths(sheet, [24, 62, 32, 34]);
  sheet.views = [{ state: "frozen", ySplit: 4 }];
  sheet.autoFilter = "A4:D10";
}

function addChecks(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Checks");
  styleTitle(sheet, "Checks", "入力漏れ、データ欠損、Core Peer数、候補数を数式で確認します。", 3);
  sheet.getRow(3).values = ["チェック", "結果", "判定基準"];
  styleHeader(sheet.getRow(3));
  const rows: (string | { formula: string })[][] = [
    ["Role未入力", { formula: 'COUNTBLANK(\'Peer Roles\'!$C$5:$C$16)' }, "0であること"],
    ["データ未確認", { formula: 'COUNTIF(\'Peer Roles\'!$F$5:$F$16,"未確認")' }, "0が望ましい"],
    ["重大基準の不一致", { formula: 'COUNTIF(\'Selection Matrix\'!$Q$4:$Q$15,">0")' }, "Roleと根拠を確認"],
    ["Core Peer数", { formula: 'COUNTIF(\'Peer Roles\'!$C$5:$C$16,"core_peer")' }, "5〜8社を目安"],
    ["候補数", { formula: 'COUNTA(\'Peer Roles\'!$A$5:$A$16)' }, "12社であること"],
    ["外部リンク", "なし", "教育用ケースデータのみを使用"],
  ];
  rows.forEach((row, index) => { sheet.getRow(index + 4).values = row; });
  styleDataRange(sheet, 4, 9, 3);
  sheet.addConditionalFormatting({ ref: "B4:B4", rules: [{ type: "cellIs", priority: 1, operator: "greaterThan", formulae: ["0"], style: { fill: { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.error}` } } } }] });
  sheet.addConditionalFormatting({ ref: "B5:B5", rules: [{ type: "cellIs", priority: 2, operator: "greaterThan", formulae: ["0"], style: { fill: { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.error}` } } } }] });
  sheet.addConditionalFormatting({ ref: "B6:B6", rules: [{ type: "cellIs", priority: 3, operator: "greaterThan", formulae: ["0"], style: { fill: { type: "pattern", pattern: "solid", fgColor: { argb: `FF${colors.error}` } } } }] });
  setWidths(sheet, [28, 22, 38]);
  sheet.views = [{ state: "frozen", ySplit: 3 }];
  sheet.autoFilter = "A3:C9";
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "M&A Modeling Lab";
  workbook.created = new Date(2026, 6, 20);
  workbook.modified = new Date(2026, 6, 20);
  workbook.calcProperties.fullCalcOnLoad = true;

  addGuide(workbook);
  addTargetProfile(workbook);
  addLongList(workbook);
  addSelectionMatrix(workbook);
  addPeerRoles(workbook);
  addReviewMemo(workbook);
  addChecks(workbook);

  await workbook.xlsx.writeFile(outputPath);
  console.log(`Comps selection workbook generated: ${outputPath}`);
}

void main();
