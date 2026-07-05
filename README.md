# M&A Modeling Lab

非上場企業M&Aの財務モデリングを、設計思想からExcel実装まで体系的に学ぶ独立Webサイトです。既存のArsenalサイトとはコード・公開設定ともに分離しています。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。本番確認は `npm run build` と `npm start` です。

## ページ構成

- `/` 学習ロードマップとサイト概要
- `/model-design` モデル基本設計
- `/assumptions` 前提条件・シナリオ管理
- `/revenue-kpi` KPIベースの売上計画
- `/three-statements` 財務三表連動
- `/roadmap` 実務の構築・レビュー工程
- `/tools` KPIジェネレーターとチェックリスト
- `/disclaimer` 免責事項

## 技術構成

Next.js App Router、TypeScript、React、Tailwind CSS v4。記事ページはServer Component、操作ツールと検索だけをClient Componentにしています。

## 公開前の設定

`main` ブランチへのpushでGitHub Actionsが静的サイトを構築し、GitHub Pagesへ公開します。公開URLは `https://arsenal23vm-netizen.github.io/ma-modeling-lab/` です。

## コンテンツ追加

1. `src/app/<slug>/page.tsx` に記事を追加します。
2. `src/data/site.ts` の `lessons` と `navItems` に導線を追加します。
3. ページ固有の `metadata` にタイトルと説明を設定します。
4. 数式、出所、免責事項、モデルチェックの有無をレビューします。
