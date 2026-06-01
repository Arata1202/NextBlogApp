import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    test: {
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
  };
});
