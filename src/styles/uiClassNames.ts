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
  color: 'transition-colors duration-150',
  shadow: 'transition-shadow duration-200',
  transform: 'transition-transform duration-200',
} as const;

export const radiusClassNames = {
  control: 'rounded-[var(--radius-control)]',
  dialog: 'rounded-[var(--radius-dialog)]',
  round: 'rounded-[var(--radius-round)]',
} as const;

export const shadowClassNames = {
  control: 'shadow-[var(--shadow-control)]',
  card: 'shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]',
  dialog: 'shadow-[var(--shadow-dialog)]',
} as const;

export const colorClassNames = {
  accentHoverText: 'hover:text-[var(--color-interactive)]',
  accentBorderHover: 'hover:border-[var(--color-interactive)]',
  mutedText: 'text-[var(--color-text-muted)]',
  subtleText: 'text-[var(--color-text-subtle)]',
  textLink: 'text-[var(--color-control-link)] hover:text-[var(--color-control-link-hover)]',
  darkTextLink:
    'text-[var(--color-control-link-dark)] hover:text-[var(--color-control-link-dark-hover)]',
} as const;

export const themeVariantClassNames = {
  borderedText: {
    light:
      'border-[var(--color-theme-bordered-text-border)] text-[var(--color-theme-bordered-text)]',
    dark:
      'border-[var(--color-theme-bordered-text-border)] text-[var(--color-theme-bordered-text)]',
  },
  mutedText: {
    light: 'text-[var(--color-theme-muted-text)]',
    dark: 'text-[var(--color-theme-muted-text)]',
  },
  selectedSurface: {
    light: 'bg-[var(--color-theme-selected-background)] text-[var(--color-theme-selected-text)]',
    dark: 'bg-[var(--color-theme-selected-background)] text-[var(--color-theme-selected-text)]',
  },
} as const satisfies Record<string, ThemeVariantClassNames>;

export const surfaceClassNames = {
  card: `border ${shadowClassNames.card} ${transitionClassNames.shadow}`,
  panel: 'border py-5',
  popover: `${radiusClassNames.control} border ${shadowClassNames.dialog}`,
} as const;
