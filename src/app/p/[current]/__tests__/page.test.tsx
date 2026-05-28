import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createArticle,
  createListResponse,
  createTag,
  createUnifiedArticle,
} from '@/test/factories';

const homePageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
  getAllTagLists: vi.fn(),
}));
const archiveMock = vi.hoisted(() => ({
  getArchiveList: vi.fn(),
}));
const recentMock = vi.hoisted(() => ({
  getMixedRecentArticles: vi.fn(),
}));
const rssMock = vi.hoisted(() => ({
  generateRssFeed: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/archive', () => archiveMock);
vi.mock('@/libs/recent', () => recentMock);
vi.mock('@/libs/rss', () => rssMock);
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
    microcmsMock.getList.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
    rssMock.generateRssFeed.mockReset();
  });

  it('generates static params from total article count', async () => {
    const { generateStaticParams } = await import('@/app/p/[current]/page');

    rssMock.generateRssFeed.mockResolvedValue(undefined);
    microcmsMock.getList.mockResolvedValue(createListResponse([], { totalCount: 21 }));

    await expect(generateStaticParams()).resolves.toEqual([
      { current: '1' },
      { current: '2' },
      { current: '3' },
    ]);
    expect(rssMock.generateRssFeed).toHaveBeenCalledTimes(1);
    expect(microcmsMock.getList).toHaveBeenCalledWith({ limit: 0, fields: '' });
  });

  it('fails static param generation when RSS generation fails', async () => {
    const { generateStaticParams } = await import('@/app/p/[current]/page');

    rssMock.generateRssFeed.mockRejectedValue(new Error('rss failed'));

    await expect(generateStaticParams()).rejects.toThrow('rss failed');
    expect(microcmsMock.getList).not.toHaveBeenCalled();
  });

  it('loads the requested page with the correct offset', async () => {
    const Page = (await import('@/app/p/[current]/page')).default;
    const article = createArticle({ id: 'article-a' });
    const recentArticles = [createUnifiedArticle({ id: 'recent-a' })];

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 21 }));
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue(recentArticles);

    render(await Page({ params: Promise.resolve({ current: '3' }) }));

    expect(screen.getByText('HomePage page mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: 20,
    });
    expect(homePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [article],
        current: 3,
        totalCount: 21,
        recentArticles,
      }),
    );
  });
});
