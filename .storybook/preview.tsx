import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { useEffect, useRef, type ReactNode } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { useGlobals } from 'storybook/preview-api';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
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
  const pendingTheme = useRef<Theme | null>(globalTheme);

  useEffect(() => {
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') {
      return;
    }

    if (previousGlobalTheme.current !== globalTheme) {
      previousGlobalTheme.current = globalTheme;
      pendingTheme.current = globalTheme;
    }
    if (pendingTheme.current) {
      if (resolvedTheme !== pendingTheme.current) {
        setTheme(pendingTheme.current);
        return;
      }
      pendingTheme.current = null;
    }

    if (resolvedTheme !== globalTheme) {
      updateGlobals({ theme: resolvedTheme });
    }
  }, [globalTheme, resolvedTheme, setTheme, updateGlobals]);

  useEffect(() => {
    const themeClass = globalTheme === 'dark' ? 'DarkTheme' : 'LightTheme';
    document.body.classList.add(themeClass);
    return () => document.body.classList.remove(themeClass);
  }, [globalTheme]);

  return children;
}

const WithTheme: Decorator = (Story, context) => {
  const [, updateGlobals] = useGlobals();
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';

  return (
    <ThemeProvider
      defaultTheme={theme}
      enableSystem={false}
      storageKey={`storybook-theme-${context.id}`}
    >
      <ThemeSync globalTheme={theme} updateGlobals={updateGlobals}>
        <div className={`${themeClassName} min-h-screen p-6`} data-app-root>
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
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
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
