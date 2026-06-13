export const themeClassNames = {
  light: 'LightTheme',
  dark: 'DarkTheme',
} as const;

export const getThemeClassName = (theme?: string) => {
  return theme === 'dark' ? themeClassNames.dark : themeClassNames.light;
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
  primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
  textLink: 'text-blue-700 hover:text-blue-800',
  darkTextLink: 'text-blue-300 hover:text-blue-200',
} as const;

export const surfaceClassNames = {
  card: `border ${shadowClassNames.card} ${transitionClassNames.shadow}`,
  panel: 'border py-5',
  popover: `${radiusClassNames.control} border ${shadowClassNames.dialog}`,
} as const;
