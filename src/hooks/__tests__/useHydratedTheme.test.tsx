import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHydratedTheme } from '@/hooks/useHydratedTheme';

const clientMock = vi.hoisted(() => ({
  value: false,
}));

const themeMock = vi.hoisted(() => ({
  theme: 'dark' as string | undefined,
  resolvedTheme: 'dark' as string | undefined,
  setTheme: vi.fn(),
  themes: ['light', 'dark'],
}));

vi.mock('@/hooks/useIsClient', () => ({
  useIsClient: () => clientMock.value,
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMock,
}));

function UseHydratedThemeHarness() {
  const { theme, resolvedTheme } = useHydratedTheme();

  return <div>{`${theme}/${resolvedTheme}`}</div>;
}

describe('useHydratedTheme', () => {
  beforeEach(() => {
    clientMock.value = false;
    themeMock.theme = 'dark';
    themeMock.resolvedTheme = 'dark';
  });

  it('uses the server-rendered light theme before hydration', () => {
    render(<UseHydratedThemeHarness />);

    expect(screen.getByText('light/light')).toBeInTheDocument();
  });

  it('uses the resolved client theme after hydration', () => {
    clientMock.value = true;
    themeMock.theme = 'system';
    themeMock.resolvedTheme = 'dark';

    render(<UseHydratedThemeHarness />);

    expect(screen.getByText('dark/dark')).toBeInTheDocument();
  });
});
