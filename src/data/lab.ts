export const caseCompany = {
  name: "モデル製作株式会社",
  unit: "百万円",
  yearEnd: "3月決算",
  actuals: [
    { year: "2024年度実績", revenue: 1000, ebitda: 140 },
    { year: "2025年度実績", revenue: 1100, ebitda: 165 },
  ],
  forecastYears: ["2026年度", "2027年度", "2028年度", "2029年度", "2030年度"],
  scenarios: ["Base", "Upside", "Downside"],
};

export const roadmapSteps = [
  { no: 1, title: "会計とExcelの基礎", goal: "PL・BS・CFのつながりとExcelの基本参照を理解する", prerequisite: "簿記3級程度の勘定科目", time: "2〜3時間", href: "/three-statements", file: "01_仕訳演習.xlsx", done: "主要仕訳が3表へ流れる方向を説明できる" },
  { no: 2, title: "モデル構造とシート設計", goal: "入力・計算・出力・チェックを分けたモデル骨格を作る", prerequisite: "Excelの四則演算とシート参照", time: "2時間", href: "/model-design", file: "02_前提条件入力.xlsx", done: "入力、前提、PL、BS、CF、チェックの役割を分けられる" },
  { no: 3, title: "前提条件とシナリオ", goal: "Base、Upside、Downsideを切り替えられる前提シートを作る", prerequisite: "売上・費用・運転資本の基本", time: "2〜4時間", href: "/assumptions", file: "02_前提条件入力.xlsx", done: "選択シナリオに応じて主要前提が切り替わる" },
  { no: 4, title: "PLモデル", goal: "売上高、原価、販管費、税金を事業ドライバーから予測する", prerequisite: "損益計算書の構造", time: "3〜5時間", href: "/pl-model", file: "03_PLモデル練習.xlsx", done: "売上高から当期純利益までが前提シートから連動する" },
  { no: 5, title: "BSモデル", goal: "運転資本、固定資産、借入金、純資産をロールフォワードする", prerequisite: "BSの主要科目", time: "4〜6時間", href: "/bs-model", file: "04_BS_CF統合練習.xlsx", done: "売掛金・棚卸資産・買掛金・固定資産が補助明細から連動する" },
  { no: 6, title: "CFモデルと三表統合", goal: "PLとBSの増減から間接法CFを組み、現金をBSへ戻す", prerequisite: "PL/BSモデルの完成", time: "4〜6時間", href: "/cf-model", file: "05_完成3表モデル.xlsx", done: "BS一致とCF一致のチェックがOKになる" },
  { no: 7, title: "DCFと感応度分析", goal: "FCF、WACC、継続価値、感応度表を作る", prerequisite: "三表統合モデル", time: "3〜5時間", href: "/tools", file: "06_DCF評価モデル.xlsx", done: "事業価値と株主価値を前提別に説明できる" },
  { no: 8, title: "品質レビューと引継ぎ", goal: "100点満点の品質基準でモデルを自己点検する", prerequisite: "完成モデル", time: "1〜2時間", href: "/quality-standard", file: "07_モデル品質チェックリスト.xlsx", done: "レビュー結果と残論点を第三者へ引き継げる" },
];

export const qualityCriteria = [
  { area: "構造・シート設計", points: 20, checks: ["入力・計算・出力が分離されている", "期間軸・単位・符号規則が統一されている"] },
  { area: "前提条件とハードコード管理", points: 15, checks: ["手入力セルが識別できる", "予測期間の定数埋込みが限定されている"] },
  { area: "数式・参照の一貫性", points: 20, checks: ["横方向コピーで式が崩れない", "他シート参照の方向が整理されている"] },
  { area: "財務三表の連動性", points: 15, checks: ["PL純利益がCFとBS純資産へ接続する", "現金増減がBS現金へ接続する"] },
  { area: "チェック・エラー検知", points: 15, checks: ["BS一致、CF一致、ロールフォワードを自動判定する", "異常時に差額とエラー名が表示される"] },
  { area: "シナリオ・感応度", points: 5, checks: ["Base/Upside/Downsideを切り替えられる", "主要価値ドライバーの感応度を確認できる"] },
  { area: "可読性・引継ぎやすさ", points: 10, checks: ["使い方シートや注記がある", "レビュー者が前提と計算の出所を追える"] },
];

