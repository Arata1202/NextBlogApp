import { GoogleAnalytics as GA4 } from '@next/third-parties/google';
import { getGoogleAnalyticsId } from '@/config/serverEnv';

export default function GoogleAnalytics() {
  const gaId = getGoogleAnalyticsId();

  if (!gaId) {
    return null;
  }

  return <GA4 gaId={gaId} />;
}
