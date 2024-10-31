import { render } from '@testing-library/react';
import DisclaimerPage from '@/components/Fixed/Disclaimer';

jest.mock('@/components/Elements/Share');
jest.mock('@/components/Articles/Elements/AdAlert');
jest.mock('@/components/Sidebars/FixedSidebar');
jest.mock('@/components/Elements/Date');
jest.mock('@/components/Adsense/Display');

const mockSidebarArticles = {
  contents: [
    { id: '1', title: '記事1', description: '概要1', url: '/articles/1' },
    { id: '2', title: '記事2', description: '概要2', url: '/articles/2' },
    { id: '3', title: '記事3', description: '概要3', url: '/articles/3' },
  ],
};

describe('DisclaimerPage', () => {
  test('スナップショット（DisclaimerPage）', () => {
    const { asFragment } = render(<DisclaimerPage sidebarArticles={mockSidebarArticles} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
