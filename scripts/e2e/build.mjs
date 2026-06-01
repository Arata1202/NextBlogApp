import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const port = process.env.PLAYWRIGHT_PORT ?? '3000';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const mockFetchModuleUrl = pathToFileURL(path.join(scriptDirectory, 'mock-fetch.mjs')).href;

const env = {
  ...process.env,
  MICROCMS_API_KEY: 'e2e-fixture-api-key',
  MICROCMS_SERVICE_DOMAIN: 'e2e-fixture-service',
  NODE_OPTIONS: [process.env.NODE_OPTIONS, `--import=${mockFetchModuleUrl}`]
    .filter(Boolean)
    .join(' '),
  NEXT_PUBLIC_BASE_TITLE: process.env.NEXT_PUBLIC_BASE_TITLE ?? 'リアル大学生',
  NEXT_PUBLIC_BASE_URL: baseURL,
  NEXT_PUBLIC_API_SEARCH_URL: process.env.NEXT_PUBLIC_API_SEARCH_URL ?? '/api/search',
  NEXT_PUBLIC_API_SENDEMAIL_URL: process.env.NEXT_PUBLIC_API_SENDEMAIL_URL ?? '/api/sendemail',
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? 'e2e-recaptcha-site-key',
  NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: '',
  GOOGLE_ANALYTICS_ID: '',
  ONESIGNAL_APP_ID: '',
  SEARCH_CONSOLE_ID: '',
  SENTRY_AUTH_TOKEN: '',
  SENTRY_ORG: '',
  SENTRY_PROJECT: '',
};

const build = spawn('pnpm', ['build'], {
  env,
  stdio: 'inherit',
});

build.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
