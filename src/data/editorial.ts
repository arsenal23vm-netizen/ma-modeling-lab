export const EDITORIAL_AUTHOR = {
  name: "Finance Modeling Lab 編集部",
  url: "/about#editorial-team",
} as const;

export const ARTICLE_HREFS = [
  "/model-design",
  "/assumptions",
  "/revenue-kpi",
  "/pl-model",
  "/bs-model",
  "/cf-model",
  "/excel-functions",
  "/roadmap",
  "/three-statements",
  "/private-company-valuation",
  "/comps-peer-selection",
  "/valuation/dcf/fcff",
  "/valuation/dcf/wacc",
  "/valuation/dcf/terminal-value",
  "/valuation/dcf/sensitivity-analysis",
  "/valuation/dcf/enterprise-to-equity",
] as const;

export type ArticleHref = (typeof ARTICLE_HREFS)[number];

export type EditorialSource = {
  title: string;
  publisher: string;
  url: string;
  accessedDate: string;
};

export type EditorialRecord = {
  href: ArticleHref;
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  revisionSummary: string;
  sources: EditorialSource[];
};

const accessedDate = "2026-07-21";

const sources = {
  excelFormulas: {
    title: "Overview of formulas in Excel",
    publisher: "Microsoft Support",
    url: "https://support.microsoft.com/en-us/Excel/get-started/overview-of-formulas-in-excel",
    accessedDate,
  },
  excelFunctions: {
    title: "Excel functions (by category)",
    publisher: "Microsoft Support",
    url: "https://support.microsoft.com/en-us/excel/excel-functions-by-category",
    accessedDate,
  },
  excelErrors: {
    title: "Detect formula errors in Excel",
    publisher: "Microsoft Support",
    url: "https://support.microsoft.com/en-us/office/detect-formula-errors-in-excel-3a8acca5-1d61-4702-80e0-99a36a2822c1",
    accessedDate,
  },
  conceptualFramework: {
    title: "Conceptual Framework for Financial Reporting",
    publisher: "IFRS Foundation",
    url: "https://www.ifrs.org/issued-standards/list-of-standards/conceptual-framework/",
    accessedDate,
  },
  financialStatements: {
    title: "IAS 1 Presentation of Financial Statements",
    publisher: "IFRS Foundation",
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements.html/",
    accessedDate,
  },
  cashFlows: {
    title: "IAS 7 Statement of Cash Flows",
    publisher: "IFRS Foundation",
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/",
    accessedDate,
  },
  fairValue: {
    title: "Fair Value Measurement",
    publisher: "IFRS Foundation",
    url: "https://www.ifrs.org/projects/completed-projects/2011/fair-value-measurement/",
    accessedDate,
  },
  edinet: {
    title: "XBRL関連情報について",
    publisher: "金融庁",
    url: "https://www.fsa.go.jp/search/20080304-2.html",
    accessedDate,
  },
} satisfies Record<string, EditorialSource>;

