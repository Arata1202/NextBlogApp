import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle } from '@/test/factories';

const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);

describe('archive helpers', () => {
  beforeEach(() => {
    microcmsMock.getAllLists.mockReset();
  });

  it('returns unique archive months sorted by newest year and month', async () => {
    const { getArchiveList } = await import('@/libs/archive');

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({ publishedAt: '2024-01-10T00:00:00.000Z' }),
      createArticle({ publishedAt: '2024-03-10T00:00:00.000Z' }),
      createArticle({ publishedAt: '2023-12-10T00:00:00.000Z' }),
      createArticle({ publishedAt: '2024-03-20T00:00:00.000Z' }),
      createArticle({ publishedAt: undefined }),
    ]);

    await expect(getArchiveList()).resolves.toEqual([
      { year: '2024', month: '3' },
      { year: '2024', month: '1' },
      { year: '2023', month: '12' },
    ]);
    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({ fields: 'publishedAt' });
  });

  it('pads month values for static params', async () => {
    const { getArchiveStaticParams } = await import('@/libs/archive');

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({ publishedAt: '2024-01-10T00:00:00.000Z' }),
      createArticle({ publishedAt: '2024-12-10T00:00:00.000Z' }),
    ]);

    await expect(getArchiveStaticParams()).resolves.toEqual([
      { year: '2024', month: '12' },
      { year: '2024', month: '01' },
    ]);
  });
});
