const tokens = {
  primitiveColors: {
    white: '#ffffff',
    'neutral-25': '#f9fafb',
    'neutral-50': '#f3f3f3',
    'neutral-100': '#eeeeee',
    'neutral-200': '#dddddd',
    'neutral-250': '#d1d5db',
    'neutral-300': '#cccccc',
    'neutral-400': '#9ca3af',
    'neutral-450': '#999999',
    'neutral-500': '#6b7280',
    'neutral-600': '#4b5563',
    'neutral-700': '#374151',
    'neutral-750': '#333333',
    'neutral-800': '#262626',
    'neutral-900': '#111827',
    'blue-200': '#bfdbfe',
    'blue-50': '#eaf4fc',
    'blue-300': '#93c5fd',
    'blue-400': '#60a5fa',
    'blue-500': '#3b82f6',
    'blue-600': '#2563eb',
    'blue-700': '#1d4ed8',
    'blue-800': '#1e40af',
    'green-600': '#16a34a',
    'green-50': '#ecffe9',
    'green-500': '#00d084',
    'red-50': '#ffecec',
    'red-400': '#ff7f7f',
    'red-600': '#dc2626',
    'yellow-50': '#fffacd',
    'yellow-400': '#ffd700',
    'steel-600': '#4682b4',
    'code-surface': '#0d1117',
    'code-text': '#c9d1d9',
  },
  semanticColors: {
    light: {
      'text-primary': '#333333',
      'text-secondary': '#999999',
      'text-subtle': '#9ca3af',
      'text-inverse': '#ffffff',
      'surface-page': '#ffffff',
      'surface-subtle': '#f3f3f3',
      'surface-selected': '#d1d5db',
      'border-default': '#dddddd',
      'border-strong': '#d1d5db',
      'accent-default': '#2563eb',
      'accent-hover': '#1d4ed8',
      'link-default': '#1d4ed8',
      'link-hover': '#1e40af',
      'focus-ring': '#2563eb',
      'status-success': '#16a34a',
      'status-danger': '#dc2626',
      'code-surface': '#0d1117',
      'code-text': '#c9d1d9',
    },
    dark: {
      'text-primary': '#ffffff',
      'text-secondary': '#d1d5db',
      'text-subtle': '#6b7280',
      'text-inverse': '#111827',
      'surface-page': '#262626',
      'surface-subtle': '#374151',
      'surface-selected': '#6b7280',
      'border-default': '#6b7280',
      'border-strong': '#9ca3af',
      'accent-default': '#60a5fa',
      'accent-hover': '#93c5fd',
      'link-default': '#93c5fd',
      'link-hover': '#bfdbfe',
      'focus-ring': '#60a5fa',
      'status-success': '#16a34a',
      'status-danger': '#dc2626',
      'code-surface': '#0d1117',
      'code-text': '#c9d1d9',
    },
  },
  componentColors: {
    'callout/merit/surface': '#ecffe9',
    'callout/merit/accent': '#00d084',
    'callout/demerit/surface': '#ffecec',
    'callout/demerit/accent': '#ff7f7f',
    'callout/point/surface': '#fffacd',
    'callout/point/accent': '#ffd700',
    'callout/common/surface': '#eaf4fc',
    'callout/common/accent': '#4682b4',
  },
  primitiveSpacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    12: 48,
  },
  primitiveRadius: {
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    full: 9999,
  },
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
    display: {
      fontSize: 32,
      lineHeight: 42,
      fontWeight: 700,
    },
    heading: {
      fontSize: 24,
      lineHeight: 34,
      fontWeight: 700,
    },
    subheading: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: 600,
    },
    'body-large': {
      fontSize: 18,
      lineHeight: 32,
      fontWeight: 400,
    },
    body: {
      fontSize: 16,
      lineHeight: 28,
      fontWeight: 400,
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 600,
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: 400,
    },
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
    round: 9999,
  },
  shadow: {
    control: {
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
      color: '#000000',
      opacity: 0.08,
    },
    card: {
      x: 0,
      y: 10,
      blur: 15,
      spread: -3,
      color: '#000000',
      opacity: 0.12,
    },
    dialog: {
      x: 0,
      y: 20,
      blur: 25,
      spread: -5,
      color: '#000000',
      opacity: 0.18,
    },
  },
  motion: {
    duration: {
      fast: 150,
      normal: 200,
    },
    easing: {
      standard: 'ease',
    },
  },
  fontFamily: 'Geist',
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
  node.fontName = { family: tokens.fontFamily, style: fontStyle(style.fontWeight) };
  node.characters = text;
  node.fontSize = style.fontSize;
  node.lineHeight = { unit: 'PIXELS', value: style.lineHeight };
  node.fills = [paint(color)];

  return node;
}

