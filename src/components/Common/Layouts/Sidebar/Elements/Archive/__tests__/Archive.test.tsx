import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Archive from '@/components/Common/Layouts/Sidebar/Elements/Archive';

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  usePathname: () => '/',
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe('Archive', () => {
  beforeEach(() => {
    routerMock.push.mockReset();
  });

  it('pads the selected month and navigates to the monthly archive route', async () => {
    const user = userEvent.setup();

    render(<Archive archiveList={[{ year: '2024', month: '1' }]} />);

    await user.click(screen.getByRole('button', { name: 'アーカイブを選択' }));
    await user.click(screen.getByRole('option', { name: '2024年1月' }));

    expect(routerMock.push).toHaveBeenCalledWith('/archive/2024/01');
    expect(screen.getByRole('button', { name: '2024年1月' })).toBeInTheDocument();
  });
});
