# Design tokens

`design-tokens.json` is the single source of truth for shared visual decisions in NextBlogApp.

## Architecture

- `primitive`: raw palette, spacing and radius scales. Application code should not normally use these directly.
- `semantic`: purpose-based colors with light and dark modes. New UI should prefer these names.
- `typography`: reusable text roles using the product font family.
- `effect` and `motion`: shared shadows and interaction timing.
- `component`: values that belong to a reusable UI pattern, not one isolated layout.

One-off layout dimensions, responsive breakpoints and content-specific illustration colors are deliberately not tokens. A value becomes a token when it represents a repeated design decision rather than merely occurring in CSS.

## Workflow

1. Edit `design-tokens.json` only.
2. Run `pnpm tokens:generate`.
3. Commit the source and generated files together.
4. Import `figma/manifest.json` as a development plugin and run it in Figma.

`pnpm dev` and `pnpm build` regenerate the Web CSS automatically. CI runs `pnpm tokens:check` and fails when generated files are stale.

Generated files must not be edited directly:

- `src/styles/design-tokens.generated.css`
- the leading `tokens` block in `figma/main.js`

The Figma plugin reconciles the local paint, text and effect styles it owns: current styles are updated, removed tokens are deleted, and the specimen frame is replaced instead of duplicated. Legacy `Color/*` styles created by the previous plugin format are removed during migration. Running the plugin remains a manual step because unattended Variables REST API synchronization requires an Enterprise plan.

Semantic text colors intended for normal-size copy must meet WCAG AA contrast against their paired surface. Decorative and disabled states should use separate component tokens rather than weakening shared text roles.

## Naming rules

- Use kebab-case names that describe intent, such as `text-primary` or `surface-selected`.
- Do not encode a color value in a semantic name.
- Add a component token only when a value is owned by a reusable component pattern.
- Light and dark semantic color modes must expose exactly the same token names.
