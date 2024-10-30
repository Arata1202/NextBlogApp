import { render } from '@testing-library/react';
import ArticleList from '@/components/ArticleLists/ArticleList';

describe('ArticleList', () => {
  test('スナップショット(ArticleList)', () => {
    const { asFragment } = render(<ArticleList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
