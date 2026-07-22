export const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/financial-modeling", label: "財務モデリング" },
  { href: "/valuation", label: "Valuation" },
  { href: "/ma-modeling", label: "M&Aモデル" },
  { href: "/excel-templates", label: "Excel教材" },
];

export const lessons = [
  { slug:"model-design", no:"01", title:"壊れにくいM&Aモデルの設計", summary:"入力・計算・出力を分離し、第三者が検証できるモデルの骨格を作る。", time:"12分", level:"基礎" },
  { slug:"assumptions", no:"02", title:"前提条件とシナリオ管理", summary:"事業計画、取引条件、資金調達の前提を一元管理する。", time:"14分", level:"基礎" },
  { slug:"revenue-kpi", no:"03", title:"売上高をKPIから分解する", summary:"数量×単価など、事業の因果関係をExcelへ落とす。", time:"16分", level:"実践" },
  { slug:"pl-model", no:"04", title:"損益計算書（PL）の設計", summary:"売上高から当期純利益までを、前提条件と事業ドライバーで予測する。", time:"22分", level:"実践" },
  { slug:"bs-model", no:"05", title:"貸借対照表（BS）の設計", summary:"運転資本、固定資産、借入金、純資産をロールフォワードする。", time:"24分", level:"実践" },
  { slug:"cf-model", no:"06", title:"キャッシュ・フロー計算書（CF）の設計", summary:"PLとBSの増減から現金を導き、返済能力を検証する。", time:"24分", level:"実践" },
  { slug:"excel-functions", no:"07", title:"実務で使うExcel関数と参照設計", summary:"XLOOKUP、INDEX、SUMIFSなどで前提から出力までを一方向につなぐ。", time:"26分", level:"応用" },
  { slug:"roadmap", no:"08", title:"完成までの実務ロードマップ", summary:"データ受領からレビュー、感応度分析、意思決定資料までを整理する。", time:"10分", level:"実務" },
];
