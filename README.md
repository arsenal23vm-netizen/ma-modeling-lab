# クアトロマップ大阪

大阪市でクアトロフォルマッジを提供するピザ屋・イタリアンを、地図・提供確認状況・Google評価・はちみつ有無などから探すMVPです。現在の店舗情報はすべて架空のサンプルデータです。

## 技術スタック

Next.js 16 / React 19 / TypeScript / App Router / Tailwind CSS 4 / Google Maps JavaScript API（Advanced Marker）/ Supabase・PostgreSQL想定

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000` を開きます。検証は `npm run lint` と `npm run build` で行えます。

## Google Maps APIキー

Google Cloud Consoleで Maps JavaScript API を有効化し、`.env.local` に次を設定します。

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

キーにはHTTPリファラー制限とAPI制限を設定してください。未設定でもアプリは停止せず、地図部分に案内カードを表示します。Advanced Marker用のMap IDはMVPでは `DEMO_MAP_ID` です。本番では自分のMap IDに差し替えてください。

## 店舗データの更新・追加

`src/data/shops.ts` の `shops` 配列を編集します。型は `src/types/shop.ts` にあります。新しい店舗は一意な `id` と `slug`、区情報、緯度経度を設定し、確認ソースがない限り `verificationStatus: "needs_confirmation"` にしてください。本番データでは `sample: false` とします。区は `src/data/wards.ts` で管理します。

Supabaseへ移行する場合は `supabase/schema.sql` をSQL Editorで実行し、`src/lib/shops.ts` の読み取り処理をSupabaseクライアントへ置き換えます。RLSは公開済み店舗の読み取りだけを許可しています。

## 確認ステータス

- `verified_official`: 公式メニューなど一次情報で提供を確認
- `verified_review`: 口コミ・ユーザー投稿で提供を確認
- `needs_confirmation`: 現在の提供状況を確認中
- `possibly_discontinued`: 提供終了の可能性がある

## Google由来データと独自データ

Google Places由来の `place_id`、評価、口コミ数、Maps URLと、運営が確認するメニュー・価格・はちみつ・確認日・確認URL・紹介文は別フィールドで管理します。Places情報だけではクアトロフォルマッジの現在の提供を保証できないためです。口コミ全文を保存する設計にはしていません。

Google由来データを本番で取得・表示・キャッシュする際は、Google Maps Platformの最新の利用規約、帰属表示、保存期間、削除要件を必ず確認してください。APIキーを公開リポジトリへコミットせず、Google由来データを独自確認情報として表示しないでください。

## 主なルート

- `/`: 地図、絞り込み、並び替え、店舗一覧
- `/shops/[slug]`: 店舗詳細と構造化データ
- `/osaka/[wardSlug]`: 区別一覧
- `/submit`: 掲載・修正依頼フォーム（MVPではブラウザ内で完了表示）

## TODO

- Supabaseへのデータ移行と認証付き管理画面
- Places APIとの定期同期、取得日時・削除ポリシーの実装
- 投稿フォームのサーバー保存、スパム対策、通知
- 実店舗の一次情報調査と公開承認フロー
- 京都・神戸・東京への地域展開、Map IDの本番化
- E2Eテスト、アクセシビリティ監査、OG画像

## Google Places候補収集パイプライン

Google Places APIは候補発見の補助に限り、サイト表示時には呼びません。候補は `data/place-candidates-osaka.json`、キャッシュ・利用ログは `data/` 以下へ保存します。Google由来の候補は、スコアにかかわらず `needs_confirmation` 相当です。人間が公式サイト、公式SNS、メニュー、電話等で確認するまで店舗として公開しません。

### 無料枠内に収めるための運用方針

- APIは毎日自動実行せず、候補収集は月1回程度にする
- 通常は `places:plan`、`places:score`、`places:export` を使う
- 実API実行には `--execute-api`、`PLACES_COLLECTOR_DRY_RUN=false`、対話確認のすべてが必要
- 1回20、1日100、月1000リクエストをローカル上限とする（無料枠を保証する値ではありません）
- 最初は大阪市全体と高優先度エリアだけ収集する
- キャッシュを30日利用し、同じ検索のAPI再実行を避ける
- Place Detailsは必要な候補だけ、最大10件ずつ手動実行する
- Reviews取得は原則使わず、初期MVPでは機能自体を実装しない
- サイト表示時にPlaces APIを呼ばず、自前DBとCSVを中心に運用する
- Supabaseへの投入は自動化せず、人間の確認後に行う

ローカル上限や予算アラートは料金発生を保証して防ぐものではありません。料金・SKU・無料利用枠は変更され得るため、実行前にGoogle Cloudの最新情報を確認してください。

### サーバー専用キー

`.env.local` に設定します。`GOOGLE_PLACES_API_KEY` は候補収集CLIだけが読みます。`NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` は作成禁止で、クライアントコードへ渡さないでください。

```env
GOOGLE_PLACES_API_KEY=your_server_key
PLACES_COLLECTOR_DRY_RUN=true
```

実行時だけ `PLACES_COLLECTOR_DRY_RUN=false` に変更し、終了後は `true` に戻す運用を推奨します。`.env.local`、キャッシュ、出力、ログはGit管理対象外です。

### コマンド

```bash
npm run places:plan -- --city osaka
npm run places:plan -- --city osaka --ward kita --max-queries 2
npm run places:collect -- --city osaka
npm run places:score
npm run places:export -- --format csv
npm run places:export -- --format json
npm run places:quota
npm run places:import-shops
npm run places:all -- --city osaka
```

`places:plan` は常にAPIを呼びません。`places:collect` もデフォルトはdry-runです。実収集は、予定件数とGoogle Cloud側の割当を確認してから次のように少量で実行します。

```bash
# .env.local の PLACES_COLLECTOR_DRY_RUN=false を確認
npm run places:collect -- --city osaka --limit 20 --max-requests 2 --execute-api
```

その後、端末で「実行」と入力した場合だけAPIを呼びます。`--max-requests` を大きく指定しても環境変数の1回上限を超えません。広め検索は `--strategy broad-pizzeria` の明示時だけ有効で、最大10クエリです。

Detailsは通常無効です。`PLACES_ENABLE_DETAILS=true`、`PLACES_COLLECTOR_DRY_RUN=false`、`--execute-api`、対話確認がすべて揃った場合だけ、公式サイトURL等が未取得の候補を最大10件処理します。レビューはFieldMaskに含みません。

```bash
npm run places:details -- --limit 5 --execute-api
```

### 推奨運用フロー

1. `npm run places:plan -- --city osaka` でAPIを使わず計画を見る
2. `npm run places:collect -- --city osaka` でdry-runを確認する
3. `npm run places:collect -- --city osaka --limit 20 --max-requests 2 --execute-api` で少量収集する
4. `npm run places:score` でローカルスコアリングする
5. `npm run places:export -- --format csv` でUTF-8 BOM付きCSVを作る
6. CSVを人間が確認し、確認結果をローカル候補JSONへ反映する
7. 公式確認済みだけ `manualCheckStatus: "confirmed_official"` にする
8. `npm run places:import-shops` で昇格候補をdry-run確認する
9. 必要な店舗だけ `src/data/shops.ts` または管理DBへ手動追加する

### Google Cloud側で必ず行う設定

CodexからCloud Consoleの設定はできません。Google Cloudプロジェクトと請求先を設定し、Places API (New) を有効化してサーバー専用APIキーを作成してください。キーにはAPI制限を適用し、Places APIだけを許可します。実行環境が固定IPならIP制限も設定します。

Billingで低額の予算アラートを複数段階に設定し、API Quotasで強制的な日次上限も設定してください。予算アラートは通知であり、自動停止機能ではない点に注意してください。推奨する初期割当は Text Search 100件/日以下、Place Details 20件/日以下、Nearby Searchは無効または極小です。初回はさらに小さく、1〜2リクエストでレスポンスとログを確認してください。
