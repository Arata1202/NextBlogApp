import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'design-tokens.json');
const cssPath = path.join(root, 'src/styles/design-tokens.generated.css');
const figmaPath = path.join(root, 'figma/main.js');
const checkOnly = process.argv.includes('--check');

const source = JSON.parse(await readFile(sourcePath, 'utf8'));

function getByPath(object, tokenPath) {
  return tokenPath.split('.').reduce((value, key) => value?.[key], object);
}

function resolve(value, stack = []) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^\{(.+)}$/);
  if (!match) return value;
  if (stack.includes(match[1]))
    throw new Error(`Circular token reference: ${[...stack, match[1]].join(' -> ')}`);
  const referenced = getByPath(source, match[1]);
  if (referenced === undefined) throw new Error(`Unknown token reference: ${value}`);
  return resolve(referenced, [...stack, match[1]]);
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertNonNegativeNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a non-negative finite number`);
  }
}

function assertHexColor(value, label) {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${label} must be a six-digit hex color`);
  }
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const light = Math.max(relativeLuminance(first), relativeLuminance(second));
  const dark = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function assertReferences(value, tokenPath = []) {
  if (typeof value === 'string' && /^\{.+}$/.test(value)) {
    resolve(value, [tokenPath.join('.')]);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [name, child] of Object.entries(value)) {
    assertReferences(child, [...tokenPath, name]);
  }
}

function assertTokenShape() {
  const requiredSections = [
    'meta',
    'primitive',
    'semantic',
    'typography',
    'effect',
    'motion',
    'component',
  ];
  for (const section of requiredSections) assertObject(source[section], section);

  for (const [name, value] of Object.entries(source.primitive.color)) {
    assertHexColor(value, `primitive.color.${name}`);
  }
  for (const [name, value] of Object.entries(source.primitive.space)) {
    assertNonNegativeNumber(value, `primitive.space.${name}`);
  }
  for (const [name, value] of Object.entries(source.primitive.radius)) {
    assertNonNegativeNumber(value, `primitive.radius.${name}`);
  }

  for (const mode of ['light', 'dark']) {
    const colors = source.semantic.color[mode];
    if (!colors || typeof colors !== 'object')
      throw new Error(`Missing semantic color mode: ${mode}`);
    for (const [name, value] of Object.entries(colors)) {
      const resolved = resolve(value);
      assertHexColor(resolved, `semantic.color.${mode}.${name}`);
    }
  }

  const lightNames = Object.keys(source.semantic.color.light).sort().join('\n');
  const darkNames = Object.keys(source.semantic.color.dark).sort().join('\n');
  if (lightNames !== darkNames)
    throw new Error('Light and dark semantic color tokens must have identical names');

  for (const mode of ['light', 'dark']) {
    const colors = source.semantic.color[mode];
    const surface = resolve(colors['surface-page']);
    for (const role of ['text-primary', 'text-secondary', 'text-subtle']) {
      const ratio = contrastRatio(resolve(colors[role]), surface);
      if (ratio < 4.5) {
        throw new Error(
          `semantic.color.${mode}.${role} must meet WCAG AA contrast (was ${ratio.toFixed(2)}:1)`,
        );
      }
    }
    const inverseRatio = contrastRatio(
      resolve(colors['text-inverse']),
      resolve(colors['accent-default']),
    );
    if (inverseRatio < 4.5) {
      throw new Error(
        `semantic.color.${mode}.text-inverse must meet WCAG AA contrast against accent-default (was ${inverseRatio.toFixed(2)}:1)`,
      );
    }
  }

  for (const [name, style] of Object.entries(source.typography.style)) {
    assertObject(style, `typography.style.${name}`);
    assertNonNegativeNumber(style.fontSize, `typography.style.${name}.fontSize`);
    assertNonNegativeNumber(style.lineHeight, `typography.style.${name}.lineHeight`);
    assertNonNegativeNumber(style.fontWeight, `typography.style.${name}.fontWeight`);
    if (style.lineHeight < style.fontSize) {
      throw new Error(`typography.style.${name}.lineHeight must not be smaller than fontSize`);
    }
  }

  for (const [name, shadow] of Object.entries(source.effect.shadow)) {
    assertObject(shadow, `effect.shadow.${name}`);
    for (const field of ['x', 'y', 'blur', 'spread']) {
      if (typeof shadow[field] !== 'number' || !Number.isFinite(shadow[field])) {
        throw new Error(`effect.shadow.${name}.${field} must be a finite number`);
      }
    }
    assertHexColor(shadow.color, `effect.shadow.${name}.color`);
    if (typeof shadow.opacity !== 'number' || shadow.opacity < 0 || shadow.opacity > 1) {
      throw new Error(`effect.shadow.${name}.opacity must be between 0 and 1`);
    }
  }

  for (const [name, value] of Object.entries(source.motion.duration)) {
    assertNonNegativeNumber(value, `motion.duration.${name}`);
  }
  if (!source.typography.fontFamily.sans || !source.typography.fontFamily.mono) {
    throw new Error('typography.fontFamily.sans and typography.fontFamily.mono are required');
  }
  for (const [name, value] of Object.entries(source.motion.easing)) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`motion.easing.${name} must be a non-empty string`);
    }
  }
  assertNonNegativeNumber(source.component.focusRing.width, 'component.focusRing.width');
  assertNonNegativeNumber(source.component.focusRing.offset, 'component.focusRing.offset');
  assertNonNegativeNumber(resolve(source.component.control.radius), 'component.control.radius');
  assertNonNegativeNumber(resolve(source.component.dialog.radius), 'component.dialog.radius');
  for (const [variant, colors] of Object.entries(source.component.callout)) {
    assertHexColor(resolve(colors.surface), `component.callout.${variant}.surface`);
    assertHexColor(resolve(colors.accent), `component.callout.${variant}.accent`);
  }
  assertReferences(source);
}

