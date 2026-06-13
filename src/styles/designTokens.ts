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
  control: 'rounded-md',
  dialog: 'rounded-lg',
  round: 'rounded-full',
} as const;

export const shadowClassNames = {
  control: 'shadow-xs',
  card: 'shadow-lg hover:shadow-xl',
  dialog: 'shadow-xl',
} as const;

export const colorClassNames = {
  accentText: 'text-blue-600',
  accentHoverText: 'hover:text-blue-600',
  accentBorderHover: 'hover:border-blue-600',
  dangerText: 'text-red-600',
  mutedText: 'text-gray-500',
  placeholderMutedText: 'placeholder:text-gray-500',
  primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
  subtleText: 'text-gray-400',
  successText: 'text-green-600',
  textLink: 'text-blue-700 hover:text-blue-800',
  darkTextLink: 'text-blue-300 hover:text-blue-200',
} as const;

export const themeVariantClassNames = {
  activeAccentText: {
    light: 'text-blue-600!',
    dark: 'text-blue-400!',
  },
  borderedText: {
    light: 'border-gray-300 text-gray-700',
    dark: 'border-gray-500 text-white',
  },
  controlHoverSurface: {
    light: 'hover:bg-gray-50',
    dark: 'hover:bg-gray-500',
  },
  mutedText: {
    light: 'text-gray-500',
    dark: 'text-gray-300',
  },
  selectedSurface: {
    light: 'bg-gray-300 text-gray-700',
    dark: 'bg-gray-500 text-white',
  },
  subtleIcon: {
    light: 'text-gray-300',
    dark: 'text-gray-500',
  },
  subtleRing: {
    light: 'ring-gray-300/5',
    dark: 'ring-gray-500/5',
  },
} as const satisfies Record<string, ThemeVariantClassNames>;

export const surfaceClassNames = {
  card: `border ${shadowClassNames.card} ${transitionClassNames.shadow}`,
  panel: 'border py-5',
  popover: `${radiusClassNames.control} border ${shadowClassNames.dialog}`,
} as const;
