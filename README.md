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

本番ビルド確認:

```bash
npm run build
```

## 主なページ

- `/` 学習ロードマップとサイト概要
- `/model-design` モデル設計
- `/assumptions` 前提条件・シナリオ管理
- `/revenue-kpi` KPIベースの売上計画
- `/pl-model` PL設計
- `/bs-model` BS設計
- `/cf-model` CF設計
- `/excel-functions` Excel関数
- `/books` 推薦書籍
- `/tools` 実務ツール
- `/request` リクエスト
- `/privacy` プライバシーポリシー
- `/disclaimer` 免責事項

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
