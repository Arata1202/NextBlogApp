<div id="top"></div>

## 使用技術

<!-- シールド一覧 -->
<p style="display: inline">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Typescript-000000.svg?logo=typescript&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Tailwind CSS-000000.svg?logo=tailwindcss&style=for-the-badge">
  <img src="https://img.shields.io/badge/-MicroCMS-000000.svg?logo=&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Github Actions-000000.svg?logo=githubactions&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Docker-000000.svg?logo=docker&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Nginx-000000.svg?logo=nginx&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Canva-000000.svg?logo=canva&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Figma-000000.svg?logo=figma&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Google AdSense-000000.svg?logo=googleadsense&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Google Analytics-000000.svg?logo=googleanalytics&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Google Search Console-000000.svg?logo=googlesearchconsole&style=for-the-badge">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)

## プロジェクト名

リアル大学生

## プロジェクトについて

大学生活やプログラミングに関する記事を公開している個人ブログ

  <p align="left">
    <br />
    <a href="https://realunivlog.com"><strong>リアル大学生 »</strong></a>
    <br />
    <a href="https://www.figma.com/design/Fa4LsgTvBhWAu4sIcwYy1O/NextBlogApp?node-id=0-1&node-type=canvas&t=zcqCjvUj22ccvYpV-11"><strong>Figma »</strong></a>
    <br />
    <br />

<p align="right">(<a href="#top">トップへ</a>)</p>

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 主要なパッケージ  | バージョン |
| --------------------- | ---------- |
| next               | 15.0.3     |
| react               | 18.3.1     |
| typescript               | 5.6.3     |
| tailwindcss               | 3.4.15     |
| microcms-js-sdk               | 3.1.2     |
| husky               | 9.1.6     |
| eslint               | 9.15.0     |
| prettier               | 3.3.3     |

その他のパッケージのバージョンは package.json を参照してください

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成

```
❯ tree -a -I "node_modules|.next|.git|.pytest_cache|static" -L 2
.
├── .docker
│   ├── js
│   └── nginx
├── .env
├── .env.example
├── .github
│   └── workflows
├── .gitignore
├── .husky
│   └── pre-commit
├── .prettierignore
├── .prettierrc
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── LICENSE
├── README.md
├── app
│   ├── api
│   ├── archive
│   ├── articles
│   ├── category
│   ├── contact
│   ├── copyright
│   ├── disclaimer
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.module.css
│   ├── layout.tsx
│   ├── link
│   ├── not-found.module.css
│   ├── not-found.tsx
│   ├── p
│   ├── page.tsx
│   ├── privacy
│   ├── profile
│   ├── search
│   ├── sitemap
│   └── tag
├── components
│   ├── Adsense
│   ├── ArticleLists
│   ├── Articles
│   ├── Breadcrumbs
│   ├── Categories
│   ├── Elements
│   ├── Fixed
│   ├── Layouts
│   ├── Sidebars
│   └── Tags
├── constants
│   └── index.ts
├── docker-compose.yml
├── eslint.config.mjs
├── libs
│   ├── microcms.ts
│   ├── theme-provider.tsx
│   ├── theme-wrapper.tsx
│   └── utils.ts
├── next-sitemap.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── images
│   └── robots.txt
├── rss.ts
├── section
│   ├── archive.tsx
│   ├── dummy.tsx
│   ├── news.tsx
│   └── tag.tsx
├── tailwind.config.ts
└── tsconfig.json
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 開発環境構築

### 開発環境の構築と起動

.env ファイルを[環境変数の一覧](#環境変数の一覧)を元に作成

```
MICROCMS_API_KEY=
MICROCMS_SERVICE_DOMAIN=
BASE_URL=
GOOGLE_ANALYTICS_ID=
GOOGLE_ADSENSE_ID=
SEARCH_CONSOLE_ID=
RECAPTCHA_SECRET_KEY=
EMAIL_TO=
EMAIL_FROM=
SMTP_USER=
SMTP_PASS=
```

.env ファイルを作成後、以下の方法で開発環境を起動

#### pnpmを使用する場合

```
pnpm install
pnpm run dev
```

#### Dockerを使用する場合

```
docker compose up -d --build
```

### 動作確認

http://localhost:3000 にアクセスできるか確認
アクセスできたら成功

### コンテナの停止

以下のコマンドでコンテナを停止することができます

```
docker compose down
```

### 環境変数の一覧

| 変数名                 | 役割                                      |
| ---------------------- | ----------------------------------------- |
| MICROCMS_API_KEY    | MicroCMSのAPIキー |
| MICROCMS_SERVICE_DOMAIN         | MicroCMSのサービスドメイン（サービスID）   |
| BASE_URL             | 本番環境のベースURL         |
| GOOGLE_ANALYTICS_ID         | Google AnalyticsのスクリプトID       |
| GOOGLE_ADSENSE_ID             | Google AdSenseのスクリプトID         |
| SEARCH_CONSOLE_ID             | Google Search ConsoleのスクリプトID       |
| RECAPTCHA_SECRET_KEY             | Google reCAPTCHAのシークレットキー                 |
| EMAIL_TO          | お問い合わせの送信先メールアドレス              |
| EMAIL_FROM                  | お問い合わせの送信元メールアドレス                  |
| SMTP_USER        | Googleアカウントのメールアドレス                  |
| SMTP_PASS | Googleアカウントのアプリパスワード   |

### コマンド一覧

| 主要なコマンド               | 実行する処理                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| pnpm install        | `node_modules`のインストール |
| pnpm run dev             | 開発環境の起動                                                          |
| pnpm run build          | Next.jsのビルド、サイトマップとRSSフィードの生成                                                     |
| pnpm run start           | ビルド済みNext.jsの起動                                                          |
| docker compose up -d --build       | コンテナのビルドと起動                                                      |
| docker compose down | コンテナの停止                                          |

<p align="right">(<a href="#top">トップへ</a>)</p>
