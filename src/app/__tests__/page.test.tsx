import { render, screen } from '@testing-library/react';
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
      return React.createElement('div', null, 'HomePage mock');
    },
  };
});

describe('home app page', () => {
  beforeEach(() => {
    homePageMock.mockReset();
    microcmsMock.getAllLists.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    zennMock.getZennFeed.mockReset();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_TITLE = 'Example Blog';
  });

  it('loads home data, mixes blog and Zenn articles, and passes page props', async () => {
    const Page = (await import('@/app/page')).default;
    const blogArticle = createArticle({
      id: 'blog-a',
      publishedAt: '2024-01-15T00:00:00.000Z',
    });
    const zennArticle = createUnifiedArticle({
      id: 'zenn-a',
      source: 'zenn',
      publishedAt: '2024-02-01T00:00:00.000Z',
    });

    microcmsMock.getAllLists.mockResolvedValue([blogArticle]);
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    zennMock.getZennFeed.mockResolvedValue([zennArticle]);

    render(await Page());

    expect(screen.getByText('HomePage mock')).toBeInTheDocument();
    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    });
    expect(zennMock.getZennFeed).toHaveBeenCalledWith('realunivlog', undefined, {
      includeAll: true,
      required: true,
    });
    expect(homePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        totalCount: 2,
        archiveList: [{ year: '2024', month: '1' }],
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
