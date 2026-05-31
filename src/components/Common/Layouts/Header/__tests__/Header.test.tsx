import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from '@/components/Common/Layouts/Header';

function mockMobileViewport() {
  const originalMatchMedia = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(max-width: 1023px)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
  };
}

describe('Header', () => {
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

  it('clears restored mobile logo focus after pointer navigation while preserving keyboard focus', async () => {
    const restoreMatchMedia = mockMobileViewport();

    try {
      render(<Header />);

      const logoLink = screen.getByRole('link', { name: 'リアル大学生' });

      logoLink.focus();
      expect(logoLink).toHaveFocus();

      window.dispatchEvent(new Event('pageshow'));

      await waitFor(() => {
        expect(logoLink).not.toHaveFocus();
      });

      logoLink.focus();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      window.dispatchEvent(new Event('pageshow'));

      expect(logoLink).toHaveFocus();
    } finally {
      restoreMatchMedia();
    }
  });

  it('clears logo focus restored after closing the mobile menu with pointer input', async () => {
    const restoreMatchMedia = mockMobileViewport();

    try {
      render(<Header />);

      const logoLink = screen.getByRole('link', { name: 'リアル大学生' });

      logoLink.focus();
      expect(logoLink).toHaveFocus();

      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }));
      const closeButtons = screen.getAllByRole('button', { name: 'メニューを閉じる' });
      fireEvent.click(closeButtons[closeButtons.length - 1]);

      logoLink.focus();
      expect(logoLink).toHaveFocus();

      await waitFor(() => {
        expect(logoLink).not.toHaveFocus();
      });
    } finally {
      restoreMatchMedia();
    }
  });
});