function cssVariables(entries, mapper = (value) => value) {
  return Object.entries(entries)
    .map(([name, value]) => `  --${name}: ${mapper(resolve(value), name)};`)
    .join('\n');
}

function generateCss() {
  const primitiveColors = Object.fromEntries(
    Object.entries(source.primitive.color).map(([name, value]) => [
      `ds-primitive-color-${name}`,
      value,
    ]),
  );
  const primitiveSpace = Object.fromEntries(
    Object.entries(source.primitive.space).map(([name, value]) => [
      `ds-primitive-space-${name}`,
      value,
    ]),
  );
  const primitiveRadius = Object.fromEntries(
    Object.entries(source.primitive.radius).map(([name, value]) => [
      `ds-primitive-radius-${name}`,
      value,
    ]),
  );
  const semanticLight = Object.fromEntries(
    Object.entries(source.semantic.color.light).map(([name, value]) => [`ds-color-${name}`, value]),
  );
  const semanticDark = Object.fromEntries(
    Object.entries(source.semantic.color.dark).map(([name, value]) => [`ds-color-${name}`, value]),
  );
  const shadows = Object.fromEntries(
    Object.entries(source.effect.shadow).map(([name, shadow]) => [
      `ds-shadow-${name}`,
      `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px rgb(0 0 0 / ${shadow.opacity})`,
    ]),
  );
  const componentColors = Object.fromEntries(
    Object.entries(source.component.callout).flatMap(([variant, colors]) =>
      Object.entries(colors).map(([role, value]) => [`ds-callout-${variant}-${role}`, value]),
    ),
  );
  const rootVariableNames = [
    primitiveColors,
    primitiveSpace,
    primitiveRadius,
    semanticLight,
    shadows,
    componentColors,
  ].flatMap((entries) => Object.keys(entries));
  const duplicateNames = rootVariableNames.filter(
    (name, index) => rootVariableNames.indexOf(name) !== index,
  );
  if (duplicateNames.length > 0) {
    throw new Error(
      `Duplicate generated CSS variables: ${[...new Set(duplicateNames)].join(', ')}`,
    );
  }

  return `/* Generated by scripts/generate-design-tokens.mjs. Do not edit. */
:root {
${cssVariables(primitiveColors)}
${cssVariables(primitiveSpace, (value) => `${value}px`)}
${cssVariables(primitiveRadius, (value) => `${value}px`)}
${cssVariables(semanticLight)}
${cssVariables(shadows)}
${cssVariables(componentColors)}
  --ds-font-family-sans: '${source.typography.fontFamily.sans}', sans-serif;
  --ds-radius-control: ${resolve(source.component.control.radius)}px;
  --ds-radius-dialog: ${resolve(source.component.dialog.radius)}px;
  --ds-radius-round: ${source.primitive.radius.full}px;
  --ds-focus-ring-width: ${source.component.focusRing.width}px;
  --ds-focus-ring-offset: ${source.component.focusRing.offset}px;
  --ds-motion-duration-fast: ${source.motion.duration.fast}ms;
  --ds-motion-duration-normal: ${source.motion.duration.normal}ms;
  --ds-motion-easing-standard: ${source.motion.easing.standard};

  /* Compatibility aliases. Prefer the ds-* semantic names in new code. */
  --color-text-main: var(--ds-color-text-primary);
  --color-text-sub: var(--ds-color-text-secondary);
  --color-bg-main: var(--ds-color-surface-page);
  --color-bg-sub: var(--ds-color-surface-subtle);
  --color-bg-code: var(--ds-color-code-surface);
  --color-text-code: var(--ds-color-code-text);
  --color-border-dark: var(--ds-color-border-strong);
  --color-border: var(--ds-color-border-default);
  --color-border-light: var(--ds-primitive-color-neutral-50);
  --color-current: var(--ds-primitive-color-neutral-100);
  --color-focus-ring: var(--ds-color-focus-ring);
  --color-accent-soft-bg: var(--ds-primitive-color-blue-50);
  --color-accent-soft-text: var(--ds-primitive-color-neutral-900);
  --color-link: var(--ds-color-link-default);
  --color-link-hover: var(--ds-color-link-hover);
  --color-link-dark: var(--ds-color-link-default);
  --color-link-dark-hover: var(--ds-color-link-hover);
  --border-radius: var(--ds-radius-control);
  --focus-ring-width: var(--ds-focus-ring-width);
  --focus-ring-offset: var(--ds-focus-ring-offset);
}

.DarkTheme {
${cssVariables(semanticDark)}
}

/* Semantic utility classes consumed by src/styles/designTokens.ts. */
.ds-transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: var(--ds-motion-duration-fast);
  transition-timing-function: var(--ds-motion-easing-standard);
}
.ds-transition-shadow {
  transition-property: box-shadow;
  transition-duration: var(--ds-motion-duration-normal);
  transition-timing-function: var(--ds-motion-easing-standard);
}
.ds-transition-transform {
  transition-property: transform;
  transition-duration: var(--ds-motion-duration-normal);
  transition-timing-function: var(--ds-motion-easing-standard);
}
.ds-radius-control { border-radius: var(--ds-radius-control); }
.ds-radius-dialog { border-radius: var(--ds-radius-dialog); }
.ds-radius-round { border-radius: var(--ds-radius-round); }
.ds-shadow-control { box-shadow: var(--ds-shadow-control); }
.ds-shadow-card { box-shadow: var(--ds-shadow-card); }
.ds-shadow-card:hover { box-shadow: var(--ds-shadow-card-hover); }
.ds-shadow-dialog { box-shadow: var(--ds-shadow-dialog); }
.ds-bg-accent { background-color: var(--ds-color-accent-default); }
.ds-text-accent { color: var(--ds-color-accent-default); }
.ds-text-inverse { color: var(--ds-color-text-inverse); }
.ds-text-secondary { color: var(--ds-color-text-secondary); }
.ds-text-subtle { color: var(--ds-color-text-subtle); }
.ds-text-danger { color: var(--ds-color-status-danger); }
.ds-text-success { color: var(--ds-color-status-success); }
.ds-text-link { color: var(--ds-color-link-default); }
.ds-text-link:hover { color: var(--ds-color-link-hover); }
.ds-hover-text-accent:hover { color: var(--ds-color-accent-default); }
.ds-hover-border-accent:hover { border-color: var(--ds-color-accent-default); }
.ds-primary-button {
  color: var(--ds-color-text-inverse);
  background-color: var(--ds-color-accent-default);
}
.ds-primary-button:hover { background-color: var(--ds-color-accent-hover); }
.ds-placeholder-secondary::placeholder { color: var(--ds-color-text-secondary); }
.ds-active-accent { color: var(--ds-color-accent-default) !important; }
.ds-bordered-text {
  color: var(--ds-color-text-primary);
  border-color: var(--ds-color-border-strong);
}
.ds-hover-surface-subtle:hover { background-color: var(--ds-color-surface-subtle); }
.ds-selected-surface {
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-surface-selected);
}
.ds-surface-subtle { background-color: var(--ds-color-surface-subtle); }
.ds-ring-subtle { --tw-ring-color: color-mix(in srgb, var(--ds-color-border-strong) 5%, transparent); }
`;
}

