import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import ThemeProvider from '@/contexts/ThemeProvider';

const isClientMock = vi.hoisted(() => ({
  value: false,
}));

const nextThemesProviderMock = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/useIsClient', () => ({
  useIsClient: () => isClientMock.value,
}));

vi.mock('next-themes', async () => {
  const React = await import('react');

  return {
    ThemeProvider: ({ children, ...props }: { children?: ReactNode; defaultTheme?: string }) => {
      nextThemesProviderMock(props);
      return React.createElement('div', { 'data-testid': 'next-themes-provider' }, children);
    },
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    isClientMock.value = false;
    nextThemesProviderMock.mockReset();
  });

  it('hides children until client-side theme state is available', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <div>Theme child</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme child').parentElement).toHaveStyle({
      visibility: 'hidden',
    });
    expect(nextThemesProviderMock).not.toHaveBeenCalled();
  });

  it('delegates to next-themes after the client is ready', () => {
    isClientMock.value = true;

    render(
      <ThemeProvider defaultTheme="light">
        <div>Theme child</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('next-themes-provider')).toContainElement(
      screen.getByText('Theme child'),
    );
    expect(nextThemesProviderMock).toHaveBeenCalledWith({ defaultTheme: 'light' });
  });
});