export const editorialRecords = [
  {
    href: "/model-design",
    title: "壊れにくいM&Aモデルの設計",
    description: "入力・計算・出力を分離するM&A財務モデルの基本設計を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "数式の参照設計とレビュー時の確認ポイントを整理しました。",
    sources: [sources.excelFormulas, sources.excelErrors],
  },
  {
    href: "/assumptions",
    title: "前提条件とシナリオ管理",
    description: "財務モデルの前提条件を集約し、シナリオを一貫して管理する方法を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "前提の根拠、変更管理、シナリオ比較の説明を明確化しました。",
    sources: [sources.conceptualFramework, sources.excelFormulas],
  },
  {
    href: "/revenue-kpi",
    title: "売上をKPIから分解する",
    description: "売上高を数量・単価・顧客数などのKPIに分解して計画する方法を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "KPI分解と開示資料から実績を確認する手順を追記しました。",
    sources: [sources.edinet, sources.excelFormulas],
  },
  {
    href: "/pl-model",
    title: "損益計算書（PL）のExcel設計",
    description: "M&Aモデルの損益計算書を前提条件から将来計画までExcelで構築する方法。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "損益計算書の表示区分と計画ロジックの説明を更新しました。",
    sources: [sources.financialStatements, sources.excelFormulas],
  },
  {
    href: "/bs-model",
    title: "貸借対照表（BS）のExcel設計",
    description: "残高の発生原因と増減明細から貸借対照表を予測する方法を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "残高計算と貸借一致チェックの説明を更新しました。",
    sources: [sources.financialStatements, sources.conceptualFramework],
  },
  {
    href: "/cf-model",
    title: "キャッシュ・フロー計算書（CF）のExcel設計",
    description: "間接法で営業・投資・財務キャッシュフローを構築する方法を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-20",
    revisionSummary: "間接法の調整項目と三表連動の確認手順を更新しました。",
    sources: [sources.cashFlows, sources.financialStatements],
  },
  {
    href: "/excel-functions",
    title: "コンサルティング実務のExcel関数と参照設計",
    description: "財務モデルで使うExcel関数と、追跡可能なセル参照の設計を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-21",
    revisionSummary: "関数リファレンスと数式エラーの確認方法を更新しました。",
    sources: [sources.excelFunctions, sources.excelErrors],
  },
  {
    href: "/roadmap",
    title: "完成までの実務ロードマップ",
    description: "情報受領から構築、検証、意思決定までの財務モデル作成手順を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-21",
    revisionSummary: "検証工程とレビュー前に残す記録の説明を更新しました。",
    sources: [sources.excelErrors, sources.conceptualFramework],
  },
  {
    href: "/three-statements",
    title: "財務三表を連動させる",
    description: "損益計算書、貸借対照表、キャッシュ・フロー計算書の連動方法を解説。",
    publishedDate: "2026-07-12",
    modifiedDate: "2026-07-21",
    revisionSummary: "三表間の参照順序と整合性チェックの説明を更新しました。",
    sources: [sources.financialStatements, sources.cashFlows],
  },
  {
    href: "/private-company-valuation",
    title: "非上場企業Valuation入門――企業価値から株主価値まで",
    description: "非上場企業のEV、株主価値、EBITDA正常化、評価手法を架空事例で解説。",
    publishedDate: "2026-07-19",
    modifiedDate: "2026-07-21",
    revisionSummary: "評価手法、EVから株主価値への調整、出典情報を更新しました。",
    sources: [sources.fairValue, sources.edinet],
  },
  {
    href: "/comps-peer-selection",
    title: "Compsの選定――類似上場会社を選ぶ実務フレームワーク",
    description: "Comps候補の抽出、比較基準、採用・除外理由の記録方法を解説。",
    publishedDate: "2026-07-19",
    modifiedDate: "2026-07-21",
    revisionSummary: "比較対象の選定基準と出典・変更履歴の表示を追加しました。",
    sources: [sources.fairValue, sources.edinet],
  },
  {
    href: "/valuation/dcf/fcff",
    title: "FCFFの計算方法――EBITから5年予測を作る",
    description: "EBITからNOPAT、減価償却、設備投資、運転資本増加を反映してFCFFを計算します。",
    publishedDate: "2026-07-21",
    modifiedDate: "2026-07-21",
    revisionSummary: "共有ケースの5年予測、符号ルール、Excelセル式、レビュー観点を追加しました。",
    sources: [sources.fairValue, sources.excelFormulas],
  },
  {
    href: "/valuation/dcf/wacc",
    title: "WACCの計算方法――資本コストを正しく加重する",
    description: "株主資本コスト、税引後負債コスト、目標資本構成からWACCを計算します。",
    publishedDate: "2026-07-21",
    modifiedDate: "2026-07-21",
    revisionSummary: "資本構成の100%チェックとWACCが永久成長率を上回るガードを追加しました。",
    sources: [sources.fairValue, sources.excelFormulas],
  },
  {
    href: "/valuation/dcf/terminal-value",
    title: "継続価値の計算方法――Terminal Valueを検証する",
    description: "Gordon Growth法で継続価値を計算し、期末割引と企業価値に占める構成比を確認します。",
    publishedDate: "2026-07-21",
    modifiedDate: "2026-07-21",
    revisionSummary: "期末時点の明示、WACCと永久成長率のガード、価値集中の表示を追加しました。",
    sources: [sources.fairValue, sources.excelFormulas],
  },
  {
    href: "/valuation/dcf/sensitivity-analysis",
    title: "DCF感応度分析の作り方――WACCと永久成長率を並べる",
    description: "WACCと永久成長率の5×5感応度表で企業価値の変動と無効条件を確認します。",
    publishedDate: "2026-07-21",
    modifiedDate: "2026-07-21",
    revisionSummary: "感応度の方向性チェック、無効セルのN/A表示、Excel Data Table式を追加しました。",
    sources: [sources.fairValue, sources.excelFormulas],
  },
  {
    href: "/valuation/dcf/enterprise-to-equity",
    title: "EVから株主価値へのブリッジ――現金と負債を調整する",
    description: "企業価値から現金、負債、負債類似項目、非支配株主持分を調整して株主価値を求めます。",
    publishedDate: "2026-07-21",
    modifiedDate: "2026-07-21",
    revisionSummary: "EV-to-Equity Bridgeの全調整項目、符号、Excelセル式を追加しました。",
    sources: [sources.fairValue, sources.excelFormulas],
  },
] satisfies readonly EditorialRecord[];

export function getEditorialRecord(href: string): EditorialRecord {
  const record = editorialRecords.find((item) => item.href === href);

  if (!record) {
    throw new Error(`Editorial record not found for ${href}`);
  }

  return record;
}
