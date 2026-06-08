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

  it('generates an RSS feed containing blog and Zenn articles', async () => {
    const { generateRssFeedXml } = await import('@/libs/rss');

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

    const rss = await generateRssFeedXml();

    expect(fsMock.writeFileSync).not.toHaveBeenCalled();
    expect(zennMock.getZennFeed).toHaveBeenCalledWith('realunivlog', 50, { includeAll: true });
    expect(rss).toContain('<title><![CDATA[Zenn A]]></title>');
    expect(rss).toContain('<title><![CDATA[Blog A]]></title>');
    expect(rss).toContain('https://example.com/articles/blog-a');
  });

  it('rejects and does not write a feed when article loading fails', async () => {
    const { generateRssFeedXml } = await import('@/libs/rss');

    microcmsMock.getAllLists.mockRejectedValue(new Error('microCMS failed'));

    await expect(generateRssFeedXml()).rejects.toThrow('microCMS failed');
    expect(fsMock.writeFileSync).not.toHaveBeenCalled();
  });

  it('writes the generated RSS feed for legacy script usage', async () => {
    const { generateRssFeed } = await import('@/libs/rss');

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({
        id: 'blog-a',
        title: 'Blog A',
        description: 'Blog description',
        publishedAt: '2024-01-01T00:00:00.000Z',
      }),
    ]);
    zennMock.getZennFeed.mockResolvedValue([]);

    await generateRssFeed();

    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFileSync.mock.calls[0][0]).toBe('./public/rss.xml');
  });
});
