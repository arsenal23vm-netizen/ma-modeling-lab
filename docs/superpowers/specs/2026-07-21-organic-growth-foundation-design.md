# Organic Growth Foundation Design

Date: 2026-07-21  
Status: User-approved design, pending written-spec review  
Author identity: Finance Modeling Lab 編集部

## 1. Objective

Finance Modeling Labへの非指名検索流入、教材ダウンロード、記事回遊を増やすため、以下の4施策を一体として実装する。

1. DCF関連の検索意図別解説ページを5本公開する。
2. 既存DCF Excel教材の専用ランディングページを公開する。
3. 著者、参考資料、公開日、更新日、変更履歴を記事単位で明示する。
4. トピックハブと全コンテンツ対応のサイト内検索を実装する。

成功条件は、検索エンジンと読者の双方が「どの順番で学ぶか」「誰が書いたか」「どのExcelを使うか」「次に何を読むか」を迷わず判断できることである。

## 2. Product approach

採用案は、5ページを独立記事の寄せ集めにせず、同一のサンプル企業を使う連続DCF講座として構成する方式とする。

- 各ページは単独の検索意図を満たす。
- 前後の記事、DCFハブ、Excel教材を相互リンクする。
- 用語、年度、税率、WACC、Terminal Growth、Net Debtの定義をシリーズ全体で統一する。
- 数式だけでなく、具体的な数値、Excelセル式、レビュー観点を必須とする。
- 大規模なブラウザ計算ツールは今回の範囲外とし、静的な計算例と感応度表に集中する。

## 3. Information architecture

### 3.1 DCF series

| Route | Primary search intent | Required content |
| --- | --- | --- |
| `/valuation/dcf` | DCF法 全体像 | 5ステップ、シリーズ目次、共通ケース、Excel導線 |
| `/valuation/dcf/fcff` | FCFF 計算方法 Excel | EBIT→NOPAT→FCFF、5年予測、Excel式 |
| `/valuation/dcf/wacc` | WACC 計算方法 Excel | Cost of Equity、Cost of Debt、資本構成、Excel式 |
| `/valuation/dcf/terminal-value` | 継続価値 計算 | Gordon Growth、Exit Multiple、クロスチェック |
| `/valuation/dcf/sensitivity-analysis` | DCF 感応度分析 Excel | WACC×永久成長率、Excel Data Table相当の作り方 |
| `/valuation/dcf/enterprise-to-equity` | EV 株主価値 違い | Cash、Debt、Debt-like Items、少数株主持分、1株価値 |

`/valuation/dcf`はハブであり、解説5ページには数えない。

### 3.2 Excel landing page

Route: `/downloads/dcf-valuation-model`

Required sections:

- 対象読者と到達点
- Workbookのシート構成
- Excelワークシートを模したHTMLプレビュー
- 青セル入力、計算セル、出力セル、Checksの説明
- 主要数式と5ページの対応表
- 対応Excel環境と教育目的の注意事項
- `/downloads/06_DCF評価モデル.xlsx`へのCTA（上部と下部）
- 関連するDCFシリーズへのリンク

ダウンロードをメール登録必須にはしない。

### 3.3 Topic hubs

| Route | Scope |
| --- | --- |
| `/financial-modeling` | 財務三表、前提条件、モデル品質、Excel関数 |
| `/valuation` | 非上場企業Valuation、DCF、Comps |
| `/ma-modeling` | M&Aモデル、買収会計、将来追加するPPA・Sources & Uses・LBO |
| `/excel-templates` | ダウンロード教材、ツール、教材別ランディングページ |

ハブは未公開ページへの空リンクを置かない。将来テーマは「今後追加する内容」として文章で示す。

## 4. Shared DCF case

`src/data/dcf-series.ts`を唯一のデータソースとし、各ページで同じケースを参照する。

### 4.1 Target company

- 会社名: サンプル部品株式会社
- 単位: 百万円
- 予測期間: FY2026–FY2030
- 税率: 30.0%
- WACC計算の前提: リスクフリーレート、株式リスクプレミアム、Beta、負債コスト、目標資本構成を明示
- Terminal Growth: 基本ケース1.5%
- Equity Bridge: Cash、Debt、退職給付等のDebt-like Items、非支配株主持分を明示

### 4.2 Required invariants

- `FCFF = EBIT × (1 − Tax Rate) + D&A − Capex − Increase in NWC`
- `Cost of Equity = Risk-free Rate + Beta × Equity Risk Premium`
- `After-tax Cost of Debt = Pre-tax Cost of Debt × (1 − Tax Rate)`
- `WACC = E/(D+E) × Cost of Equity + D/(D+E) × After-tax Cost of Debt`
- `Terminal Value = FCFF(n+1) / (WACC − g)`
- `Enterprise Value = PV of Explicit FCFF + PV of Terminal Value`
- `Equity Value = Enterprise Value + Cash − Debt − Debt-like Items − Non-controlling Interests`

表示値は共有データから計算し、ページごとの手入力で矛盾を作らない。

## 5. Editorial trust model

### 5.1 Identity

表示名は全記事で「Finance Modeling Lab 編集部」に統一する。実在しない資格、勤務先、案件経験、監修者は記載しない。

Aboutページに`#editorial-team`セクションを追加し、次を明示する。

