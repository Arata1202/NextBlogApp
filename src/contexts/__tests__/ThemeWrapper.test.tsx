import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeWrapper from '@/contexts/ThemeWrapper';

const themeMock = vi.hoisted(() => ({
  theme: 'light' as 'light' | 'dark',
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMock,
}));

describe('ThemeWrapper', () => {
  beforeEach(() => {
    document.body.className = '';
    themeMock.theme = 'light';
  });

  it('toggles the dark theme class on the document body', () => {
    themeMock.theme = 'dark';
    const { rerender } = render(<ThemeWrapper />);

    expect(document.body).toHaveClass('DarkTheme');

    themeMock.theme = 'light';
    rerender(<ThemeWrapper />);

    expect(document.body).not.toHaveClass('DarkTheme');
  });
});
