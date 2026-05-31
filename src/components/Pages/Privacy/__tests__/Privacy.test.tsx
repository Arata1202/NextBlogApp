import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import PrivacyPage from '@/components/Pages/Privacy';

vi.mock('@/components/Common/PageHeading', () => ({
  default: () => <div>Privacy heading</div>,
}));

vi.mock('@/components/Common/Layouts/Container/MainContainer', () => ({
  default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

vi.mock('@/components/Common/Layouts/Container/ContentContainer', () => ({
  default: ({ children }: { children: ReactNode }) => <section>{children}</section>,
}));

vi.mock('@/components/Common/Layouts/Sidebar', () => ({
  default: () => <aside>Sidebar</aside>,
}));

vi.mock('@/components/Common/Layouts/Container/FixedDateContainer', () => ({
  default: () => <div>Fixed date</div>,
}));

vi.mock('@/components/ThirdParties/GoogleAdSense/Elements/AdUnit', () => ({
  default: () => null,
}));

vi.mock('@/components/Common/Share', () => ({
  default: () => <div>Share</div>,
}));

describe('PrivacyPage', () => {
  it('renders a table of contents linked to the privacy markdown headings', () => {
    render(<PrivacyPage recentArticles={[]} tags={[]} archiveList={[]} />);

    const tocLink = screen.getByRole('link', {
      name: '1 個人情報取り扱いに関する基本方針',
    });

    expect(tocLink).toHaveAttribute('href', '#privacy-heading-1');
    expect(
      screen.getByRole('heading', { name: '個人情報取り扱いに関する基本方針' }),
    ).toHaveAttribute('id', 'privacy-heading-1');
  });
});
