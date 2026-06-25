'use client';

import { useEffect } from 'react';
import { getGoogleAdSensePublisherId } from '@/config/publicEnv';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';

const ADSENSE_SCRIPT_ID = 'google-adsense-script';

export default function GoogleAdSense() {
  const isAppWebViewMode = useAppWebViewMode();
  const publisherId = getGoogleAdSensePublisherId();

  useEffect(() => {
    if (isAppWebViewMode || !publisherId || document.getElementById(ADSENSE_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => script.remove();
  }, [isAppWebViewMode, publisherId]);

  return null;
}
