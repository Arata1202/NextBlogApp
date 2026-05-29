import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
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
  href: string | { toString: () => string };
  children?: ReactNode;
  [key: string]: unknown;
};

afterEach(() => {
  cleanup();
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
      React.createElement('a', { href: href.toString(), ...props }, children),
  };
});

vi.mock('next-themes', async () => {
  const React = await import('react');

  return {
    ThemeProvider: ({ children }: { children?: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useTheme: () => ({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: vi.fn(),
    }),
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => nextNavigationMock.pathname,
  useRouter: () => nextNavigationMock,
  useSearchParams: () => new URLSearchParams(globalThis.location?.search ?? ''),
  notFound: nextNavigationMock.notFound,
}));
