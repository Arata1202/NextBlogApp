'use client';

import { useTheme } from 'next-themes';
import { useHasMounted } from '@/hooks/useHasMounted';

export function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  return mounted ? resolvedTheme : undefined;
}
