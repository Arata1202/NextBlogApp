'use client';

import Script from 'next/script';
import { useAppWebViewMode } from '@/hooks/useAppWebViewMode';
import { useHasMounted } from '@/hooks/useHasMounted';

type Props = {
  appId: string;
};

export default function OneSignalClient({ appId }: Props) {
  const hasMounted = useHasMounted();
  const isAppWebViewMode = useAppWebViewMode();

  if (!hasMounted || isAppWebViewMode) {
    return null;
  }

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
        onError={() => console.warn('OneSignal SDK failed to load.')}
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            try {
              await OneSignal.init({ appId: ${JSON.stringify(appId)} });
            } catch {
              console.warn('OneSignal initialization failed.');
            }
          });
        `}
      </Script>
    </>
  );
}
