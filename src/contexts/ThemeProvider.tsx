'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import type { ReactNode } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

function ThemeHydrationBoundary({ children }: { children: ReactNode }) {
  const isClient = useIsClient();

  return <div style={{ visibility: isClient ? 'visible' : 'hidden' }}>{children}</div>;
}

export default function ThemeProvider({ children, ...themeProviderProps }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...themeProviderProps}>
      <ThemeHydrationBoundary>{children}</ThemeHydrationBoundary>
    </NextThemesProvider>
  );
}
