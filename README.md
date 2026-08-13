<div id="top"></div>

<div align="right">

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Arata1202/NextBlogApp/vercel_deploy.yml)
![GitHub License](https://img.shields.io/github/license/Arata1202/NextBlogApp)

</div>

![2](/docs/assets/readme/images/title.png)

## 目次

- [リアル大学生](#top)
  - [目次](#目次)
  - [リンク一覧](#リンク一覧)
  - [使用技術](#使用技術)
  - [アーキテクチャ](#アーキテクチャ)
  - [環境構築](#環境構築)
  - [スポンサー記事](#スポンサー記事)
  - [Terraform](#terraform)
  - [テスト](#テスト)
  - [OneSignalテスト通知](#onesignalテスト通知)
  - [ディレクトリ構成](#ディレクトリ構成)
  - [Gitの運用](#Gitの運用)
    - [ブランチ](#ブランチ)
    - [コミットメッセージの記法](#コミットメッセージの記法)

## リンク一覧

<ul>
  <li><a href="https://realunivlog.com">リアル大学生</a></li>
  <li><a href="https://www.figma.com/design/Fa4LsgTvBhWAu4sIcwYy1O/NextBlogApp?node-id=2102-4673">Figma（Archived Design Tokens）</a></li>
  <li><a href="https://www.figma.com/design/Fa4LsgTvBhWAu4sIcwYy1O/NextBlogApp?node-id=0-1">Figma（Archived UI）</a></li>
</ul>

<p align="right">(<a href="#top">トップへ</a>)</p>

## 使用技術

| Category          | Technology Stack                               |
| ----------------- | ---------------------------------------------- |
| Frontend          | Next.js, React, TypeScript, Tailwind CSS       |
| Backend           | Go, Vercel Functions                           |
| CMS               | microCMS, Zenn RSS                             |
| Infrastructure    | Cloudflare Pages, Vercel, Amazon S3, Terraform |
| Environment setup | Docker                                         |
| CI/CD             | GitHub Actions, CodeQL, Dependabot             |
| Design            | Figma, Canva                                   |
| Google            | AdSense, Analytics, Search Console, reCAPTCHA  |
| Integrations      | PWA, OneSignal, Sentry                         |

<p align="right">(<a href="#top">トップへ</a>)</p>

## アーキテクチャ

```mermaid
flowchart TB
  developer[Developer] --> github[GitHub Repository]

  subgraph ci[CI]
    github --> actions[GitHub Actions]
    actions --> quality[Lint / Typecheck / Test / CodeQL]
  end

  subgraph build[Static Build]
    github --> pagesBuild[Cloudflare Pages Build<br/>pnpm build]
    microcms[microCMS<br/>Blog / Category / Tag] --> pagesBuild
    zenn[Zenn RSS] --> pagesBuild
    pagesBuild --> generated[Static Output<br/>HTML / JS / CSS / RSS / sitemap]
  end

  generated --> pages[Cloudflare Pages<br/>out]
  pages --> browser[User Browser]

  subgraph runtime[Browser Runtime]
    browser --> app[Next.js Client App]
    app --> thirdParty[Google Analytics / AdSense<br/>OneSignal / Embedly / Instagram]
    app -. Client errors .-> sentry[Sentry]
  end

  subgraph vercelFunctions[Vercel Functions]
    app --> searchApi[Vercel Go Function<br/>/api/search]
    searchApi --> microcmsBlogContentApi[microCMS<br/>Blog Content API]
    app --> sendEmailApi[Vercel Go Function<br/>/api/sendemail]
    app --> recaptchaApi[Vercel Go Function<br/>/api/recaptcha]
    sendEmailApi --> smtp[SMTP / Gmail]
    recaptchaApi --> recaptcha[Google reCAPTCHA]
    cron[Vercel Cron<br/>/api/cron/linkchecker] --> linkcheckerApi[Vercel Go Function<br/>Link Checker]
    linkcheckerApi --> microcmsBlogContentApi
    linkcheckerApi --> smtp
    linkcheckerApi --> zenn
    linkcheckerApi --> s3
    linkcheckerApi --> oneSignalApi
    linkcheckerApi --> pagesDeployHook[Cloudflare Pages Deploy Hook]
    pagesDeployHook --> pagesBuild
    microcmsWebhook[microCMS<br/>Content Webhook] --> microcmsbackupApi[Vercel Go Function<br/>/api/webhook/microcmsbackup]
    microcmsbackupApi --> microcmsBlogContentApi
    microcmsbackupApi --> s3[AWS S3<br/>Backup CSV<br/>Notification Marker]
    microcmsbackupApi --> oneSignalApi[OneSignal<br/>Push Notification API]
  end

  searchApi -. Server errors .-> sentry
  sendEmailApi -. Server errors .-> sentry
  recaptchaApi -. Server errors .-> sentry
  linkcheckerApi -. Server errors .-> sentry
  microcmsbackupApi -. Server errors .-> sentry
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 環境構築

```
# リポジトリのクローン
git clone git@github.com:Arata1202/NextBlogApp.git
cd NextBlogApp

# .env.exampleから.envを作成
mv .env.example .env

# .envの編集
vi .env

# コンテナのビルドと起動
docker compose up -d --build

# ブラウザにアクセス
http:localhost:3000

# コンテナの停止
docker compose down
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## スポンサー記事

microCMSの`blog` APIに以下のフィールドを追加する。

| フィールドID  | 種類     | 設定                  |
| ------------- | -------- | --------------------- |
| `isSponsored` | 真偽値   | 初期値を`false`にする |
| `sponsorUrl`  | テキスト | 広告主の公式URL       |

`isSponsored`を有効にした記事では、一覧と記事上部にPR表示が追加され、記事上部に「本記事は、広告主から依頼を受けて制作した広告です。」と表示される。本文中のリンクは、`sponsorUrl`と同じドメインまたはそのサブドメインに限り`rel="sponsored"`が付与される。

スポンサー記事では有効な`sponsorUrl`が必須となり、不足している場合はビルドが失敗する。

スポンサー記事は、初回公開時のOneSignalプッシュ通知から自動的に除外される。

<p align="right">(<a href="#top">トップへ</a>)</p>

## Terraform

```
# Terraformディレクトリへ移動
cd terraform

# terraform.tfvars.exampleからterraform.tfvarsを作成
cp terraform.tfvars.example terraform.tfvars

# terraform.tfvarsの編集
vi terraform.tfvars

# Terraformの初期化
terraform init

# 変更内容の確認
terraform plan

# AWSリソースの作成・更新
terraform apply
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## テスト

```
# Lint / 型チェック / ユニットテスト
pnpm lint
pnpm typecheck
pnpm test:run

# Playwright のブラウザをインストール
pnpm exec playwright install chromium

# E2E用の固定データで静的ビルド
pnpm build:e2e

# E2Eテスト
pnpm test:e2e

# 既存のローカルサーバーを再利用してE2Eテストを実行
PLAYWRIGHT_REUSE_SERVER=1 pnpm test:e2e

# E2Eテストをブラウザ表示ありで実行
pnpm test:e2e:headed

# E2Eレポートを表示
pnpm test:e2e:report
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## OneSignalテスト通知

GitHub Actionsの`OneSignal Test Notification`から、`Test Users`セグメントへブログ／Zenn × Web／iOSの4種類のテスト通知を送信できる。

事前にGitHubの`onesignal-test` Environmentを作成し、Deployment branches and tagsを`master`のみに制限したうえで、次のSecretsを登録する。必要に応じてEnvironmentにRequired reviewersも設定する。

- `ONESIGNAL_APP_ID`
- `ONESIGNAL_REST_API_KEY`

Actionsの`Run workflow`では、ペイロードだけを表示する`dry-run`が既定値になっている。実際に通知するときだけ`master`ブランチで`send`を選択する。`master`以外からの送信指定はワークフローを失敗させる。送信先セグメントはスクリプト内で`Test Users`に固定している。

ローカルでは次のコマンドで同じテストを実行できる。

```bash
# ペイロードの確認（--dry-runは省略可）
scripts/send-onesignal-test-notifications.sh

# Test Usersへ送信
scripts/send-onesignal-test-notifications.sh --send
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成

```
❯ tree -a -I "node_modules|.next|.git|out|.vercel|_|.DS_Store|.env|next-env.d.ts|tmp|coverage|tsconfig.tsbuildinfo|playwright-report|test-results|.pnpm-store|.terraform|terraform.tfstate|terraform.tfstate.backup|terraform.tfvars" -L 3
.
├── .air.toml
├── .dockerignore
├── .env.example
├── .github
│   ├── dependabot.yml
│   └── workflows
│       ├── codeql.yml
│       ├── onesignal_test.yml
│       ├── test.yml
│       └── vercel_deploy.yml
├── .gitignore
├── .husky
│   └── pre-commit
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── .vercelignore
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── api
│   ├── cron
│   │   └── linkchecker.go
│   ├── recaptcha.go
│   ├── search.go
│   ├── sendemail.go
│   └── webhook
│       └── microcmsbackup.go
├── cmd
│   └── main.go
├── docker-compose.yml
├── docker
│   ├── go
│   │   └── Dockerfile
│   └── js
│       └── Dockerfile
├── docs
│   └── assets
│       └── readme
├── e2e
│   ├── contact.spec.ts
│   ├── feeds.spec.ts
│   ├── fixtures
│   │   ├── content.d.mts
│   │   └── content.mjs
│   ├── navigation.spec.ts
│   ├── responsive.spec.ts
│   ├── search.spec.ts
│   ├── smoke.spec.ts
│   ├── support
│   │   └── app.ts
│   └── theme.spec.ts
├── eslint.config.mjs
├── go.mod
├── go.sum
├── LICENSE
├── next.config.ts
├── package.json
├── pkg
│   └── api
│       ├── contact
│       ├── contentops
│       ├── httpx
│       ├── linkchecker
│       ├── microcms
│       ├── monitoring
│       ├── recaptcha
│       └── search
├── playwright.config.ts
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── ads.txt
│   ├── app-ads.txt
│   ├── favicon.ico
│   ├── images
│   │   ├── blog
│   │   ├── head
│   │   ├── plugin
│   │   ├── post
│   │   ├── pwa
│   │   └── thumbnail
│   ├── llms-full.txt
│   ├── llms.txt
│   ├── OneSignalSDKWorker.js
│   └── robots.txt
├── README.md
├── scripts
│   ├── e2e
│   │   ├── build.mjs
│   │   ├── mock-fetch.mjs
│   │   └── serve-static.mjs
│   └── send-onesignal-test-notifications.sh
├── src
│   ├── app
│   │   ├── __tests__
│   │   ├── archive
│   │   ├── articles
│   │   ├── category
│   │   ├── contact
│   │   ├── copyright
│   │   ├── disclaimer
│   │   ├── global-error.tsx
│   │   ├── layout.module.css
│   │   ├── layout.tsx
│   │   ├── link
│   │   ├── manifest.json
│   │   ├── not-found.module.css
│   │   ├── not-found.tsx
│   │   ├── p
│   │   ├── page.tsx
│   │   ├── privacy
│   │   ├── profile
│   │   ├── rss.xml
│   │   ├── search
│   │   ├── sitemap-html
│   │   ├── sitemap.ts
│   │   └── tag
│   ├── components
│   │   ├── Common
│   │   ├── Features
│   │   ├── Pages
│   │   └── ThirdParties
│   ├── config
│   │   ├── publicEnv.ts
│   │   └── serverEnv.ts
│   ├── constants
│   │   ├── articleContent.ts
│   │   ├── category.ts
│   │   ├── customHtml.ts
│   │   ├── data.ts
│   │   ├── limit.ts
│   │   └── page.ts
│   ├── contents
│   │   ├── copyright.ts
│   │   ├── disclaimer.ts
│   │   ├── link.ts
│   │   ├── privacy.ts
│   │   └── profile.ts
│   ├── contexts
│   │   ├── __tests__
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeWrapper.tsx
│   ├── hooks
│   │   ├── __tests__
│   │   ├── useCodeBlockCopyButtons.tsx
│   │   ├── useExtractHeadings.ts
│   │   ├── useIframelyEmbeds.ts
│   │   ├── useIsClient.ts
│   │   └── useMutationObserver.ts
│   ├── instrumentation-client.ts
│   ├── libs
│   │   ├── __tests__
│   │   ├── archive.ts
│   │   ├── microcms.ts
│   │   ├── microcmsPage.ts
│   │   ├── pageData.ts
│   │   ├── recent.ts
│   │   ├── rss.ts
│   │   ├── unified.ts
│   │   └── zenn.ts
│   ├── styles
│   │   ├── uiClassNames.ts
│   │   ├── globals.css
│   │   └── plugin.css
│   ├── test
│   │   ├── factories.ts
│   │   └── setup.ts
│   ├── types
│   │   ├── form.ts
│   │   ├── heading.ts
│   │   ├── microcms.ts
│   │   ├── react-dom-client.d.ts
│   │   └── unified.ts
│   └── utils
│       ├── __tests__
│       ├── formatDate.ts
│       ├── formatHeadings.ts
│       ├── formatMicroCmsImageUrl.ts
│       ├── formatRichText.ts
│       ├── htmlSanitizer.ts
│       ├── markdownHeadings.ts
│       ├── sanitizeCustomHtml.ts
│       └── urlSafety.ts
├── terraform
│   ├── .terraform.lock.hcl
│   ├── iam
│   │   ├── iam.tf
│   │   └── variables.tf
│   ├── main.tf
│   ├── module.tf
│   ├── s3
│   │   ├── s3.tf
│   │   └── variables.tf
│   ├── terraform.tfvars.example
│   └── variables.tf
├── tsconfig.json
├── vercel.json
└── vitest.config.mts

78 directories, 125 files
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## Gitの運用

### ブランチ

GitHub Flowを使用する。
masterとfeatureブランチで運用する。

| ブランチ名 |   役割   | 派生元 | マージ先 |
| :--------: | :------: | :----: | :------: |
|   master   | 本番環境 |   -    |    -     |
| feature/\* | 機能開発 | master |  master  |

### コミットメッセージの記法

```
fix: バグ修正
feat: 新機能追加
perf: パフォーマンス改善
refactor: コードのリファクタリング
docs: ドキュメントのみの変更
style: コードのフォーマットに関する変更
test: テストコードの変更
build: ビルドシステムや依存関係の変更
ci: CI/CD設定の変更
revert: 変更の取り消し
chore: その他の変更
```

<p align="right">(<a href="#top">トップへ</a>)</p>
