import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle } from '@/test/factories';

const fsMock = vi.hoisted(() => ({
  writeFileSync: vi.fn(),
}));

const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
}));

const zennMock = vi.hoisted(() => ({
  getZennFeed: vi.fn(),
}));

vi.mock('fs', () => ({
  default: fsMock,
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/zenn', () => zennMock);

describe('generateRssFeed', () => {
  beforeEach(() => {
    fsMock.writeFileSync.mockReset();
    microcmsMock.getAllLists.mockReset();
    zennMock.getZennFeed.mockReset();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_TITLE = 'Example Blog';
  });

  it('writes an RSS feed containing blog and Zenn articles', async () => {
    const { generateRssFeed } = await import('@/libs/rss');

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({
        id: 'blog-a',
        title: 'Blog A',
        description: 'Blog description',
        publishedAt: '2024-01-01T00:00:00.000Z',
      }),
    ]);
    zennMock.getZennFeed.mockResolvedValue([
      {
        id: 'zenn-a',
        title: 'Zenn A',
        description: 'Zenn description',
        publishedAt: '2024-02-01T00:00:00.000Z',
        thumbnailUrl: 'https://example.com/zenn.png',
        url: 'https://zenn.dev/user/articles/a',
        source: 'zenn',
      },
    ]);

    await generateRssFeed();

    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
    const [path, rss] = fsMock.writeFileSync.mock.calls[0] as [string, string];
    expect(path).toBe('./public/rss.xml');
    expect(rss).toContain('<title><![CDATA[Zenn A]]></title>');
    expect(rss).toContain('<title><![CDATA[Blog A]]></title>');
    expect(rss).toContain('https://example.com/articles/blog-a');
  });

  it('rejects and does not write a feed when article loading fails', async () => {
    const { generateRssFeed } = await import('@/libs/rss');

    microcmsMock.getAllLists.mockRejectedValue(new Error('microCMS failed'));

    await expect(generateRssFeed()).rejects.toThrow('microCMS failed');
    expect(fsMock.writeFileSync).not.toHaveBeenCalled();
  });
});
