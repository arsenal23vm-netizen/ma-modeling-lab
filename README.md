# Finance Modeling Lab

非上場企業M&Aの財務モデリングを、設計思想からExcel実装まで体系的に学ぶWebサイトです。

公開URL:

```txt
https://arsenal23vm-netizen.github.io/ma-modeling-lab/
```

## 起動方法

```bash
npm install
npm run dev
```

ローカル確認:

```txt
http://localhost:3000
```

GitHub Pages向けの本番ビルド確認（PowerShell）:

```powershell
$env:PAGES_BASE_PATH='/ma-modeling-lab'
npx.cmd next build --webpack
npm.cmd run validate:growth-static
```

深いWindows worktreeでは、既定のTurbopackビルドが生成ファイルのパス長上限に達するため、Pages向け検証では上記のwebpackコマンドを使います。Next.js設定は変更しません。

## 主なページ

- `/` 学習ロードマップとサイト概要
- `/model-design` モデル設計
- `/assumptions` 前提条件・シナリオ管理
- `/revenue-kpi` KPIベースの売上計画
- `/pl-model` PL設計
- `/bs-model` BS設計
- `/cf-model` CF設計
- `/three-statements` 財務三表の連動
- `/comps-peer-selection` Comps選定：類似会社の選定・除外判断とレビュー観点
- `/excel-functions` Excel関数
- `/books` 推薦書籍
- `/tools` 実務ツール
- `/request` リクエスト
- `/privacy` プライバシーポリシー
- `/disclaimer` 免責事項

## オーガニックグロース基盤

次のトピックハブ、DCF講座、Excel教材ランディングページを公開しています。

- `/financial-modeling`
- `/valuation`
- `/ma-modeling`
- `/excel-templates`
- `/valuation/dcf`
- `/valuation/dcf/fcff`
- `/valuation/dcf/wacc`
- `/valuation/dcf/terminal-value`
- `/valuation/dcf/sensitivity-analysis`
- `/valuation/dcf/enterprise-to-equity`
- `/downloads/dcf-valuation-model`

DCF講座とWorkbookは、`src/data/dcf-series.ts` の共有ケースを単一のデータソースとして使います。記事の著者表記は `Finance Modeling Lab 編集部` に統一しています。

標準準拠の9シートDCF Workbookは、次のコマンドで決定論的に再生成し、構造と数式を検証できます。

```bash
npm run generate:dcf-workbook
npm run test:dcf-workbook
```

オーガニックグロース基盤の全Validatorは次のとおりです。`validate:growth-static` はGitHub PagesのbasePathで静的Exportを作成した後に実行します。

```bash
npm run validate:dcf-series
npm run validate:editorial
npm run validate:catalog
npm run validate:growth-pages
npm run validate:dcf-landing
npm run test:dcf-workbook
npm run validate:growth-static
npm run lint -- --max-warnings=0
npx tsc --noEmit
```

## Comps選定ワークシート

`/comps-peer-selection` では、対象会社プロファイル、候補12社の比較、除外判断、Peer Role、Review Memo、Checksを通じて、類似会社選定の考え方を学べます。Excel教材は次のコマンドで生成・検証できます。

```bash
npm run generate:comps-workbook
npm run test:comps-workbook
```

## アクセス解析

Google Analytics 4に対応しています。

ローカルでは `.env.local` に以下を設定してください。

```txt
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://arsenal23vm-netizen.github.io/ma-modeling-lab
```

GitHub Pagesの本番環境では、GitHubリポジトリの以下に登録します。

`Settings` → `Secrets and variables` → `Actions` → `Variables` → `New repository variable`

```txt
Name:
NEXT_PUBLIC_GA_ID

Value:
G-XXXXXXXXXX
```

実装済みイベント:

- `page_view`
- `amazon_click`
- `cta_click`
- `outbound_click`

将来拡張用イベント名:

- `newsletter_signup`
- `template_download`
- `contact_submit`
- `scroll_depth`
- `article_read_complete`

## SEO

以下を実装しています。

- `sitemap.xml`
- `robots.txt`
- ページごとのメタ情報
- OGP
- プライバシーポリシー

Search Consoleでは、以下のサイトマップを送信してください。

```txt
https://arsenal23vm-netizen.github.io/ma-modeling-lab/sitemap.xml
```

## 公開

`main` ブランチへのpushでGitHub Actionsが実行され、GitHub Pagesへ公開されます。
