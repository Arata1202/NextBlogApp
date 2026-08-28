import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { useEffect, useRef, type ReactNode } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { useGlobals } from 'storybook/preview-api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/globals.css';

type Theme = 'light' | 'dark';

type ThemeSyncProps = {
  globalTheme: Theme;
  updateGlobals: (globals: Record<string, unknown>) => void;
  children: ReactNode;
};

function ThemeSync({ globalTheme, updateGlobals, children }: ThemeSyncProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const previousGlobalTheme = useRef(globalTheme);
  const initialized = useRef(false);

  useEffect(() => {
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') {
      return;
    }

    if (!initialized.current) {
      initialized.current = true;
      setTheme(globalTheme);
      return;
    }

    if (previousGlobalTheme.current !== globalTheme) {
      previousGlobalTheme.current = globalTheme;
      setTheme(globalTheme);
      return;
    }

    if (resolvedTheme !== globalTheme) {
      updateGlobals({ theme: resolvedTheme });
    }
  }, [globalTheme, resolvedTheme, setTheme, updateGlobals]);

  return children;
}

const WithTheme: Decorator = (Story, context) => {
  const [, updateGlobals] = useGlobals();
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';

  document.body.classList.toggle('DarkTheme', theme === 'dark');
  document.body.classList.toggle('LightTheme', theme === 'light');

  return (
    <ThemeProvider
      defaultTheme={theme}
      enableSystem={false}
      storageKey={`storybook-theme-${context.id}`}
    >
      <ThemeSync globalTheme={theme} updateGlobals={updateGlobals}>
        <div className={`${themeClassName} min-h-screen p-6`}>
          <Story />
        </div>
      </ThemeSync>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [WithTheme],
  globalTypes: {
    theme: {
      description: 'Component theme',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: { test: 'error' },
  },
};

export default preview;
