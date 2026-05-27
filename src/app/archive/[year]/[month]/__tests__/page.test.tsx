import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createListResponse, createTag } from '@/test/factories';

const archivePageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
  getAllTagLists: vi.fn(),
}));
const archiveMock = vi.hoisted(() => ({
  getArchiveList: vi.fn(),
  getArchiveStaticParams: vi.fn(),
}));
const recentMock = vi.hoisted(() => ({
  getMixedRecentArticles: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/libs/archive', () => archiveMock);
vi.mock('@/libs/recent', () => recentMock);
vi.mock('@/components/Pages/Archive', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      archivePageMock(props);
      return React.createElement('div', null, 'ArchivePage mock');
    },
  };
});

describe('archive app page', () => {
  beforeEach(() => {
    archivePageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    archiveMock.getArchiveStaticParams.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('delegates static param generation to archive helpers', async () => {
    const { generateStaticParams } = await import('@/app/archive/[year]/[month]/page');
    const params = [{ year: '2024', month: '01' }];

    archiveMock.getArchiveStaticParams.mockResolvedValue(params);

    await expect(generateStaticParams()).resolves.toEqual(params);
  });

  it('loads monthly articles using an inclusive/exclusive date range', async () => {
    const Page = (await import('@/app/archive/[year]/[month]/page')).default;
    const article = createArticle({ id: 'article-a' });

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 5 }));
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ year: '2024', month: '01' }) }));

    expect(screen.getByText('ArchivePage mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,publishedAt,updatedAt,thumbnail',
      filters:
        'publishedAt[greater_than]2024-01-01T00:00:00Z[and]publishedAt[less_than]2024-02-01T00:00:00.000Z',
    });
    expect(archivePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        year: '2024',
        month: '01',
        articles: [article],
        totalCount: 5,
      }),
    );
  });
});
