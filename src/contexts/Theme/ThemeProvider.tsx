'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { FC, useState, useEffect } from 'react';

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{props.children}</div>;
  }

  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>;
};
