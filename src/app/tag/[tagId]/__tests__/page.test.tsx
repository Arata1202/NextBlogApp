import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createListResponse, createTag } from '@/test/factories';

const tagPageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
  getTag: vi.fn(),
  getAllTagLists: vi.fn(),
}));
const archiveMock = vi.hoisted(() => ({
  getArchiveList: vi.fn(),
}));
const recentMock = vi.hoisted(() => ({
  getMixedRecentArticles: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/archive', () => archiveMock);
vi.mock('@/libs/recent', () => recentMock);
vi.mock('@/components/Pages/Tag', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      tagPageMock(props);
      return React.createElement('div', null, 'TagPage mock');
    },
  };
});

describe('tag app page', () => {
  beforeEach(() => {
    tagPageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getTag.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('generates static params from tags', async () => {
    const { generateStaticParams } = await import('@/app/tag/[tagId]/page');

    microcmsMock.getAllTagLists.mockResolvedValue([
      createTag({ id: 'react' }),
      createTag({ id: 'nextjs' }),
    ]);

    await expect(generateStaticParams()).resolves.toEqual([
      { tagId: 'react' },
      { tagId: 'nextjs' },
    ]);
    expect(microcmsMock.getAllTagLists).toHaveBeenCalledWith({ fields: 'id' });
  });

  it('loads tag filtered articles and passes page props', async () => {
    const Page = (await import('@/app/tag/[tagId]/page')).default;
    const article = createArticle({ id: 'article-a' });
    const tag = createTag({ id: 'react', name: 'React' });

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 8 }));
    microcmsMock.getTag.mockResolvedValue(tag);
    microcmsMock.getAllTagLists.mockResolvedValue([tag]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ tagId: 'react' }) }));

    expect(screen.getByText('TagPage mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      filters: 'tags[contains]react',
    });
    expect(microcmsMock.getTag).toHaveBeenCalledWith('react', { fields: 'id,name' });
    expect(tagPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [article],
        tag,
        totalCount: 8,
      }),
    );
  });
});
