import { render } from '@testing-library/react';
import ArticleComponent from '@/components/Articles/Article';
import { Article } from '@/libs/microcms';

const mockArticleData: Article = {
  id: '1',
  title: 'サンプルタイトル',
  description: 'この記事はサンプルの概要です。',
  thumbnail: { url: 'https://example.com/sample-thumbnail.jpg' },
  tags: [
    {
      id: 'tag1',
      name: 'サンプルタグ1',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  ],
  tags2: [
    {
      id: 'tag2',
      name: 'サンプルタグ2',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  ],
  introduction_blocks: [
    {
      custom_html2: '<div>サンプルのカスタムHTML</div>',
    },
  ],
  content_blocks: [
    {
      custom_html2: '<div>サンプルのカスタムHTML</div>',
    },
  ],
  related_articles: [{ articleLink3: 'https://example.com/related-article' }],
  createdAt: '2023-10-30T12:00:00Z',
  updatedAt: '2023-10-30T12:00:00Z',
  publishedAt: '2023-10-30T12:00:00Z',
};

describe('Article', () => {
  test('スナップショット（Article）', () => {
    const { asFragment } = render(<ArticleComponent data={mockArticleData} articles={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
