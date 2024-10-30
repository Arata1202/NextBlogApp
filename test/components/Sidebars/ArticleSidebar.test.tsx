import { render } from '@testing-library/react';
import ArticleSidebar from '@/components/Sidebars/ArticleSidebar';
import type { Article } from '@/libs/microcms';

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'サンプル記事1',
    description: 'これはサンプル記事1の説明です',
    thumbnail: { url: 'https://example.com/thumbnail1.jpg' },
    publishedAt: '2023-10-30T12:00:00Z',
    content_blocks: [],
    introduction_blocks: [],
    createdAt: '2023-10-30T12:00:00Z',
    updatedAt: '2023-10-30T12:00:00Z',
  },
  {
    id: '2',
    title: 'サンプル記事2',
    description: 'これはサンプル記事2の説明です',
    thumbnail: { url: 'https://example.com/thumbnail2.jpg' },
    publishedAt: '2023-10-30T12:00:00Z',
    content_blocks: [],
    introduction_blocks: [],
    createdAt: '2023-10-30T12:00:00Z',
    updatedAt: '2023-10-30T12:00:00Z',
  },
];

const mockContentBlocks = [
  {
    rich_text2: '<h2>サンプルヘッディング</h2>',
    adsense: '1234567890',
    bubble_name: '名前',
    bubble_text: 'テキスト',
    bubble_image: { url: 'https://example.com/image.jpg' },
  },
];

describe('ArticleSidebar', () => {
  test('スナップショット（ArticleSidebar）', () => {
    const { asFragment } = render(
      <ArticleSidebar articles={mockArticles} contentBlocks={mockContentBlocks} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
