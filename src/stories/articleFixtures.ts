import type { Article } from '@/types/microcms';
import type { UnifiedArticle } from '@/types/unified';

const publishedAt = '2026-08-01T09:00:00.000Z';
const updatedAt = '2026-08-05T09:00:00.000Z';

export const articleFixture = {
  id: 'storybook-article',
  title: '大学生活で役立ったWebサービスと、無理なく続けるための使い方',
  description: '授業や課外活動、個人開発を続ける中で実際に役立ったサービスを紹介します。',
  thumbnail: {
    url: '/images/thumbnail/7.webp',
    width: 1200,
    height: 630,
  },
  categories: [
    {
      id: 'programming',
      name: 'プログラミング',
      createdAt: publishedAt,
      updatedAt,
      publishedAt,
      revisedAt: updatedAt,
    },
  ],
  tags: [],
  introduction_blocks: [],
  content_blocks: [],
  createdAt: publishedAt,
  updatedAt,
  publishedAt,
  revisedAt: updatedAt,
} satisfies Article;

export const sponsoredArticleFixture: Article = {
  ...articleFixture,
  id: 'storybook-sponsored-article',
  isSponsored: true,
};

export const unifiedArticleFixture = {
  id: 'storybook-unified-article',
  title: articleFixture.title,
  description: articleFixture.description,
  publishedAt,
  updatedAt,
  thumbnail: articleFixture.thumbnail,
  url: '/articles/storybook-unified-article',
  source: 'blog',
} satisfies UnifiedArticle;
