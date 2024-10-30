import { render } from '@testing-library/react';
import SidebarArticleListItem from '@/components/Sidebars/Elements/Elements/SidebarArticleListItem';
import { Article } from '@/libs/microcms';

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

describe('SidebarArticleListItem', () => {
  test('スナップショット（SidebarArticleListItem）', () => {
    const { asFragment } = render(<SidebarArticleListItem key={article.id} article={article} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
