import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { format as formatUrl, type UrlObject } from 'node:url';
import type { ReactNode } from 'react';

const nextNavigationMock = vi.hoisted(() => ({
  pathname: '/',
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

type MockLinkProps = {
  href: string | UrlObject;
  children?: ReactNode;
  [key: string]: unknown;
};

afterEach(() => {
  cleanup();
  nextNavigationMock.pathname = '/';
});

if (!Element.prototype.getAnimations) {
  Object.defineProperty(Element.prototype, 'getAnimations', {
    configurable: true,
    value: () => [],
  });
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

vi.mock('next/link', async () => {
  const React = await import('react');

  return {
    default: ({ href, children, ...props }: MockLinkProps) =>
      React.createElement(
        'a',
        { href: typeof href === 'string' ? href : formatUrl(href), ...props },
        children,
      ),
  };
});

vi.mock('next-themes', async () => {
  const setTheme = vi.fn();
  const React = await import('react');

  return {
    ThemeProvider: ({ children }: { children?: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useTheme: () => ({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme,
    }),
  };
});

const searchParamsForTest = (() => {
  let lastSearch: string | undefined;
  let result: URLSearchParams;
  return () => {
    const search = globalThis.location?.search ?? '';
    if (search !== lastSearch) {
      result = new URLSearchParams(search);
      const readonly = () => {
        throw new TypeError('ReadonlyURLSearchParams cannot be modified');
      };
      result.append = result.delete = result.set = result.sort = readonly;
      lastSearch = search;
    }
    return result;
  };
})();

vi.mock('next/navigation', () => ({
  usePathname: () => nextNavigationMock.pathname,
  useRouter: () => nextNavigationMock,
  useSearchParams: () => searchParamsForTest(),
  notFound: nextNavigationMock.notFound,
}));
