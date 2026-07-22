export type ContentEntry = {
  href: string;
  title: string;
  summary: string;
  type: "article" | "hub" | "download" | "tool" | "reference";
  topic: "financial-modeling" | "valuation" | "ma-modeling" | "excel";
  level: string;
  readingTime: string;
  keywords: string[];
  featured: boolean;
};

export const contentCatalog: ContentEntry[] = [
  {
    href: "/financial-modeling",
    title: "財務モデリング",
    summary: "財務三表、事業計画、モデル設計を順に学ぶためのハブです。",
    type: "hub", topic: "financial-modeling", level: "基礎から実務", readingTime: "案内", keywords: ["financial modeling", "財務モデル", "三表モデル"], featured: true,
  },
  {
    href: "/valuation",
    title: "Valuation",
    summary: "DCFと類似会社比較を使ったValuationを学ぶための案内ページです。",
    type: "hub", topic: "valuation", level: "基礎から実務", readingTime: "案内", keywords: ["valuation", "企業価値", "DCF", "comps"], featured: true,
  },
  {
    href: "/ma-modeling",
    title: "M&Aモデリング",
    summary: "M&Aの分析、類似会社選定、レビュー観点を整理するハブです。",
    type: "hub", topic: "ma-modeling", level: "基礎から実務", readingTime: "案内", keywords: ["M&A", "ma modeling", "買収", "類似会社"], featured: true,
  },
  {
    href: "/excel-templates",
    title: "Excelテンプレート",
    summary: "財務モデリングの学習に使えるExcelテンプレートと演習ファイルを集めたハブです。",
    type: "hub", topic: "excel", level: "基礎から実務", readingTime: "案内", keywords: ["Excel", "テンプレート", "download", "ダウンロード"], featured: true,
  },
  {
    href: "/model-design",
    title: "壊れにくいM&Aモデルの設計",
    summary: "入力・計算・出力を分離し、第三者が検証できるモデルの骨格を作ります。",
    type: "article", topic: "financial-modeling", level: "基礎", readingTime: "12分", keywords: ["M&Aモデル", "モデル設計", "入力 計算 出力", "Excel"], featured: true,
  },
  {
    href: "/assumptions",
    title: "前提条件とシナリオ管理",
    summary: "事業計画、取引条件、資金調達の前提を一元管理します。",
    type: "article", topic: "financial-modeling", level: "基礎", readingTime: "14分", keywords: ["前提条件", "シナリオ", "Base", "Upside", "Downside"], featured: false,
  },
  {
    href: "/revenue-kpi",
    title: "売上をKPIから分解する",
    summary: "数量×単価など、事業の因果関係をExcelへ落とし込みます。",
    type: "article", topic: "financial-modeling", level: "実践", readingTime: "16分", keywords: ["売上", "KPI", "数量", "単価", "Revenue"], featured: false,
  },
  {
    href: "/pl-model",
    title: "損益計算書（PL）のExcel設計",
    summary: "売上高から当期純利益までを、前提条件と事業ドライバーで予測します。",
    type: "article", topic: "financial-modeling", level: "実践", readingTime: "22分", keywords: ["PL", "損益計算書", "P&L", "Excel"], featured: false,
  },
  {
    href: "/bs-model",
    title: "貸借対照表（BS）の設計",
    summary: "運転資本、固定資産、借入金、純資産をロールフォワードします。",
    type: "article", topic: "financial-modeling", level: "実践", readingTime: "24分", keywords: ["BS", "貸借対照表", "運転資本", "ロールフォワード"], featured: false,
  },
  {
    href: "/cf-model",
    title: "キャッシュ・フロー計算書（CF）の設計",
    summary: "PLとBSの増減から現金を導き、返済能力を検証します。",
    type: "article", topic: "financial-modeling", level: "実践", readingTime: "24分", keywords: ["CF", "キャッシュフロー", "キャッシュ・フロー", "間接法"], featured: false,
  },
  {
    href: "/excel-functions",
    title: "実務で使うExcel関数と参照設計",
    summary: "XLOOKUP、INDEX、SUMIFSなどで前提から出力までを一方向につなぎます。",
    type: "article", topic: "excel", level: "応用", readingTime: "26分", keywords: ["Excel", "XLOOKUP", "INDEX", "SUMIFS", "参照設計"], featured: true,
  },
  {
    href: "/roadmap",
    title: "完成までの実務ロードマップ",
    summary: "データ受領からレビュー、感応度分析、意思決定資料までを整理します。",
    type: "article", topic: "ma-modeling", level: "実務", readingTime: "10分", keywords: ["ロードマップ", "レビュー", "M&A", "意思決定"], featured: false,
  },
  {
    href: "/three-statements",
    title: "財務三表を連動させる",
    summary: "PL、BS、CFを一方向の参照で接続し、現金及び預金の増減へ変換します。",
    type: "article", topic: "financial-modeling", level: "実践", readingTime: "18分", keywords: ["財務三表", "PL", "BS", "CF", "three statements"], featured: true,
  },
  {
    href: "/private-company-valuation",
    title: "非上場企業Valuation入門――企業価値から株主価値まで",
    summary: "非上場企業のValuation、EBITDAの正常化、Enterprise ValueからEquity Valueへの調整を解説します。",
    type: "article", topic: "valuation", level: "基礎", readingTime: "20分", keywords: ["Valuation", "企業価値", "株主価値", "EBITDA", "非上場企業"], featured: true,
  },
  {
    href: "/comps-peer-selection",
    title: "類似会社比較法：比較会社の選定とマルチプル分析",
    summary: "類似会社の選定根拠を整理し、マルチプルでEnterprise Valueを比較する方法を解説します。",
    type: "article", topic: "valuation", level: "実践", readingTime: "22分", keywords: ["類似会社比較", "主要比較会社", "Core Peer", "Comps", "Peer", "マルチプル", "EV/EBITDA"], featured: true,
  },
  {
    href: "/valuation/dcf",
    title: "DCF評価の基礎",
    summary: "FCFF、WACC、継続価値、株主価値へのブリッジを5つのステップで学びます。",
    type: "hub", topic: "valuation", level: "基礎から実務", readingTime: "案内", keywords: ["DCF", "企業価値", "FCFF", "WACC", "discounted cash flow"], featured: true,
  },
  {
    href: "/valuation/dcf/fcff",
    title: "FCFFの計算方法",
    summary: "EBITから税引後営業利益、減価償却、設備投資、運転資本増減を反映してFCFFを計算します。",
    type: "article", topic: "valuation", level: "実践", readingTime: "12分", keywords: ["FCFF", "フリーキャッシュフロー", "NOPAT", "Capex", "運転資本"], featured: false,
  },
  {
    href: "/valuation/dcf/wacc",
    title: "WACC（加重平均資本コスト）の計算方法",
    summary: "株主資本コスト、負債コスト、資本構成から割引率であるWACCを計算します。",
    type: "article", topic: "valuation", level: "実践", readingTime: "12分", keywords: ["WACC", "加重平均資本コスト", "割引率", "Cost of Equity", "Cost of Debt"], featured: true,
  },
  {
    href: "/valuation/dcf/terminal-value",
    title: "継続価値の計算方法",
    summary: "永久成長法と出口マルチプル法を比較し、継続価値の前提を検証します。",
    type: "article", topic: "valuation", level: "実践", readingTime: "12分", keywords: ["Terminal Value", "継続価値", "永久成長率", "Gordon Growth", "Exit Multiple"], featured: false,
  },
  {
    href: "/valuation/dcf/sensitivity-analysis",
    title: "DCF感応度分析の作り方",
    summary: "WACCと永久成長率を軸にした感応度表をExcelで作成し、前提の影響を確認します。",
    type: "article", topic: "valuation", level: "実践", readingTime: "12分", keywords: ["感応度分析", "Sensitivity", "WACC", "永久成長率", "Excel"], featured: false,
  },
  {
    href: "/valuation/dcf/enterprise-to-equity",
    title: "Enterprise ValueからEquity Valueへの調整",
    summary: "企業価値から現金、負債、負債類似項目、非支配株主持分を調整して株主価値を導きます。",
    type: "article", topic: "valuation", level: "実践", readingTime: "12分", keywords: ["EV", "株主価値", "Enterprise Value", "Equity Value", "Net Debt"], featured: false,
  },
  {
    href: "/downloads",
    title: "ダウンロードセンター",
    summary: "仕訳、前提条件、PL、BS・CF、財務三表、DCF、品質チェック、類似会社比較のExcel演習を配布します。",
    type: "hub", topic: "excel", level: "基礎から実務", readingTime: "案内", keywords: ["ダウンロード", "Excel", "テンプレート", "ワークブック"], featured: true,
  },
  {
    href: "/downloads/01_仕訳演習.xlsx",
    title: "仕訳演習 Excelワークブック",
    summary: "売上、仕入、給与、固定資産、借入、税金の仕訳演習と財務三表への影響を確認できます。",
    type: "download", topic: "excel", level: "基礎", readingTime: "Excel", keywords: ["仕訳", "会計", "財務三表", "Excel"], featured: false,
  },
  {
    href: "/downloads/02_前提条件入力.xlsx",
    title: "前提条件入力 Excelワークブック",
    summary: "Base、Upside、Downsideの売上、原価、運転資本、税率を入力するテンプレートです。",
    type: "download", topic: "excel", level: "基礎", readingTime: "Excel", keywords: ["前提条件", "シナリオ", "Base", "Upside", "Downside"], featured: false,
  },
  {
    href: "/downloads/03_PLモデル練習.xlsx",
    title: "PLモデル練習 Excelワークブック",
    summary: "数量×単価、材料費、労務費、製造経費、税金を使うPLモデルの演習ファイルです。",
    type: "download", topic: "excel", level: "実践", readingTime: "Excel", keywords: ["PL", "損益計算書", "Excel", "売上"], featured: false,
  },
  {
    href: "/downloads/04_BS_CF統合練習.xlsx",
    title: "BS・CF統合練習 Excelワークブック",
    summary: "運転資本、固定資産、借入金、間接法キャッシュ・フローを連動させる演習ファイルです。",
    type: "download", topic: "excel", level: "実践", readingTime: "Excel", keywords: ["BS", "CF", "貸借対照表", "キャッシュフロー"], featured: false,
  },
  {
    href: "/downloads/05_完成3表モデル.xlsx",
    title: "完成3表モデル Excelワークブック",
    summary: "入力、前提、PL、BS、CF、計算明細、チェックを備えた完成モデルです。",
    type: "download", topic: "excel", level: "実践", readingTime: "Excel", keywords: ["財務三表", "PL", "BS", "CF", "Checks"], featured: true,
  },
  {
    href: "/downloads/06_DCF評価モデル.xlsx",
    title: "DCF評価モデル Excelワークブック",
    summary: "FCFF、WACC、継続価値、企業価値、株主価値、感応度表を収録したExcelモデルです。",
    type: "download", topic: "valuation", level: "実践", readingTime: "Excel", keywords: ["DCF", "WACC", "FCFF", "感応度分析", "Excel"], featured: false,
  },
  {
    href: "/downloads/07_モデル品質チェックリスト.xlsx",
    title: "モデル品質チェックリスト Excelワークブック",
    summary: "100点満点の品質基準、主要チェック、エラー表示例をまとめたレビュー用ファイルです。",
    type: "download", topic: "excel", level: "実務", readingTime: "Excel", keywords: ["品質", "レビュー", "チェックリスト", "Excel"], featured: false,
  },
  {
    href: "/downloads/類似会社選定ワークシート.xlsx",
    title: "類似会社選定 Excelワークブック",
    summary: "対象会社の事業特性、比較候補会社一覧、比較会社選定表、検討記録、チェックを収録しています。",
    type: "download", topic: "valuation", level: "実践", readingTime: "Excel", keywords: ["Comps", "類似会社", "Peer", "Excel", "選定"], featured: false,
  },
  {
    href: "/downloads/dcf-valuation-model",
    title: "DCF評価モデルの使い方",
    summary: "標準準拠の9シートDCF Excelワークブックについて、青セル入力、期末割引、主要数式、5×5感応度、チェックを解説します。",
    type: "download", topic: "valuation", level: "実践", readingTime: "15分", keywords: ["DCF", "Excel", "WACC", "FCFF", "ダウンロード"], featured: true,
  },
  {
    href: "/tools",
    title: "実務ツール",
    summary: "KPI売上モデルと前提条件チェックリストで、モデル構築前の検討を支援します。",
    type: "tool", topic: "financial-modeling", level: "実践", readingTime: "操作", keywords: ["ツール", "KPI", "売上", "前提条件", "チェックリスト"], featured: true,
  },
  {
    href: "/journal-lab",
    title: "会計仕訳ラボ",
    summary: "取引、仕訳、PL・BS・CFへの反映、Excelの入力・参照先を同じ順序で確認します。",
    type: "reference", topic: "financial-modeling", level: "基礎", readingTime: "演習", keywords: ["仕訳", "会計", "PL", "BS", "CF"], featured: true,
  },
  {
    href: "/learning-roadmap",
    title: "学習ロードマップ",
    summary: "会計とExcelの基礎からDCF、品質レビューまでの学習順序を案内します。",
    type: "reference", topic: "financial-modeling", level: "基礎から実務", readingTime: "案内", keywords: ["学習", "ロードマップ", "財務モデリング", "DCF"], featured: false,
  },
  {
    href: "/quality-standard",
    title: "モデル品質基準",
    summary: "構造、前提、数式、三表連動、チェック、可読性の品質基準を確認します。",
    type: "reference", topic: "financial-modeling", level: "実務", readingTime: "10分", keywords: ["品質", "レビュー", "チェック", "財務モデル"], featured: false,
  },
  {
    href: "/books",
    title: "財務モデリングの推薦書籍",
    summary: "財務モデリング、Excel設計、企業価値評価、M&Aを学ぶための推薦書籍を紹介します。",
    type: "reference", topic: "financial-modeling", level: "基礎から実務", readingTime: "8分", keywords: ["書籍", "財務モデリング", "Excel", "企業価値評価", "M&A"], featured: false,
  },
  {
    href: "/editorial-policy",
    title: "編集方針",
    summary: "教育コンテンツの制作基準、更新・訂正、広告・アフィリエイト、免責の方針を示します。",
    type: "reference", topic: "financial-modeling", level: "参考", readingTime: "5分", keywords: ["編集方針", "出典", "訂正", "免責"], featured: false,
  },
];

export function getRelatedContent(href: string, limit: number): ContentEntry[] {
  const current = contentCatalog.find((item) => item.href === href);
  const safeLimit = Math.max(0, Math.floor(limit));
  const seen = new Set<string>([href]);

  return contentCatalog
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .sort((a, b) => {
      const aTopicMatch = Number(a.topic === current?.topic);
      const bTopicMatch = Number(b.topic === current?.topic);
      return bTopicMatch - aTopicMatch || Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, "ja");
    })
    .slice(0, safeLimit);
}
