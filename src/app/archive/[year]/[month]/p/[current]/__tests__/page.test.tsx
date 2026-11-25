import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createListResponse, createTag } from '@/test/factories';

const archivePageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
  getAllLists: vi.fn(),
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
vi.mock('@/libs/archive', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/libs/archive')>()),
  ...archiveMock,
}));
vi.mock('@/libs/recent', () => recentMock);
vi.mock('@/components/Pages/Archive', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      archivePageMock(props);
      return React.createElement('div', null, 'ArchivePage page mock');
    },
  };
});

describe('paginated archive app page', () => {
  beforeEach(() => {
    archivePageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    archiveMock.getArchiveStaticParams.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('generates static params for every archive page', async () => {
    const { generateStaticParams } = await import('@/app/archive/[year]/[month]/p/[current]/page');

    microcmsMock.getAllLists.mockResolvedValue(Array.from({ length: 21 }, () => createArticle()));

    await expect(generateStaticParams()).resolves.toEqual([
      { year: '2024', month: '01', current: '1' },
      { year: '2024', month: '01', current: '2' },
      { year: '2024', month: '01', current: '3' },
    ]);
    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({ fields: 'publishedAt' });
  });

  it('loads archive articles using current page offset and date range', async () => {
    const Page = (await import('@/app/archive/[year]/[month]/p/[current]/page')).default;
    const article = createArticle({ id: 'article-a' });

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 21 }));
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ year: '2024', month: '01', current: '2' }) }));

    expect(screen.getByText('ArchivePage page mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: 10,
      filters:
        'publishedAt[greater_than]2023-12-31T14:59:59.999Z[and]publishedAt[less_than]2024-01-31T15:00:00.000Z',
    });
    expect(archivePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [article],
        current: 2,
        totalCount: 21,
        year: '2024',
        month: '01',
      }),
    );
  });
});
