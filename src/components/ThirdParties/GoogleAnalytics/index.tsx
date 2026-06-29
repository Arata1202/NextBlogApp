import { getGoogleAnalyticsId } from '@/config/serverEnv';
import GoogleAnalyticsClient from './Client';

export default function GoogleAnalytics() {
  const gaId = getGoogleAnalyticsId();

  if (!gaId) {
    return null;
  }

  return <GoogleAnalyticsClient gaId={gaId} />;
}
