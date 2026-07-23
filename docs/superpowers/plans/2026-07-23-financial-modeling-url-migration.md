# Financial Modeling Lab URL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finance Modeling Lab を新しい GitHub Pages URL に移行し、旧 URL から転送する。

**Architecture:** 本体は既存 Next.js 静的サイトの base path と絶対 URL を一括して新名称へ変更する。GitHub 上で本体リポジトリを改名した後、旧名称の最小リポジトリを作成し、静的な転送ページを GitHub Pages で公開する。

**Tech Stack:** Next.js 16、TypeScript、GitHub Actions、GitHub Pages、静的 HTML

## Global Constraints

- 新サイト URL は `https://data-lab-23.github.io/financial-modeling-lab/` とする。
- 旧サイト URL は `https://arsenal23vm-netizen.github.io/ma-modeling-lab/` とする。
- サイト表示名「Finance Modeling Lab 編集部」は変更しない。
- 旧 URL のパス、クエリ、ハッシュを可能な限り新 URL へ引き継ぐ。
- 既存の Excel ダウンロードファイルと Formspree 受付機能を維持する。

---

### Task 1: URL 移行の回帰検証

**Files:**
- Create: `scripts/validate-site-url-migration.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: リポジトリ内のテキストファイル
- Produces: `npm run validate:url-migration`

- [ ] **Step 1: Write the failing validation**

`scripts/validate-site-url-migration.ts` に、workflow、package 名、主要 metadata、
robots、sitemap、Issue URL が新名称を使い、本体コードに旧 URL が残っていない
ことを検証する処理を書く。`package.json` に
`"validate:url-migration": "tsx scripts/validate-site-url-migration.ts"` を追加する。

- [ ] **Step 2: Run it to verify RED**

Run: `npm.cmd run validate:url-migration`

Expected: FAIL。現在の `ma-modeling-lab` が検出される。

- [ ] **Step 3: Commit the failing validation**

Run:
`git add package.json scripts/validate-site-url-migration.ts`
`git commit -m "test: define financial modeling URL migration"`

### Task 2: 本体サイトの名称と URL 更新

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/app/**/*.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/page-metadata.ts`
- Modify: `src/components/EditorialDetails.tsx`
- Modify: `src/components/request-form.tsx`
- Modify: `scripts/validate-*.ts`
- Modify: `scripts/validate-*.tsx`

**Interfaces:**
- Consumes: Task 1 の `validate:url-migration`
- Produces: `/financial-modeling-lab` を前提とした静的サイト

- [ ] **Step 1: Replace production URL values**

本体サイトと検証スクリプトの
`https://arsenal23vm-netizen.github.io/ma-modeling-lab` を
`https://data-lab-23.github.io/financial-modeling-lab` に更新する。
workflow の `/ma-modeling-lab` を `/financial-modeling-lab` に更新し、
package 名を `financial-modeling-lab` にする。

- [ ] **Step 2: Run the migration validation to verify GREEN**

Run: `npm.cmd run validate:url-migration`

Expected: PASS with `Site URL migration validation passed.`

- [ ] **Step 3: Run local quality checks**

Run:
`npm.cmd run lint`
`npm.cmd run validate:dcf-series`
`npm.cmd run validate:editorial`
`npm.cmd run validate:catalog`
`npm.cmd run validate:growth-pages`
`npm.cmd run validate:dcf-landing`
`npm.cmd run validate:growth-static`
`npm.cmd run validate:comps-case`
`npm.cmd run validate:language`
`npm.cmd run test:dcf-workbook`
`npm.cmd run test:comps-workbook`
`npm.cmd run test:learning-workbooks`

Expected: 全コマンド exit 0。

- [ ] **Step 4: Run the production build**

Run:
`$env:PAGES_BASE_PATH='/financial-modeling-lab'; $env:NEXT_PUBLIC_BASE_PATH='/financial-modeling-lab'; $env:NEXT_PUBLIC_SITE_URL='https://data-lab-23.github.io/financial-modeling-lab'; npm.cmd run build`

Expected: exit 0、静的ページ生成完了。

- [ ] **Step 5: Commit**

Run:
`git add .github package.json package-lock.json src scripts`
`git commit -m "feat: move site to financial modeling URL"`

### Task 3: GitHub リポジトリ改名と本体公開

**Files:**
- Modify external: GitHub repository settings
- Modify local: Git remote URL

**Interfaces:**
- Consumes: Task 2 の検証済みコミット
- Produces: `data-lab-23/financial-modeling-lab`

- [ ] **Step 1: Rename the GitHub repository**

GitHub API または認証済み GitHub CLI で `ma-modeling-lab` を
`financial-modeling-lab` に改名する。

- [ ] **Step 2: Update the local remote**

Run:
`git remote set-url origin https://github.com/data-lab-23/financial-modeling-lab.git`

Expected: `git remote -v` が新 URL を表示する。

- [ ] **Step 3: Publish the verified commit**

Run:
`git push origin HEAD:main`

Expected: push succeeds。

- [ ] **Step 4: Verify GitHub Pages deployment**

Actions の最新 Pages workflow が success になるまで確認する。

Expected: build と deploy が success。

### Task 4: 旧 URL 転送サイト

**Files:**
- Create external repository: `data-lab-23/ma-modeling-lab`
- Create in redirect repository: `index.html`
- Create in redirect repository: `404.html`
- Create in redirect repository: `.nojekyll`

**Interfaces:**
- Consumes: 公開済み新サイト URL
- Produces: 旧 URL からの転送

- [ ] **Step 1: Create redirect files locally**

`index.html` は canonical、meta refresh、案内文、通常リンクを新 URL に向ける。
`404.html` は `location.replace()` を使い、旧 base path を除いた pathname、
search、hash を新 base path に連結する。

- [ ] **Step 2: Validate redirect behavior**

静的検証で canonical、meta refresh、新 base path、パス引継ぎ処理が存在する
ことを確認する。

Expected: 全検証が PASS。

- [ ] **Step 3: Create and publish the legacy repository**

公開リポジトリ `ma-modeling-lab` を作成し、転送ファイルを main branch に push
して GitHub Pages を有効化する。

- [ ] **Step 4: Verify both public URLs**

新トップ、代表記事、Excel ダウンロードが HTTP 200 であることを確認する。
旧トップと旧深いリンクが新 URL へ遷移することを確認する。

Expected: 新サイトが利用可能で、旧サイトから転送される。

### Task 5: 最終監査

**Files:**
- No production file changes expected

**Interfaces:**
- Consumes: 新旧の公開サイト
- Produces: 完了判定

- [ ] **Step 1: Re-run repository verification**

Run:
`npm.cmd run validate:url-migration`
`npm.cmd run lint`
`npm.cmd run build`

Expected: 全コマンド exit 0。

- [ ] **Step 2: Confirm Git and deployment state**

Run:
`git status --short`
`git log -3 --oneline`
`git remote -v`

Expected: worktree clean、main に公開済み、新 remote URL。

- [ ] **Step 3: Report exact URLs and evidence**

新 URL、旧転送 URL、Actions 結果、検証結果を利用者へ報告する。
