<div id="top"></div>

<div align="right">

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

| タグページ                                 | お問い合わせページ                   |
| ------------------------------------------ | ------------------------------------ |
| ![3](/.docs/readme/images/3.png)           | ![7](/.docs/readme/images/7.png)     |
| 特定のタグの記事を一覧表示するページです。 | 管理者にお問い合わせするページです。 |

| アーカイブページ                           | 　記事ページ                     |
| ------------------------------------------ | -------------------------------- |
| ![5](/.docs/readme/images/5.png)           | ![6](/.docs/readme/images/6.png) |
| 特定の年月の記事を一覧表示するページです。 | 記事を表示するページです。       |

| サイトマップ・RSS                            | 　ダークテーマ                                         |
| -------------------------------------------- | ------------------------------------------------------ |
| ![9](/.docs/readme/images/9.png)             | ![8](/.docs/readme/images/8.png)                       |
| XML形式のサイトマップとRSSを公開しています。 | ライトテーマとダークテーマを切り替えることができます。 |

<p align="right">(<a href="#top">トップへ</a>)</p>

## 使用技術

| Category       | Technology Stack                              |
| -------------- | --------------------------------------------- |
| Frontend       | Next.js, TypeScript, Tailwind CSS             |
| Backend        | Go, Vercel                                    |
| CMS            | MicroCMS                                      |
| Infrastructure | Cloudflare Pages                              |
| CI/CD          | GitHub Actions                                |
| Design         | Figma, Canva                                  |
| Google         | AdSense, Analytics, Search Console, reCAPTCHA |
| etc.           | PWA, OneSignal                                |

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

# pnpmのインストール
npm install -g pnpm

# node_modulesのインストール
pnpm install

# 開発サーバーの立ち上げ（Next.js）
pnpm dev

# 開発サーバーの立ち上げ（Go）
vercel dev

# ブラウザにアクセス
http:localhost:3000
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成

```
❯ tree -a -I "node_modules|.next|.git|out|.vercel|_|.DS_Store|.env|next-env.d.ts" -L 3
.
├── .docs
│   └── readme
│       └── images
├── .env.example
├── .github
│   └── workflows
│       └── vercel_deploy.yml
├── .gitignore
├── .husky
│   └── pre-commit
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── LICENSE
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── OneSignalSDKWorker.js
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
│   └── robots.txt
├── src
│   ├── app
│   │   ├── archive
│   │   ├── articles
│   │   ├── category
│   │   ├── contact
│   │   ├── copyright
│   │   ├── disclaimer
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
│   │   ├── sitemap.ts
│   │   └── tag
│   ├── components
│   │   ├── Common
│   │   ├── Features
│   │   ├── Pages
│   │   └── ThirdParties
│   ├── constants
│   │   ├── archive.ts
│   │   ├── category.ts
│   │   ├── data.ts
│   │   ├── limit.ts
│   │   └── tag.ts
│   ├── contents
│   │   ├── copyright.ts
│   │   ├── disclaimer.ts
│   │   ├── link.ts
│   │   ├── privacy.ts
│   │   └── profile.ts
│   ├── contexts
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeWrapper.tsx
│   ├── hooks
│   │   ├── useExtractHeadings.ts
│   │   └── useMutationObserver.ts
│   ├── libs
│   │   ├── microcms.ts
│   │   └── rss.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── plugin.css
│   ├── types
│   │   ├── form.ts
│   │   ├── heading.ts
│   │   └── microcms.ts
│   └── utils
│       └── formatDate.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel
    ├── .env.example
    ├── api
    │   ├── recaptcha.go
    │   └── sendemail.go
    ├── go.mod
    └── vercel.json

45 directories, 59 files
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
