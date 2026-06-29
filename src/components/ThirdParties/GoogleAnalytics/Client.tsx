'use client';

import { GoogleAnalytics as GA4 } from '@next/third-parties/google';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';
import { useHasMounted } from '@/hooks/useHasMounted';

type Props = {
  gaId: string;
};

export default function GoogleAnalyticsClient({ gaId }: Props) {
  const hasMounted = useHasMounted();
  const isAppWebViewMode = useAppWebViewMode();

  if (!hasMounted || isAppWebViewMode) {
    return null;
  }

  return <GA4 gaId={gaId} />;
}
