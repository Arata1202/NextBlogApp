'use client';

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export const OneSignalInitial = () => {
  useEffect(() => {
    const oneSignalInit = async () => {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
        notifyButton: {
          enable: true,
        },
      }).then(() => {
        OneSignal.Slidedown.promptPush();
      });
    };
    oneSignalInit();
  }, []);
  return (
    <div className="mt-5 flex justify-center">
      <div className="onesignal-customlink-container"></div>
    </div>
  );
};
