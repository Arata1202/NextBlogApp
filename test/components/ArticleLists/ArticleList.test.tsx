import { render } from '@testing-library/react';
import ArticleList from '@/components/ArticleLists/ArticleList';

jest.mock('@/components/ArticleLists/ArticleListItem');
jest.mock('@/components/Sidebars/TopSidebar');
jest.mock('@/components/Adsense/Display');
jest.mock('@/components/Elements/Share');

describe('ArticleList', () => {
  test('スナップショット(ArticleList)', () => {
    const { asFragment } = render(<ArticleList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
