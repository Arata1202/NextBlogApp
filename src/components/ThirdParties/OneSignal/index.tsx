import { getOneSignalAppId } from '@/config/serverEnv';
import OneSignalClient from './Client';

export default function OneSignal() {
  const onesignalAppId = getOneSignalAppId();

  if (!onesignalAppId) {
    return null;
  }

  return <OneSignalClient appId={onesignalAppId} />;
}
