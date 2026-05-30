import { getSearchConsoleId } from '@/config/serverEnv';

export default function GoogleSearchConsole() {
  const searchConsoleId = getSearchConsoleId();

  if (!searchConsoleId) {
    return null;
  }

  return <meta name="google-site-verification" content={searchConsoleId} />;
}
