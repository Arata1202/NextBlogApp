import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeSwitch from '@/components/Common/Layouts/ThemeSwitch';

const themeMock = vi.hoisted(() => ({
  resolvedTheme: 'light' as 'light' | 'dark',
  setTheme: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => themeMock,
}));

describe('ThemeSwitch', () => {
  beforeEach(() => {
    themeMock.resolvedTheme = 'light';
    themeMock.setTheme.mockReset();
  });

  it('switches from light to dark through an accessible button', async () => {
    const user = userEvent.setup();

    render(<ThemeSwitch />);

    await user.click(screen.getByRole('button', { name: 'ダークテーマに切り替え' }));

    expect(themeMock.setTheme).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light through an accessible button', async () => {
    const user = userEvent.setup();
    themeMock.resolvedTheme = 'dark';

    render(<ThemeSwitch />);

    await user.click(screen.getByRole('button', { name: 'ライトテーマに切り替え' }));

    expect(themeMock.setTheme).toHaveBeenCalledWith('light');
  });
});
