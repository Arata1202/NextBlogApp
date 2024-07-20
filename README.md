## ブログ運営の日課

### Google AdSense

- 不正なインプレッションが存在しないか、レポートを確認
- ポリシーセンターで、ポリシー違反がないか確認
- 収益の確認

### Google Analytics

- 地域別に絞り込み、不正なインプレッションが存在しないか確認
- 定期的にリアルタイムユーザーを確認

### Google Search Console

- 検索キーワード・流入の分析
- カバレッジエラーが存在しないか確認

## 記事出稿の手順

- 記事作成
- パーマリンクを適切に設定
  - 忘れた場合は、301 リダイレクトを設定
- インデックスのリクエストを送信

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

### 固定ページ

- トップページ
  - 最新記事
  - 人気記事
  - SNS シェアボタン
  - 検索
- プロフィール
- サイトマップ
- お問い合わせ
- プライバシーポリシー・免責事項

### 動的ページ

- カテゴリー
- タグ
- 記事ページ

## 技術構成

- Next.js
- TypeScript
- TailwindCSS
- PHP（バックエンド API）
- microCMS
- Vercel
- Prettier
- GitHub
- Canva

## 料金 （月）

- MicroCMS: Hobby （無料）
- Vercel: Pro （約 3000 円）
- Xserver: Standard （約 1000 円）

## 今後実装したい機能・課題

### 課題

- 広告表示の関係で`Link`ではなく`window.location.href`を使用しているが、パフォーマンスが悪いので`Link`に変更したい。（Next.js の魅力を最大限に引き出す。）
- Google AdSense を導入してから、全体的にパフォーマンスが落ちている。（ PageSpeedInsight ）

### 機能

- バックエンド API を AWS に移行
- コードタグにコピーボタンの実装
