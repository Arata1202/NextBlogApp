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
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: ${JSON.stringify(appId)},
            });
          });
        `}
      </Script>
    </>
  );
}
