import { defineConfig, devices } from '@playwright/test';

import { baseURL, localOrigin, port } from './scripts/e2e/config';

const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github']] : [['list'], ['html']],
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer:
    new URL(baseURL).origin === localOrigin
      ? {
          command: `pnpm build:e2e && node scripts/e2e/serve-static.mjs out --port=${port}`,
          url: localOrigin,
          reuseExistingServer,
          timeout: 180_000,
        }
      : undefined,
});