- 実務で再現できる財務モデリング教材を編集するチーム名義であること
- 教育目的であり、個別案件の助言ではないこと
- 数式、会計処理、モデル間整合性を公開前に確認する方針
- 誤りの連絡先として既存リクエストページを案内すること

### 5.2 Article metadata

記事データには以下を持たせる。

- `authorName`
- `authorUrl`
- `publishedDate`
- `modifiedDate`
- `revisionSummary`
- `sources[]`（title、publisher、url、accessedDate）

既存8レッスンに加えて独立記事「財務三表を連動させる」、非上場企業Valuation、Comps選定、DCF新規5記事を対象とする。記事に直接対応する一次資料がない場合、無関係な参考文献を水増しせず、サイトの計算・編集方針へのリンクを示す。

### 5.3 Presentation and structured data

- 記事末尾に著者カード、参考資料、変更履歴を表示する。
- `Article` JSON-LDへauthor URL、publisher、datePublished、dateModifiedを追加する。
- 表示パンくずと同じ内容の`BreadcrumbList` JSON-LDを出力する。
- 更新日を全ページ一律にせず、記事データから取得する。

## 6. Content catalog and full-site search

`src/data/content-catalog.ts`を検索、ハブ、関連記事の共通レジストリとする。

Each entry contains:

- `href`
- `title`
- `summary`
- `type`: article / hub / download / tool / reference
- `topic`: financial-modeling / valuation / ma-modeling / excel
- `level`
- `readingTime`
- `keywords[]`
- `featured`

Search behavior:

- タイトル、要約、キーワード、種別を対象に検索する。
- 日本語の空白、英字の大小、全角・半角を正規化する。
- 空クエリではおすすめコンテンツを表示する。
- 結果に種別とトピックを表示する。
- 新規DCF記事、Valuation、Comps、仕訳、品質基準、全Excel教材、ツールを含める。
- 結果ゼロ時にリクエストページへの導線を出す。

関連記事は現在の先頭3件ではなく、同一topicを優先し、現在ページを除外する。

## 7. Navigation and discoverability

- Headerは主要ハブを優先して表示し、個別ページの過密な列挙を減らす。
- Homeに「学習テーマから探す」4ハブの導線を追加する。
- Valuationハブから非上場Valuation、Comps、DCFシリーズへ接続する。
- Excel Templatesハブから各教材と専用DCFランディングページへ接続する。
- 新規全URLをsitemapへ登録する。
- 各ページに固有title、description、canonical、Open Graphの基本情報を持たせる。

## 8. Components and boundaries

New shared units:

- `DcfLessonShell`: DCFシリーズのhero、目次、前後導線、Excel CTA
- `DcfWorkbookPreview`: Excel風プレビュー
- `EditorialByline`: 著者、公開日、更新日
- `SourcesList`: 参考資料
- `RevisionHistory`: 変更履歴
- `Breadcrumbs`: 表示とJSON-LD用データを共有
- `TopicHub`: ハブのカードと学習順序
- `content-catalog.ts`: 検索と関連記事の単一データソース

既存`ArticleShell`は編集情報と関連記事の共通ロジックを利用するよう拡張する。DCF固有の計算ロジックを`ArticleShell`へ入れない。

## 9. Error and edge-case handling

- WACCがTerminal Growth以下の場合は計算不能であることを明示し、表示用計算関数は例外または`N/A`を返す。
- 感応度表の全セルで`WACC > g`を検証する。
- 検索カタログの重複hrefを禁止する。
- カタログに存在する内部リンクが実在routeまたはpublic fileを指すことを検証する。
- 参考URLは外部リンクとして新しいタブで開き、`noopener noreferrer`を付ける。
- Excelファイルが存在しない場合にランディングページの検証を失敗させる。

## 10. Testing and acceptance

Add focused validation scripts before implementation:

1. DCF shared-case validator
   - Formula invariants
   - WACC and Terminal Growth guard
   - Enterprise-to-Equity reconciliation
   - Sensitivity matrix dimensions and valid cells
2. Route/content validator
   - Hub plus 5 lesson routes
   - DCF Excel landing page and two CTAs
   - Required headings, formulas and numeric example
3. Editorial validator
   - Author identity
   - Dates and revision summary
   - Sources section
   - Article and BreadcrumbList JSON-LD
4. Catalog/search validator
   - Unique hrefs
   - Coverage of existing and new content
   - Japanese/English query matches
   - Same-topic related content
5. Project gates
   - `eslint --max-warnings=0`
   - production build
   - static export contains every new route
   - no broken internal links in generated HTML

Visual acceptance covers desktop and 390px mobile for the DCF hub, one formula-heavy article, the Excel landing page and search dialog. Tables must scroll horizontally without clipping the page.

## 11. Non-goals

- メールマガジン、RSS、SNS共有ボタンの実装
- ブラウザ上のフルDCF計算ツール
- 新しいExcelファイルの作り直し
- PPA、LBO、Sources & Usesの本文記事
- 実在しない個人経歴や資格の掲載
- FAQリッチリザルトを目的としたFAQ量産

## 12. Delivery

Implementation is complete only when:

- all new and modified pages pass the focused validators;
- the existing DCF workbook remains downloadable;
- search covers all catalog entries;
- production build succeeds with no lint warnings;
- the changes are reviewed, merged to `main`, pushed, and the published URLs return HTTP 200.
