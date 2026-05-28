import { describe, expect, it } from 'vitest';
import { mapBlogArticlesToUnified, mixUnifiedArticles } from '@/libs/unified';
import { createArticle, createUnifiedArticle } from '@/test/factories';

describe('mapBlogArticlesToUnified', () => {
  it('maps microCMS articles to the unified article shape', () => {
    expect(
      mapBlogArticlesToUnified([
        createArticle({
          id: 'article-a',
          title: 'A',
          description: undefined,
          publishedAt: '2024-01-01T00:00:00.000Z',
        }),
      ]),
    ).toEqual([
      expect.objectContaining({
        id: 'blog-article-a',
        title: 'A',
        description: '',
        publishedAt: '2024-01-01T00:00:00.000Z',
        url: '/articles/article-a',
        source: 'blog',
      }),
    ]);
  });
});

describe('mixUnifiedArticles', () => {
  it('sorts blog and external articles by publishedAt descending and applies the limit', () => {
    const result = mixUnifiedArticles(
      [
        createUnifiedArticle({ id: 'blog-old', publishedAt: '2024-01-01T00:00:00.000Z' }),
        createUnifiedArticle({ id: 'blog-new', publishedAt: '2024-03-01T00:00:00.000Z' }),
      ],
      [createUnifiedArticle({ id: 'zenn-middle', publishedAt: '2024-02-01T00:00:00.000Z' })],
      2,
    );

    expect(result.map((article) => article.id)).toEqual(['blog-new', 'zenn-middle']);
  });
});