function generateFigmaTokens() {
  const light = source.semantic.color.light;
  return {
    primitiveColors: source.primitive.color,
    semanticColors: Object.fromEntries(
      Object.entries(source.semantic.color).map(([mode, colors]) => [
        mode,
        Object.fromEntries(Object.entries(colors).map(([name, value]) => [name, resolve(value)])),
      ]),
    ),
    componentColors: Object.fromEntries(
      Object.entries(source.component.callout).flatMap(([variant, colors]) =>
        Object.entries(colors).map(([role, value]) => [
          `callout/${variant}/${role}`,
          resolve(value),
        ]),
      ),
    ),
    primitiveSpacing: source.primitive.space,
    primitiveRadius: source.primitive.radius,
    colors: {
      textMain: resolve(light['text-primary']),
      textSub: resolve(light['text-secondary']),
      surfaceLight: resolve(light['surface-page']),
      surfaceDark: resolve(source.semantic.color.dark['surface-page']),
      surfaceSubtle: resolve(light['surface-subtle']),
      border: resolve(light['border-default']),
      borderMuted: resolve(source.primitive.color['neutral-250']),
      borderDark: resolve(source.semantic.color.dark['border-default']),
      accent: resolve(light['accent-default']),
      accentHover: resolve(light['link-hover']),
      accentSoft: resolve(source.primitive.color['blue-50']),
      accentSoftText: resolve(source.primitive.color['neutral-900']),
      codeBg: resolve(light['code-surface']),
      codeText: resolve(light['code-text']),
      success: resolve(light['status-success']),
      danger: resolve(light['status-danger']),
    },
    typography: source.typography.style,
    spacing: {
      xs: source.primitive.space['1'],
      sm: source.primitive.space['2'],
      md: source.primitive.space['4'],
      lg: source.primitive.space['6'],
      xl: source.primitive.space['8'],
      '2xl': source.primitive.space['12'],
    },
    radius: {
      control: resolve(source.component.control.radius),
      dialog: resolve(source.component.dialog.radius),
      round: source.primitive.radius.full,
    },
    shadow: source.effect.shadow,
    motion: source.motion,
    fontFamily: source.typography.fontFamily.sans,
  };
}

async function updateFile(filePath, expected) {
  let current = '';
  try {
    current = await readFile(filePath, 'utf8');
  } catch {
    // A generated file may not exist on the first run.
  }
  if (current === expected) return false;
  if (checkOnly)
    throw new Error(`${path.relative(root, filePath)} is out of date; run pnpm tokens:generate`);
  await writeFile(filePath, expected);
  return true;
}

assertTokenShape();
const cssChanged = await updateFile(cssPath, generateCss());

const figmaCurrent = await readFile(figmaPath, 'utf8');
const figmaTokens = `const tokens = ${JSON.stringify(generateFigmaTokens(), null, 2)};`;
const figmaExpected = figmaCurrent.replace(/^const tokens = \{[\s\S]*?^\};/m, figmaTokens);
if (figmaExpected === figmaCurrent && !figmaCurrent.startsWith(figmaTokens)) {
  throw new Error('Could not find the generated token block in figma/main.js');
}
const figmaChanged = await updateFile(figmaPath, figmaExpected);

if (!checkOnly)
  console.log(`Design tokens generated${cssChanged || figmaChanged ? '' : ' (already current)'}.`);
