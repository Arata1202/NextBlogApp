import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['react-slick', 'storybook/viewport'],
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.ts'],
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
            restoreMocks: true,
            clearMocks: true,
            coverage: {
              provider: 'v8',
              reporter: ['text', 'html', 'lcov'],
              reportsDirectory: 'coverage',
              exclude: [
                '**/*.config.*',
                '**/*.d.ts',
                '.next/**',
                'coverage/**',
                'node_modules/**',
                'out/**',
                'public/**',
                'src/app/manifest.json',
                'src/app/not-found.tsx',
                'src/components/Common/Elements/SocialIcon/**',
                'src/components/Common/Layouts/Container/ContentContainer/**',
                'src/components/Common/Layouts/Container/FixedContentContainer/**',
                'src/components/Common/Layouts/Container/MainContainer/**',
                'src/components/Common/Layouts/Footer/**',
                'src/components/Common/Layouts/Sidebar/Elements/Popular/**',
                'src/components/Pages/**',
                'src/components/ThirdParties/Embedly/**',
                'src/components/ThirdParties/GoogleAdSense/index.tsx',
                'src/components/ThirdParties/GoogleAnalytics/**',
                'src/components/ThirdParties/GoogleSearchConsole/**',
                'src/components/ThirdParties/Instagram/**',
                'src/components/ThirdParties/OneSignal/**',
                'src/constants/**',
                'src/contents/**',
                'src/styles/**',
                'src/test/**',
                'src/types/**',
              ],
            },
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(import.meta.dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            fileParallelism: false,
            maxWorkers: 1,
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  };
});
