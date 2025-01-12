<div id="top"></div>

![2](/public/images/readme/title.png)

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

| 最新記事ページ                     | 　カテゴリーページ                               |
| ---------------------------------- | ------------------------------------------------ |
| ![1](/public/images/readme/1.png)  | ![2](/public/images/readme/2.png)                |
| 最新記事を一覧表示するページです。 | 特定のカテゴリーの記事を一覧表示するページです。 |
| https://realunivlog.com            | https://realunivlog.com/category/programming     |

| タグページ                                 | 　検索ページ                                        |
| ------------------------------------------ | --------------------------------------------------- |
| ![3](/public/images/readme/3.png)          | ![4](/public/images/readme/4.png)                   |
| 特定のタグの記事を一覧表示するページです。 | 検索したキーワードの記事を一覧表示するページです。  |
| https://realunivlog.com/tag/adsense        | https://realunivlog.com/search?q=%E6%97%85%E8%A1%8C |

| アーカイブページ                           | 　記事ページ                                  |
| ------------------------------------------ | --------------------------------------------- |
| ![5](/public/images/readme/5.png)          | ![6](/public/images/readme/6.png)             |
| 特定の年月の記事を一覧表示するページです。 | 記事を表示するページです。                    |
| https://realunivlog.com/archive/2024/10    | https://realunivlog.com/articles/qyjjrfa737bk |

| お問い合わせページ                   | 　サイトマップページ                         |
| ------------------------------------ | -------------------------------------------- |
| ![7](/public/images/readme/7.png)    | ![10](/public/images/readme/10.png)          |
| 管理者にお問い合わせするページです。 | HTML形式のサイトマップを表示するページです。 |
| https://realunivlog.com/contact      | https://realunivlog.com/sitemap              |

| サイトマップ・RSS                                                         | 　ダークテーマ                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------ |
| ![9](/public/images/readme/9.png)                                         | ![8](/public/images/readme/8.png)                      |
| XML形式のサイトマップとRSSを公開しています。                              | ライトテーマとダークテーマを切り替えることができます。 |
| https://realunivlog.com/sitemap-0.xml<br/>https://realunivlog.com/rss.xml | -　                                                    |

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

## Gitの運用

### ブランチ

Github-flowを使用する。
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
