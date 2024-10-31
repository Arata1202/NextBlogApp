import { render } from '@testing-library/react';
import ArticleListItem from '@/components/ArticleLists/ArticleListItem';
import { Article } from '@/libs/microcms';

jest.mock('@/components/Categories/CategoryList');
jest.mock('@/components/Elements/Date');

const article: Article = {
  id: '1',
  title: 'タイトル',
  description: '概要',
  thumbnail: { url: 'https://thumbnail.com/thumbnail.jpg' },
  publishedAt: '2023-10-30T12:00:00Z',
  content_blocks: [],
  introduction_blocks: [],
  createdAt: '2023-10-30T12:00:00Z',
  updatedAt: '2023-10-30T12:00:00Z',
};

describe('ArticleListItem', () => {
  test('スナップショット(ArticleListItem)', () => {
    const { asFragment } = render(<ArticleListItem key={article.id} article={article} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
