## アーキテクチャ

![名称未設定ファイル drawio (3)](https://github.com/user-attachments/assets/76d95aef-dcbd-4235-918f-7b35df656f01)

## リンク集

### ブログ

- https://realunivlog.com

### サイトマップ

- https://meta.realunivlog.com/sitemap-0.xml

### Figma

- https://www.figma.com/design/Fa4LsgTvBhWAu4sIcwYy1O/NextBlogApp?node-id=0-1&node-type=canvas&t=zcqCjvUj22ccvYpV-11

## 開発方法

まずは`.env.example`を`.env`に変更し、適切に設定する。

### 開発環境

```
npm install
npm run dev
```

### 本番環境

```
npm install
npm run build
npm start
```

## 実装機能

### Google

- Google Analytics
- Google Adsense
- Google Search Console
- Recaptcha

### サイトマップ

- RSS
- XML サイトマップ
- HTML サイトマップ

### プラグイン

- 目次
- 吹き出し
- タブボックス（メリット・デメリットなど）
- アフィリエイト
- マーカー
- コードマーカー
- コードブロック（ハイライト機能付き）
- ぱんくずリスト
- 関連記事
- あわせて読みたい

### 拡張機能

- PWA
- プッシュ通知
  - モバイル限定として、Web 版からは削除済み

### 固定ページ

- トップページ
  - 最新記事
  - 人気記事
  - SNS シェアボタン
  - 検索
- プロフィール
- サイトマップ
- お問い合わせ
- プライバシーポリシー
- 免責事項
- 著作権について
- リンクについて

### 動的ページ

- カテゴリー
- タグ
- 記事ページ

## 技術構成

- Next.js
- TypeScript
- TailwindCSS
- AWS Lambda
  - Docker
  - AWS ECR
- AWS S3
- AWS CloudFront
- MicroCMS
- Vercel
- Prettier
- Eslint
- Husky
  - pre-commit
- GitHub
- Canva
- Figma
- Docker
  - Reverse Proxy

## 料金 （月）

- MicroCMS: Hobby （無料）
- Vercel: Pro （約 3000 円）
<!--

## 今後実装したい機能・課題

### 課題

- 広告表示の関係で`Link`ではなく`window.location.href`を使用しているが、パフォーマンスが悪いので`Link`に変更したい。（Next.js の魅力を最大限に引き出す。）
  - 結論、a タグで良い。（未実装）
- Google AdSense を導入してから、全体的にパフォーマンスが落ちている。（ PageSpeedInsight ）
  - 許容範囲ではある。

### 機能

- コードタグにコピーボタンの実装 -->
