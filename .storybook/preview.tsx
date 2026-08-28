import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';

  document.body.classList.toggle('DarkTheme', theme === 'dark');
  document.body.classList.toggle('LightTheme', theme === 'light');

  return (
    <ThemeProvider
      key={`${context.id}-${theme}`}
      defaultTheme={theme}
      forcedTheme={theme}
      enableSystem={false}
      storageKey={`storybook-theme-${context.id}`}
    >
      <div className={`${themeClassName} min-h-screen p-6`}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
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
