import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Search from '@/components/Common/Layouts/Sidebar/Elements/Search';

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe('Search', () => {
  beforeEach(() => {
    routerMock.push.mockReset();
  });

  it('navigates to the search page with the entered query', async () => {
    const user = userEvent.setup();

    render(<Search />);

    await user.type(screen.getByRole('searchbox', { name: '検索' }), 'React Query');
    await user.click(screen.getByRole('button', { name: '検索' }));

    expect(routerMock.push).toHaveBeenCalledWith('/search?q=React%20Query');
  });

  it('focuses results only when a re-search is submitted', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    window.history.replaceState(null, '', '/search?q=old');

    try {
      render(
        <>
          <h1 id="search-results-heading" tabIndex={-1}>
            検索結果
          </h1>
          <Search />
        </>,
      );
      const heading = screen.getByRole('heading');
      heading.scrollIntoView = scrollIntoView;

      await user.type(screen.getByRole('searchbox'), 'new');
      expect(scrollIntoView).not.toHaveBeenCalled();
      await user.keyboard('{Enter}');
      expect(window.location.search).toBe('?q=new');
      expect(heading).toHaveFocus();
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    } finally {
      window.history.replaceState(null, '', '/');
    }
  });

  it('shows a validation message and does not navigate when the query is empty', async () => {
    const user = userEvent.setup();

    render(<Search />);

    await user.click(screen.getByRole('button', { name: '検索' }));

    expect(screen.getByText('※ キーワードを入力してください')).toBeInTheDocument();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('focuses the search input with command k', () => {
    render(<Search />);

    const searchInput = screen.getByRole('searchbox', { name: '検索' });
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });

    window.dispatchEvent(event);

    expect(searchInput).toHaveFocus();
    expect(event.defaultPrevented).toBe(true);
  });
});
