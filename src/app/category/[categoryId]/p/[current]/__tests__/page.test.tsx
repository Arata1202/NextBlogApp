import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createCategory, createListResponse, createTag } from '@/test/factories';

const categoryPageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getList: vi.fn(),
  getCategory: vi.fn(),
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
vi.mock('@/components/Pages/Category', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      categoryPageMock(props);
      return React.createElement('div', null, 'CategoryPage page mock');
    },
  };
});

describe('paginated category app page', () => {
  beforeEach(() => {
    categoryPageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getCategory.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('generates static params for every category page', async () => {
    const { generateStaticParams } = await import('@/app/category/[categoryId]/p/[current]/page');

    microcmsMock.getList.mockResolvedValue(createListResponse([], { totalCount: 21 }));

    const params = await generateStaticParams();

    expect(params).toContainEqual({ categoryId: 'programming', current: '1' });
    expect(params).toContainEqual({ categoryId: 'programming', current: '3' });
    expect(params).toHaveLength(18);
  });

  it('loads category articles using current page offset', async () => {
    const Page = (await import('@/app/category/[categoryId]/p/[current]/page')).default;
    const article = createArticle({ id: 'article-a' });
    const category = createCategory({ id: 'programming', name: 'プログラミング' });

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 21 }));
    microcmsMock.getCategory.mockResolvedValue(category);
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ categoryId: 'programming', current: '2' }) }));

    expect(screen.getByText('CategoryPage page mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: 10,
      filters: 'categories[contains]programming',
    });
    expect(categoryPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [article],
        category,
        current: 2,
        totalCount: 21,
      }),
    );
  });
});
