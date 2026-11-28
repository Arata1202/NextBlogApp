import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createTag, createUnifiedArticle } from '@/test/factories';

const homePageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
  getAllTagLists: vi.fn(),
}));
const zennMock = vi.hoisted(() => ({
  getZennFeed: vi.fn(),
}));
vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/zenn', () => zennMock);
vi.mock('@/components/Pages/Home', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      homePageMock(props);
      return React.createElement('div', null, 'HomePage page mock');
    },
  };
});

describe('paginated home app page', () => {
  beforeEach(() => {
    homePageMock.mockReset();
    microcmsMock.getAllLists.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    zennMock.getZennFeed.mockReset();
  });

  it('generates static params from total article count', async () => {
    const { generateStaticParams } = await import('@/app/p/[current]/page');

    microcmsMock.getAllLists.mockResolvedValue(Array.from({ length: 20 }, () => createArticle()));

    zennMock.getZennFeed.mockResolvedValue([createUnifiedArticle()]);
    await expect(generateStaticParams()).resolves.toEqual([
      { current: '1' },
      { current: '2' },
      { current: '3' },
    ]);
  });

  it('fails static param generation when article count loading fails', async () => {
    const { generateStaticParams } = await import('@/app/p/[current]/page');

    microcmsMock.getAllLists.mockRejectedValue(new Error('microCMS failed'));

    await expect(generateStaticParams()).rejects.toThrow('microCMS failed');
  });

  it('serves identical first pages and keeps the displaced blog article on page two', async () => {
    const Home = (await import('@/app/page')).default;
    const Page = (await import('@/app/p/[current]/page')).default;
    const blogs = Array.from({ length: 10 }, (_, i) =>
      createArticle({ id: String(i + 1), publishedAt: new Date(2024, 0, 10 - i).toISOString() }),
    );
    microcmsMock.getAllLists.mockResolvedValue(blogs);
    microcmsMock.getAllTagLists.mockResolvedValue([createTag()]);
    zennMock.getZennFeed.mockResolvedValue([
      createUnifiedArticle({ id: 'zenn-a', source: 'zenn', publishedAt: '2024-02-01' }),
    ]);

    render(await Home());
    const home = homePageMock.mock.lastCall![0];
    render(await Page({ params: Promise.resolve({ current: '1' }) }));
    expect(homePageMock.mock.lastCall![0].mixedArticles).toEqual(home.mixedArticles);
    render(await Page({ params: Promise.resolve({ current: '2' }) }));
    const second = homePageMock.mock.lastCall![0];
    expect(home.totalCount).toBe(11);
    expect(home.mixedArticles.map(({ id }: { id: string }) => id)).toEqual([
      'zenn-a',
      ...blogs.slice(0, 9).map(({ id }) => `blog-${id}`),
    ]);
    expect(second.mixedArticles).toEqual([expect.objectContaining({ id: 'blog-10' })]);
    expect(second.recentArticles).toEqual(home.recentArticles);
  });
});