export const journalEntries = [
  { title: "売上計上と売掛金", transaction: "製品を120で掛販売した。原価は72。", debit: "売掛金 120 / 売上原価 72", credit: "売上高 120 / 棚卸資産 72", impact: "PLは売上高+120、売上原価+72。BSは売掛金+120、棚卸資産-72、利益剰余金+税後利益。CFは当期純利益から売掛金増加を控除。", excel: "PL!H10、BS!H20、BS!H25、CF!H18", caution: "売上と入金を混同せず、売掛金回転日数でBSを予測する。" },
  { title: "売掛金の入金", transaction: "前月売上のうち100が普通預金へ入金された。", debit: "普通預金 100", credit: "売掛金 100", impact: "PL影響なし。BSは現金+100、売掛金-100。CFは売掛金減少として営業CFにプラス。", excel: "BS!H15、BS!H20、CF!H18", caution: "入金時に売上を二重計上しない。" },
  { title: "仕入と買掛金", transaction: "材料を80で掛仕入した。", debit: "棚卸資産 80", credit: "買掛金 80", impact: "仕入時点ではPL影響なし。BSは棚卸資産+80、買掛金+80。CFは買掛金増加として営業CFにプラス。", excel: "BS!H25、BS!H45、CF!H20", caution: "売上原価は販売時または期末振替で認識する。" },
  { title: "給与と未払費用", transaction: "当月給与30を計上し、うち5は未払。", debit: "給与手当 30", credit: "普通預金 25 / 未払費用 5", impact: "PLは人件費+30。BSは現金-25、未払費用+5。CFは未払費用増加を営業CFに加算。", excel: "PL!H30、BS!H15、BS!H50、CF!H21", caution: "発生主義でPL計上し、支払との差額をBSへ残す。" },
  { title: "固定資産取得と減価償却", transaction: "設備を200で取得し、年間40を減価償却した。", debit: "機械装置 200 / 減価償却費 40", credit: "普通預金 200 / 減価償却累計額 40", impact: "PLは減価償却費+40。BSは固定資産純額+160、現金-200。CFは減価償却費を営業CFで加算、設備投資を投資CFで控除。", excel: "計算明細!H40、PL!H35、BS!H30、CF!H24、CF!H32", caution: "減価償却費は非資金費用としてCFで足し戻す。" },
  { title: "借入と支払利息", transaction: "借入金300を実行し、利息9を計上、うち1は未払。", debit: "普通預金 300 / 支払利息 9", credit: "借入金 300 / 普通預金 8 / 未払利息 1", impact: "PLは支払利息+9。BSは現金+292、借入金+300、未払利息+1。CFは借入を財務CF、利息を営業CFまたは財務CF方針に従い表示。", excel: "計算明細!H60、PL!H42、BS!H55、CF!H42", caution: "平均借入残高と金利で利息を計算し、未払分をBSへ残す。" },
  { title: "法人税と未払法人税", transaction: "税引前利益50に対し法人税15を計上、期末未払。", debit: "法人税等 15", credit: "未払法人税等 15", impact: "PLは法人税等+15。BSは未払法人税等+15、利益剰余金は税後利益分増加。CFは未払法人税等増加を営業CFに加算。", excel: "PL!H55、BS!H52、CF!H22", caution: "簡略モデルでは実効税率を使うが、繰欠や一時差異がある場合は別途確認する。" },
  { title: "税効果会計の基本例", transaction: "賞与引当金10に税率30%の将来減算一時差異を認識した。", debit: "繰延税金資産 3", credit: "法人税等調整額 3", impact: "PLは税金費用が3減少。BSは繰延税金資産+3。CFでは非資金項目として税金費用と税金支払の差を調整。", excel: "BS!H34、PL!H56、CF!H23", caution: "回収可能性の判断は簡略化せず、実務では専門家確認が必要。" },
];

export const downloads = [
  { file: "01_仕訳演習.xlsx", audience: "会計仕訳を3表へつなげたい方", content: "決算整理仕訳、借方・貸方チェック、PL・BS・CFへの影響", size: "約11KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "02_前提条件入力.xlsx", audience: "前提シートとシナリオを作りたい方", content: "Base / Upside / Downsideの売上前提、計算結果、方向性チェック", size: "約13KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "03_PLモデル練習.xlsx", audience: "PLを事業前提から組みたい方", content: "入力、PL、売上総利益の数式、モデルチェック", size: "約11KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "04_BS_CF統合練習.xlsx", audience: "BSとCFの連動を練習したい方", content: "売掛金、設備投資、期末現金、BS・CF連動、計算明細、チェック", size: "約13KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "05_完成3表モデル.xlsx", audience: "完成モデルの構造を確認したい方", content: "表紙、入力、前提、PL、BS、CF、計算明細、チェック", size: "約15KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "06_DCF評価モデル.xlsx", audience: "DCFと感応度分析へ進みたい方", content: "表紙からチェックまでの9シート、FCFF、WACC、継続価値、Enterprise Value、Equity Value、5×5感応度", size: "約21KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "07_モデル品質チェックリスト.xlsx", audience: "モデルレビューを標準化したい方", content: "品質基準、レビュー結果、重要指摘の未対応件数チェック", size: "約11KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
  { file: "類似会社選定ワークシート.xlsx", audience: "類似会社の選定根拠を整理したい方", content: "対象会社の事業特性、候補12社、比較会社選定表、比較上の位置づけ、検討記録、チェック", size: "約23KB", updated: "2026-07-22", terms: "教育目的・再配布不可" },
];
