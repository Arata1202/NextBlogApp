const tokens = {
  colors: {
    textMain: '#333333',
    textSub: '#999999',
    surfaceLight: '#ffffff',
    surfaceDark: '#262626',
    surfaceSubtle: '#f3f3f3',
    border: '#dddddd',
    borderMuted: '#d1d5db',
    borderDark: '#6b7280',
    accent: '#2563eb',
    accentHover: '#1e40af',
    accentSoft: '#eaf4fc',
    accentSoftText: '#111827',
    codeBg: '#0d1117',
    codeText: '#c9d1d9',
    success: '#16a34a',
    danger: '#dc2626',
  },
  typography: {
    display: { fontSize: 32, lineHeight: 42, fontWeight: 700 },
    heading: { fontSize: 24, lineHeight: 34, fontWeight: 700 },
    subheading: { fontSize: 18, lineHeight: 28, fontWeight: 700 },
    body: { fontSize: 16, lineHeight: 28, fontWeight: 400 },
    small: { fontSize: 14, lineHeight: 22, fontWeight: 400 },
    caption: { fontSize: 12, lineHeight: 18, fontWeight: 400 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  radius: {
    control: 4,
    dialog: 8,
    round: 999,
  },
  shadow: {
    control: { x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.08 },
    card: { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.12 },
    dialog: { x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.18 },
  },
};

figma.skipInvisibleInstanceChildren = true;

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);

  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function paint(hex) {
  return {
    type: 'SOLID',
    color: hexToRgb(hex),
  };
}

function effect(shadow) {
  const color = hexToRgb(shadow.color);
  color.a = shadow.opacity;

  return {
    type: 'DROP_SHADOW',
    color: color,
    offset: { x: shadow.x, y: shadow.y },
    radius: shadow.blur,
    spread: shadow.spread,
    visible: true,
    blendMode: 'NORMAL',
  };
}

function localStyle(styles, name) {
  for (let index = 0; index < styles.length; index += 1) {
    if (styles[index].name === name) {
      return styles[index];
    }
  }

  return null;
}

function section(name, width) {
  if (width === undefined) {
    width = 720;
  }

  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, 100);
  frame.fills = [];
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = tokens.spacing.md;
  frame.paddingTop = tokens.spacing.lg;
  frame.paddingRight = tokens.spacing.lg;
  frame.paddingBottom = tokens.spacing.lg;
  frame.paddingLeft = tokens.spacing.lg;
  frame.counterAxisSizingMode = 'FIXED';
  frame.primaryAxisSizingMode = 'AUTO';

  return frame;
}

function textNode(text, style, color) {
  if (style === undefined) {
    style = tokens.typography.body;
  }

  if (color === undefined) {
    color = tokens.colors.textMain;
  }

  const node = figma.createText();
  node.characters = text;
  node.fontName = { family: 'Inter', style: style.fontWeight >= 700 ? 'Bold' : 'Regular' };
  node.fontSize = style.fontSize;
  node.lineHeight = { unit: 'PIXELS', value: style.lineHeight };
  node.fills = [paint(color)];

  return node;
}

function tokenLabel(name, value) {
  const label = textNode(name + '\n' + value, tokens.typography.small);
  label.resize(260, 48);
  return label;
}

function tokenRow(name) {
  const row = figma.createFrame();
  row.name = name;
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'AUTO';
  row.counterAxisSizingMode = 'AUTO';
  row.counterAxisAlignItems = 'CENTER';
  row.itemSpacing = tokens.spacing.md;
  row.fills = [];

  return row;
}

function colorToken(name, hex) {
  const row = tokenRow('Color / ' + name);

  const swatch = figma.createRectangle();
  swatch.name = name;
  swatch.resize(56, 56);
  swatch.cornerRadius = tokens.radius.control;
  swatch.fills = [paint(hex)];
  swatch.strokes = [paint(tokens.colors.border)];
  swatch.strokeWeight = 1;

  row.appendChild(swatch);
  row.appendChild(tokenLabel(name, hex));

  return row;
}

function typographyToken(name, typography) {
  const row = tokenRow('Typography / ' + name);
  row.counterAxisAlignItems = 'MIN';

  const sample = textNode('Aa あいう', typography);
  sample.resize(220, typography.lineHeight + tokens.spacing.sm);

  const detail =
    typography.fontSize + 'px / ' + typography.lineHeight + 'px / ' + typography.fontWeight;

  row.appendChild(sample);
  row.appendChild(tokenLabel(name, detail));

  return row;
}

function spacingToken(name, value) {
  const row = tokenRow('Spacing / ' + name);

  const preview = figma.createFrame();
  preview.name = name;
  preview.resize(220, 32);
  preview.fills = [];
  preview.layoutMode = 'HORIZONTAL';
  preview.counterAxisAlignItems = 'CENTER';

  const bar = figma.createRectangle();
  bar.name = name + ' spacing';
  bar.resize(value, 12);
  bar.cornerRadius = tokens.radius.control;
  bar.fills = [paint(tokens.colors.accent)];
  preview.appendChild(bar);

  row.appendChild(preview);
  row.appendChild(tokenLabel(name, value + 'px'));

  return row;
}

function radiusToken(name, value) {
  const row = tokenRow('Radius / ' + name);

  const preview = figma.createRectangle();
  preview.name = name;
  preview.resize(56, 56);
  preview.cornerRadius = value;
  preview.fills = [paint(tokens.colors.surfaceSubtle)];
  preview.strokes = [paint(tokens.colors.borderMuted)];
  preview.strokeWeight = 1;

  row.appendChild(preview);
  row.appendChild(tokenLabel(name, value + 'px'));

  return row;
}

