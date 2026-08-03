## NextBlogApp Design Tokens

The source of truth is `../design-tokens.json`. Do not edit the generated `tokens` block at the beginning of `main.js` directly.

## 更新方法

1. Update `design-tokens.json`.
2. Run `pnpm tokens:generate` at the repository root.
3. Run `pnpm tokens:check` before committing.

## Figmaへの反映

1. Figmaを開きます。
2. `プラグイン` → `開発` → `マニフェストからプラグインをインポート...` を選択します。
3. `figma/manifest.json` を選択します。
4. `プラグイン` → `開発` → `NextBlogApp Design Tokens` を実行します。

同名のローカルスタイルは更新され、既存のトークン一覧フレームは置き換えられます。
