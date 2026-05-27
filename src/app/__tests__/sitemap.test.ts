import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle } from '@/test/factories';

const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);

describe('sitemap', () => {
  beforeEach(() => {
    microcmsMock.getAllLists.mockReset();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
  });

  it('combines top, static, category, and article URLs', async () => {
    const sitemap = (await import('@/app/sitemap')).default;

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({
        id: 'article-a',
        updatedAt: '2024-01-02T00:00:00.000Z',
      }),
    ]);

    const result = await sitemap();

    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({ fields: 'id,updatedAt' });
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://example.com' }),
        expect.objectContaining({ url: 'https://example.com/contact' }),
        expect.objectContaining({ url: 'https://example.com/category/programming' }),
        expect.objectContaining({
          url: 'https://example.com/articles/article-a',
          lastModified: '2024-01-02T00:00:00.000Z',
        }),
      ]),
    );
  });
});