function shadowToken(name, shadow) {
  const row = tokenRow('Shadow / ' + name);

  const preview = figma.createRectangle();
  preview.name = name;
  preview.resize(72, 48);
  preview.cornerRadius = tokens.radius.control;
  preview.fills = [paint(tokens.colors.surfaceLight)];
  preview.effects = [effect(shadow)];

  const detail =
    'x:' +
    shadow.x +
    ' y:' +
    shadow.y +
    ' blur:' +
    shadow.blur +
    ' spread:' +
    shadow.spread +
    ' opacity:' +
    shadow.opacity;

  row.appendChild(preview);
  row.appendChild(tokenLabel(name, detail));

  return row;
}

async function createTextStyles() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const styles =
    typeof figma.getLocalTextStylesAsync === 'function'
      ? await figma.getLocalTextStylesAsync()
      : [];

  for (const name in tokens.typography) {
    if (!hasOwn(tokens.typography, name)) {
      continue;
    }

    const typography = tokens.typography[name];
    const styleName = 'Typography/' + name;
    const existing = localStyle(styles, styleName);
    const style = existing || figma.createTextStyle();
    style.name = styleName;
    style.fontName = { family: 'Inter', style: typography.fontWeight >= 700 ? 'Bold' : 'Regular' };
    style.fontSize = typography.fontSize;
    style.lineHeight = { unit: 'PIXELS', value: typography.lineHeight };
  }
}

async function createPaintStyles() {
  const styles =
    typeof figma.getLocalPaintStylesAsync === 'function'
      ? await figma.getLocalPaintStylesAsync()
      : [];

  for (const name in tokens.colors) {
    if (!hasOwn(tokens.colors, name)) {
      continue;
    }

    const styleName = 'Color/' + name;
    const existing = localStyle(styles, styleName);
    const style = existing || figma.createPaintStyle();
    style.name = styleName;
    style.paints = [paint(tokens.colors[name])];
  }
}

async function createEffectStyles() {
  const styles =
    typeof figma.getLocalEffectStylesAsync === 'function'
      ? await figma.getLocalEffectStylesAsync()
      : [];

  for (const name in tokens.shadow) {
    if (!hasOwn(tokens.shadow, name)) {
      continue;
    }

    const styleName = 'Shadow/' + name;
    const existing = localStyle(styles, styleName);
    const style = existing || figma.createEffectStyle();
    style.name = styleName;
    style.effects = [effect(tokens.shadow[name])];
  }
}

function appendColorTokens(root) {
  const colorSection = section('Tokens / Colors');
  colorSection.appendChild(textNode('Colors', tokens.typography.heading));

  for (const name in tokens.colors) {
    if (!hasOwn(tokens.colors, name)) {
      continue;
    }

    colorSection.appendChild(colorToken(name, tokens.colors[name]));
  }

  root.appendChild(colorSection);
}

function appendTypographyTokens(root) {
  const typographySection = section('Tokens / Typography');
  typographySection.appendChild(textNode('Typography', tokens.typography.heading));

  for (const name in tokens.typography) {
    if (!hasOwn(tokens.typography, name)) {
      continue;
    }

    typographySection.appendChild(typographyToken(name, tokens.typography[name]));
  }

  root.appendChild(typographySection);
}

function appendSpacingTokens(root) {
  const spacingSection = section('Tokens / Spacing');
  spacingSection.appendChild(textNode('Spacing', tokens.typography.heading));

  for (const name in tokens.spacing) {
    if (!hasOwn(tokens.spacing, name)) {
      continue;
    }

    spacingSection.appendChild(spacingToken(name, tokens.spacing[name]));
  }

  root.appendChild(spacingSection);
}

function appendRadiusTokens(root) {
  const radiusSection = section('Tokens / Radius');
  radiusSection.appendChild(textNode('Radius', tokens.typography.heading));

  for (const name in tokens.radius) {
    if (!hasOwn(tokens.radius, name)) {
      continue;
    }

    radiusSection.appendChild(radiusToken(name, tokens.radius[name]));
  }

  root.appendChild(radiusSection);
}

function appendShadowTokens(root) {
  const shadowSection = section('Tokens / Shadow');
  shadowSection.appendChild(textNode('Shadow', tokens.typography.heading));

  for (const name in tokens.shadow) {
    if (!hasOwn(tokens.shadow, name)) {
      continue;
    }

    shadowSection.appendChild(shadowToken(name, tokens.shadow[name]));
  }

  root.appendChild(shadowSection);
}

async function main() {
  await createTextStyles();
  await createPaintStyles();
  await createEffectStyles();

  const root = figma.createFrame();
  root.name = 'NextBlogApp Design Tokens';
  root.x = figma.viewport.center.x - 420;
  root.y = figma.viewport.center.y - 520;
  root.resize(840, 100);
  root.layoutMode = 'VERTICAL';
  root.primaryAxisSizingMode = 'AUTO';
  root.counterAxisSizingMode = 'FIXED';
  root.paddingTop = tokens.spacing['2xl'];
  root.paddingRight = tokens.spacing['2xl'];
  root.paddingBottom = tokens.spacing['2xl'];
  root.paddingLeft = tokens.spacing['2xl'];
  root.itemSpacing = tokens.spacing.xl;
  root.fills = [paint('#f8fafc')];

  root.appendChild(textNode('NextBlogApp Design Tokens', tokens.typography.display));
  root.appendChild(
    textNode(
      'Generated from src/styles/designTokens.ts conventions.',
      tokens.typography.body,
      tokens.colors.textSub,
    ),
  );

  appendColorTokens(root);
  appendTypographyTokens(root);
  appendSpacingTokens(root);
  appendRadiusTokens(root);
  appendShadowTokens(root);

  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('NextBlogApp design tokens generated.');
}

main().catch(function (error) {
  figma.closePlugin('Failed to generate design tokens: ' + String(error));
});
