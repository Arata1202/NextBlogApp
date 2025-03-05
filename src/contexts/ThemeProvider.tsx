'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeProvider(props: ThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{props.children}</div>;
  }

  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>;
}
