import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollTopButton from '@/components/Common/Layouts/ScrollToTop';

describe('ScrollTopButton', () => {
  const scrollToMock = vi.fn();

  beforeEach(() => {
    scrollToMock.mockReset();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
  });

  it('scrolls smoothly to the top from an accessible button', async () => {
    const user = userEvent.setup();

    render(<ScrollTopButton />);

    const button = screen.getByRole('button', { name: 'ページ上部へ戻る' });

    expect(button).toHaveClass('cursor-pointer');

    await user.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
