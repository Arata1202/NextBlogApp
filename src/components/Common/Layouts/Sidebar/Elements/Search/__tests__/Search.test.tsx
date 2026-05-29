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

  it('shows a validation message and does not navigate when the query is empty', async () => {
    const user = userEvent.setup();

    render(<Search />);

    await user.click(screen.getByRole('button', { name: '検索' }));

    expect(screen.getByText('※ キーワードを入力してください')).toBeInTheDocument();
    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
