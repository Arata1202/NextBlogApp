import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScrollTopButton from '@/components/Common/Layouts/ScrollToTop';

describe('ScrollTopButton', () => {
  const scrollToMock = vi.fn();

  afterEach(() => vi.unstubAllGlobals());

  it.each([
    [false, 'smooth'],
    [true, 'auto'],
  ] as const)(
    'respects reduced motion (%s) when scrolling to the top',
    async (reducedMotion, behavior) => {
      scrollToMock.mockClear();
      vi.stubGlobal('scrollTo', scrollToMock);
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
      }));
      const user = userEvent.setup();

      render(<ScrollTopButton />);

      const button = screen.getByRole('button', { name: 'ページ上部へ戻る' });

      expect(button).toHaveClass('cursor-pointer');

      await user.click(button);

      expect(scrollToMock).toHaveBeenCalledWith({
        top: 0,
        behavior,
      });
    },
  );
});
