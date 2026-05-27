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
const zennMock = vi.hoisted(() => ({
  getZennFeed: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/archive', () => archiveMock);
vi.mock('@/libs/zenn', () => zennMock);
vi.mock('@/components/Pages/Home', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      homePageMock(props);
      return React.createElement('div', null, 'HomePage mock');
    },
  };
});

describe('home app page', () => {
  beforeEach(() => {
    homePageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    zennMock.getZennFeed.mockReset();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_TITLE = 'Example Blog';
  });

  it('loads home data, mixes blog and Zenn articles, and passes page props', async () => {
    const Page = (await import('@/app/page')).default;
    const blogArticle = createArticle({
      id: 'blog-a',
      publishedAt: '2024-01-01T00:00:00.000Z',
    });
    const zennArticle = createUnifiedArticle({
      id: 'zenn-a',
      source: 'zenn',
      publishedAt: '2024-02-01T00:00:00.000Z',
    });

    microcmsMock.getList.mockResolvedValue(createListResponse([blogArticle], { totalCount: 20 }));
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    zennMock.getZennFeed.mockResolvedValue([zennArticle]);

    render(await Page());

    expect(screen.getByText('HomePage mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    });
    expect(zennMock.getZennFeed).toHaveBeenCalledWith('realunivlog', 10);
    expect(homePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [blogArticle],
        totalCount: 20,
        mixedArticles: [
          expect.objectContaining({ id: 'zenn-a' }),
          expect.objectContaining({ id: 'blog-blog-a' }),
        ],
        recentArticles: [
          expect.objectContaining({ id: 'zenn-a' }),
          expect.objectContaining({ id: 'blog-blog-a' }),
        ],
      }),
    );
  });
});
