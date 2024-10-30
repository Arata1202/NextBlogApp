import { render } from '@testing-library/react';
import ContactPage from '@/components/Fixed/Contact';

const mockSidebarArticles = {
  contents: [
    { id: '1', title: '記事1', description: '概要1', url: '/articles/1' },
    { id: '2', title: '記事2', description: '概要2', url: '/articles/2' },
    { id: '3', title: '記事3', description: '概要3', url: '/articles/3' },
  ],
};

describe('ContactPage', () => {
  test('スナップショット（ContactPage）', () => {
    const { asFragment } = render(<ContactPage sidebarArticles={mockSidebarArticles} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
