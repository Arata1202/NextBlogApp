import { render } from '@testing-library/react';
import WithArticleItem from '@/components/Articles/Elements/WithArticleItem';
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

describe('WithArticleItem', () => {
  test('スナップショット（WithArticleItem）', () => {
    const { asFragment } = render(<WithArticleItem article={article} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
