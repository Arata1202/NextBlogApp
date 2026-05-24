'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useIsClient } from '@/hooks/useIsClient';

export default function ThemeProvider(props: ThemeProviderProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <div style={{ visibility: 'hidden' }}>{props.children}</div>;
  }

  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>;
}
