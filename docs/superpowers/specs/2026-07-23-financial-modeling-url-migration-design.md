# Financial Modeling Lab URL Migration Design

## 目的

Finance Modeling Lab の GitHub Pages URL を、内容が直感的に伝わる
`https://arsenal23vm-netizen.github.io/financial-modeling-lab/` に変更する。
既存の検索流入、外部リンク、ブックマークを失わないよう、旧 URL から新 URL
へ自動転送する。

## 採用方式

- 現在の本体リポジトリ `ma-modeling-lab` を `financial-modeling-lab` に改名する。
- 本体サイトの GitHub Pages 用 base path、canonical URL、Open Graph URL、
  sitemap、robots、フォームの GitHub リンク、検証スクリプト、package 名を
  新名称へ統一する。
- 改名後、旧名称 `ma-modeling-lab` の公開リポジトリを新規作成し、
  GitHub Pages で新 URL へ転送する最小ページだけを配信する。
- 旧ページは JavaScript だけに依存せず、`meta refresh`、canonical、
  通常リンクを備える。

## URL と名称

- 新リポジトリ: `arsenal23vm-netizen/financial-modeling-lab`
- 新サイト: `https://arsenal23vm-netizen.github.io/financial-modeling-lab/`
- 旧サイト: `https://arsenal23vm-netizen.github.io/ma-modeling-lab/`
- npm package 名: `financial-modeling-lab`
- サイト表示名「Finance Modeling Lab 編集部」は変更しない。

## 本体サイトの変更範囲

1. `.github/workflows/deploy-pages.yml`
   - `PAGES_BASE_PATH`
   - `NEXT_PUBLIC_BASE_PATH`
   - `NEXT_PUBLIC_SITE_URL`
2. `package.json` と `package-lock.json`
   - package 名
3. `src/app`、`src/lib`、`src/components`
   - canonical、metadataBase、Open Graph、sitemap、robots、GitHub Issue URL
4. `scripts`
   - URL を検証する期待値
5. リポジトリ説明・ローカル Git remote

## 旧 URL 転送サイト

旧リポジトリは次の静的ファイルだけを保持する。

- `index.html`: 新 URL への転送、canonical、案内文、通常リンク
- `404.html`: 旧 URL 配下の深いリンクから新サイトの同一パスへ転送
- `.nojekyll`: GitHub Pages の静的配信を安定させる

`404.html` は旧 base path を除いたパス、クエリ、ハッシュを新 URL に引き継ぐ。
これにより、たとえば旧 `/ma-modeling-lab/valuation` は新
`/financial-modeling-lab/valuation` へ移動する。

## 検証基準

- リポジトリ内に、転送用成果物を除いて旧本体 URL・旧 base path が残らない。
- ESLint、既存の全検証スクリプト、Next.js production build が成功する。
- build は `/financial-modeling-lab` を base path として生成される。
- 新 GitHub Actions の Pages デプロイが成功する。
- 新 URL が HTTP 200 で表示され、代表ページと Excel ダウンロードが取得できる。
- 旧 URL が転送ページを返し、新 URL へ遷移できる。

## ロールバック

公開に失敗した場合は、新リポジトリの直前コミットへ戻さず、失敗原因を修正して
再デプロイする。リポジトリ改名自体の取り消しは最終手段とし、旧 URL 転送
リポジトリは新サイトの公開確認が終わるまで作成しない。
