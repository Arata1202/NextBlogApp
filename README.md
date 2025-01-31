<div id="top"></div>

<div align="right">
  
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Arata1202/NextBlogApp/vercel_deploy.yml)
![GitHub License](https://img.shields.io/github/license/Arata1202/NextBlogApp)

</div>

![2](/.docs/readme/images/title.png)

## 目次

- [リアル大学生](#top)
  - [目次](#目次)
  - [リンク一覧](#リンク一覧)
  - [主な機能一覧](#主な機能一覧)
  - [使用技術](#使用技術)
  - [環境構築](#環境構築)
    - [リポジトリのクローン](#リポジトリのクローン)
    - [pnpmの場合](#pnpmの場合)
      - [開発環境](#開発環境)
      - [本番環境](#本番環境)
    - [Dockerの場合](#Dockerの場合)
  - [ディレクトリ構成](#ディレクトリ構成)
  - [Gitの運用](#Gitの運用)
    - [ブランチ](#ブランチ)
    - [コミットメッセージの記法](#コミットメッセージの記法)

## リンク一覧

<ul><li><a href="https://realunivlog.com">リアル大学生</a></li></ul>
<ul><li><a href="https://www.figma.com/design/Fa4LsgTvBhWAu4sIcwYy1O/NextBlogApp?node-id=0-1&node-type=canvas&t=zcqCjvUj22ccvYpV-11">Figma</a></li></ul>

<p align="right">(<a href="#top">トップへ</a>)</p>

## 主な機能一覧

※本番環境ではGoogle AdSenseによる広告が表示されます。

| 最新記事ページ                     | 　カテゴリーページ                               |
| ---------------------------------- | ------------------------------------------------ |
| ![1](/.docs/readme/images/1.png)   | ![2](/.docs/readme/images/2.png)                 |
| 最新記事を一覧表示するページです。 | 特定のカテゴリーの記事を一覧表示するページです。 |

| タグページ                                 | 　検索ページ                                       |
| ------------------------------------------ | -------------------------------------------------- |
| ![3](/.docs/readme/images/3.png)           | ![4](/.docs/readme/images/4.png)                   |
| 特定のタグの記事を一覧表示するページです。 | 検索したキーワードの記事を一覧表示するページです。 |

| アーカイブページ                           | 　記事ページ                     |
| ------------------------------------------ | -------------------------------- |
| ![5](/.docs/readme/images/5.png)           | ![6](/.docs/readme/images/6.png) |
| 特定の年月の記事を一覧表示するページです。 | 記事を表示するページです。       |

| お問い合わせページ                   | 　サイトマップページ                         |
| ------------------------------------ | -------------------------------------------- |
| ![7](/.docs/readme/images/7.png)     | ![10](/.docs/readme/images/10.png)           |
| 管理者にお問い合わせするページです。 | HTML形式のサイトマップを表示するページです。 |

| サイトマップ・RSS                            | 　ダークテーマ                                         |
| -------------------------------------------- | ------------------------------------------------------ |
| ![9](/.docs/readme/images/9.png)             | ![8](/.docs/readme/images/8.png)                       |
| XML形式のサイトマップとRSSを公開しています。 | ライトテーマとダークテーマを切り替えることができます。 |

<p align="right">(<a href="#top">トップへ</a>)</p>

## 使用技術

| Category          | Technology Stack                              |
| ----------------- | --------------------------------------------- |
| Frontend          | Next.js, TypeScript, Tailwind CSS             |
| Backend           | MicroCMS                                      |
| Infrastructure    | Vercel                                        |
| Environment setup | Docker, Nginx                                 |
| CI/CD             | GitHub Actions                                |
| Design            | Figma, Canva                                  |
| Google            | AdSense, Analytics, Search Console, reCAPTCHA |
| etc.              | PWA, OneSignal, Pipedream                     |

<p align="right">(<a href="#top">トップへ</a>)</p>

## 環境構築

### リポジトリのクローン

```
# リポジトリのクローン
git clone git@github.com:Arata1202/NextBlogApp.git
cd NextBlogApp

# .env.exampleから.envを作成
mv .env.example .env

# .envの編集
vi .env
```

### pnpmの場合

#### 開発環境

```
# node_modulesのインストール
pnpm install

# 開発サーバーの立ち上げ
pnpm dev

# ブラウザにアクセス
http:localhost:3000
```

#### 本番環境

```
# node_modulesのインストール
pnpm install

# Next.jsのビルド
pnpm build

# ビルドしたNext.jsの起動
pnpm start

# ブラウザにアクセス
http:localhost:3000
```

### Dockerの場合

```
# コンテナのビルドと起動
docker compose up -d --build

# ブラウザにアクセス
http:localhost:3000

# コンテナの停止
docker compose down
```

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
│   ├── manifest.json
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
├── hooks
│   └── MutationObserver
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
│   ├── OneSignalSDKWorker.js
│   └── robots.txt
├── rss.ts
├── section
│   ├── archive.tsx
│   ├── dummy.tsx
│   └── tag.tsx
├── tailwind.config.ts
└── tsconfig.json
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
update: 機能更新
change: 仕様変更
perf: パフォーマンス改善
refactor: コードのリファクタリング
docs: ドキュメントのみの変更
style: コードのフォーマットに関する変更
test: テストコードの変更
revert: 変更の取り消し
chore: その他の変更
```

<p align="right">(<a href="#top">トップへ</a>)</p>
