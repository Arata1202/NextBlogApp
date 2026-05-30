'use client';

import { useTheme, type UseThemeProps } from 'next-themes';
import { useIsClient } from '@/hooks/useIsClient';

type ColorTheme = 'light' | 'dark';

const normalizeTheme = (theme: string | undefined): ColorTheme => {
  return theme === 'dark' ? 'dark' : 'light';
};

export const useHydratedTheme = (): UseThemeProps & {
  theme: ColorTheme;
  resolvedTheme: ColorTheme;
} => {
  const themeState = useTheme();
  const isClient = useIsClient();
  const colorTheme = normalizeTheme(themeState.resolvedTheme ?? themeState.theme);

  return {
    ...themeState,
    theme: isClient ? colorTheme : 'light',
    resolvedTheme: isClient ? colorTheme : 'light',
  };
};