function fontStyle(weight) {
  if (weight >= 700) return 'Bold';
  if (weight >= 600) return 'SemiBold';
  if (weight >= 500) return 'Medium';
  return 'Regular';
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
  const fontStyles = ['Regular', 'Medium', 'SemiBold', 'Bold'];
  for (const fontStyleName of fontStyles) {
    await figma.loadFontAsync({ family: tokens.fontFamily, style: fontStyleName });
  }

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
    style.fontName = { family: tokens.fontFamily, style: fontStyle(typography.fontWeight) };
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

  for (const name in tokens.primitiveColors) {
    if (!hasOwn(tokens.primitiveColors, name)) continue;
    const styleName = 'Color/Primitive/' + name;
    const existing = localStyle(styles, styleName);
    const style = existing || figma.createPaintStyle();
    style.name = styleName;
    style.paints = [paint(tokens.primitiveColors[name])];
  }

  for (const mode in tokens.semanticColors) {
    if (!hasOwn(tokens.semanticColors, mode)) continue;
    for (const name in tokens.semanticColors[mode]) {
      if (!hasOwn(tokens.semanticColors[mode], name)) continue;
      const styleName = 'Color/Semantic/' + mode + '/' + name;
      const existing = localStyle(styles, styleName);
      const style = existing || figma.createPaintStyle();
      style.name = styleName;
      style.paints = [paint(tokens.semanticColors[mode][name])];
    }
  }

  for (const name in tokens.componentColors) {
    if (!hasOwn(tokens.componentColors, name)) continue;
    const styleName = 'Color/Component/' + name;
    const existing = localStyle(styles, styleName);
    const style = existing || figma.createPaintStyle();
    style.name = styleName;
    style.paints = [paint(tokens.componentColors[name])];
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

  const primitiveSection = section('Tokens / Colors / Primitive');
  primitiveSection.appendChild(textNode('Primitive colors', tokens.typography.heading));
  for (const name in tokens.primitiveColors) {
    if (hasOwn(tokens.primitiveColors, name)) {
      primitiveSection.appendChild(colorToken(name, tokens.primitiveColors[name]));
    }
  }
  root.appendChild(primitiveSection);

  for (const mode in tokens.semanticColors) {
    if (!hasOwn(tokens.semanticColors, mode)) continue;
    const semanticSection = section('Tokens / Colors / Semantic / ' + mode);
    semanticSection.appendChild(textNode('Semantic colors / ' + mode, tokens.typography.heading));
    for (const name in tokens.semanticColors[mode]) {
      if (hasOwn(tokens.semanticColors[mode], name)) {
        semanticSection.appendChild(colorToken(name, tokens.semanticColors[mode][name]));
      }
    }
    root.appendChild(semanticSection);
  }

  const componentSection = section('Tokens / Colors / Component');
  componentSection.appendChild(textNode('Component colors', tokens.typography.heading));
  for (const name in tokens.componentColors) {
    if (hasOwn(tokens.componentColors, name)) {
      componentSection.appendChild(colorToken(name, tokens.componentColors[name]));
    }
  }
  root.appendChild(componentSection);
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

  const primitiveSection = section('Tokens / Spacing / Primitive');
  primitiveSection.appendChild(textNode('Primitive spacing', tokens.typography.heading));
  for (const name in tokens.primitiveSpacing) {
    if (hasOwn(tokens.primitiveSpacing, name)) {
      primitiveSection.appendChild(spacingToken(name, tokens.primitiveSpacing[name]));
    }
  }
  root.appendChild(primitiveSection);
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

  const primitiveSection = section('Tokens / Radius / Primitive');
  primitiveSection.appendChild(textNode('Primitive radius', tokens.typography.heading));
  for (const name in tokens.primitiveRadius) {
    if (hasOwn(tokens.primitiveRadius, name)) {
      primitiveSection.appendChild(radiusToken(name, tokens.primitiveRadius[name]));
    }
  }
  root.appendChild(primitiveSection);
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

  const previousRoot = figma.currentPage.findOne(
    (node) => node.type === 'FRAME' && node.name === 'NextBlogApp Design Tokens',
  );
  if (previousRoot) previousRoot.remove();

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
