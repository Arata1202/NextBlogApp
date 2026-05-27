import type { Article, Category, Tag } from '@/types/microcms';
import type { UnifiedArticle } from '@/types/unified';
import type { MicroCMSListResponse } from 'microcms-js-sdk';

export const createCategory = (overrides: Partial<Category> = {}): Category =>
  ({
    id: 'category-1',
    name: 'Category',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }) as Category;

export const createTag = (overrides: Partial<Tag> = {}): Tag =>
  ({
    id: 'tag-1',
    name: 'Tag',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }) as Tag;

export const createArticle = (overrides: Partial<Article> = {}): Article =>
  ({
    id: 'article-1',
    title: 'Article title',
    description: 'Article description',
    thumbnail: {
      url: 'https://images.microcms-assets.io/assets/example/article.webp',
      width: 1200,
      height: 630,
    },
    categories: [createCategory()],
    tags: [createTag()],
    introduction_blocks: [],
    content_blocks: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-02T00:00:00.000Z',
    ...overrides,
  }) as Article;

export const createUnifiedArticle = (overrides: Partial<UnifiedArticle> = {}): UnifiedArticle => ({
  id: 'blog-article-1',
  title: 'Unified article title',
  description: 'Unified article description',
  publishedAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  thumbnail: {
    url: 'https://images.microcms-assets.io/assets/example/article.webp',
    width: 1200,
    height: 630,
  },
  thumbnailUrl: 'https://images.microcms-assets.io/assets/example/article.webp',
  url: '/articles/article-1',
  source: 'blog',
  ...overrides,
});

export const createListResponse = <T>(
  contents: T[],
  overrides: Partial<Omit<MicroCMSListResponse<T>, 'contents'>> = {},
): MicroCMSListResponse<T> => ({
  contents: contents as MicroCMSListResponse<T>['contents'],
  totalCount: contents.length,
  offset: 0,
  limit: contents.length,
  ...overrides,
});
