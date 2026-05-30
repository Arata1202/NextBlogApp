import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import ThemeProvider from '@/contexts/ThemeProvider';

const nextThemesProviderMock = vi.hoisted(() => vi.fn());

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
    nextThemesProviderMock.mockReset();
  });

  it('delegates to next-themes immediately', () => {
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
