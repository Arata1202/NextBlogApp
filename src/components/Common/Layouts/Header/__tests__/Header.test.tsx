import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Header from '@/components/Common/Layouts/Header';

describe('Header', () => {
  it('aligns its content width with the main container', () => {
    render(<Header />);

    expect(screen.getByRole('navigation', { name: 'グローバルナビゲーション' })).toHaveClass(
      'max-w-340',
    );
  });

  it('keeps the logo layout size stable', () => {
    render(<Header />);

    expect(screen.getByRole('img', { name: 'リアル大学生' })).toHaveClass(
      'h-[28px]',
      'w-[154px]',
      'object-contain',
      'sm:h-[30px]',
      'sm:w-[165px]',
    );
  });

  it('opens and closes the mobile menu through accessible controls', async () => {
    const user = userEvent.setup();

    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: /プロフィール/ })
        .some((link) => link.getAttribute('href') === '/profile'),
    ).toBe(true);

    await user.click(screen.getAllByRole('button', { name: 'メニューを閉じる' })[0]);

    await waitFor(() => {
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
  });
});
