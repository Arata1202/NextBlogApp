import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createListResponse, createUnifiedArticle } from '@/test/factories';

const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
}));

const zennMock = vi.hoisted(() => ({
  getZennFeed: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/zenn', () => zennMock);

describe('getMixedRecentArticles', () => {
  beforeEach(() => {
    microcmsMock.getList.mockReset();
    zennMock.getZennFeed.mockReset();
  });

  it('fetches blog and Zenn articles, mixes them by date, and respects the limit', async () => {
    const { getMixedRecentArticles } = await import('@/libs/recent');

    microcmsMock.getList.mockResolvedValue(
      createListResponse([
        createArticle({ id: 'old-blog', publishedAt: '2024-01-01T00:00:00.000Z' }),
        createArticle({ id: 'new-blog', publishedAt: '2024-03-01T00:00:00.000Z' }),
      ]),
    );
    zennMock.getZennFeed.mockResolvedValue([
      createUnifiedArticle({
        id: 'zenn-middle',
        source: 'zenn',
        publishedAt: '2024-02-01T00:00:00.000Z',
      }),
    ]);

    const result = await getMixedRecentArticles(2, 20);

    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 20,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    });
    expect(zennMock.getZennFeed).toHaveBeenCalledWith('realunivlog', 20);
    expect(result.map((article) => article.id)).toEqual(['blog-new-blog', 'zenn-middle']);
  });
});
