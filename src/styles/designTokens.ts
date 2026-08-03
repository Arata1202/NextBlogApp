/**
 * Reusable Tailwind class recipes.
 * Token values live in /design-tokens.json; do not add raw design values here.
 */
export const themeClassNames = {
  light: 'LightTheme',
  dark: 'DarkTheme',
} as const;

export type ThemeVariantClassNames = {
  light: string;
  dark: string;
};

export const getThemeClassName = (theme?: string) => {
  return theme === 'dark' ? themeClassNames.dark : themeClassNames.light;
};

export const getThemeVariantClassName = (
  theme: string | undefined,
  classNames: ThemeVariantClassNames,
) => {
  return theme === 'dark' ? classNames.dark : classNames.light;
};

export const transitionClassNames = {
  color: 'ds-transition-colors',
  shadow: 'ds-transition-shadow',
  transform: 'ds-transition-transform',
} as const;

export const radiusClassNames = {
  control: 'ds-radius-control',
  dialog: 'ds-radius-dialog',
  round: 'ds-radius-round',
} as const;

export const shadowClassNames = {
  control: 'ds-shadow-control',
  card: 'ds-shadow-card',
  dialog: 'ds-shadow-dialog',
} as const;

export const colorClassNames = {
  accentBadge: 'ds-bg-accent ds-text-inverse',
  accentText: 'ds-text-accent',
  accentHoverText: 'ds-hover-text-accent',
  accentBorderHover: 'ds-hover-border-accent',
  dangerText: 'ds-text-danger',
  mutedText: 'ds-text-secondary',
  placeholderMutedText: 'ds-placeholder-secondary',
  primaryButton: 'ds-primary-button',
  subtleText: 'ds-text-subtle',
  successText: 'ds-text-success',
  textLink: 'ds-text-link',
  darkTextLink: 'ds-text-link',
} as const;

export const themeVariantClassNames = {
  activeAccentText: {
    light: 'ds-active-accent',
    dark: 'ds-active-accent',
  },
  borderedText: {
    light: 'ds-bordered-text',
    dark: 'ds-bordered-text',
  },
  controlHoverSurface: {
    light: 'ds-hover-surface-subtle',
    dark: 'ds-hover-surface-subtle',
  },
  mutedText: {
    light: 'ds-text-secondary',
    dark: 'ds-text-secondary',
  },
  selectedSurface: {
    light: 'ds-selected-surface',
    dark: 'ds-selected-surface',
  },
  subtleSurface: {
    light: 'ds-surface-subtle',
    dark: 'ds-surface-subtle',
  },
  subtleIcon: {
    light: 'ds-text-subtle',
    dark: 'ds-text-subtle',
  },
  subtleRing: {
    light: 'ds-ring-subtle',
    dark: 'ds-ring-subtle',
  },
} as const satisfies Record<string, ThemeVariantClassNames>;

export const surfaceClassNames = {
  card: `border ${shadowClassNames.card} ${transitionClassNames.shadow}`,
  panel: 'border py-5',
  popover: `${radiusClassNames.control} border ${shadowClassNames.dialog}`,
} as const;
