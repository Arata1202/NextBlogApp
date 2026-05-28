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
      return React.createElement('div', null, 'CategoryPage mock');
    },
  };
});

describe('category app page', () => {
  beforeEach(() => {
    categoryPageMock.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getCategory.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('loads category filtered articles and passes page props', async () => {
    const Page = (await import('@/app/category/[categoryId]/page')).default;
    const article = createArticle({ id: 'article-a' });
    const category = createCategory({ id: 'programming', name: 'プログラミング' });

    microcmsMock.getList.mockResolvedValue(createListResponse([article], { totalCount: 12 }));
    microcmsMock.getCategory.mockResolvedValue(category);
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ categoryId: 'programming' }) }));

    expect(screen.getByText('CategoryPage mock')).toBeInTheDocument();
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 10,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      filters: 'categories[contains]programming',
    });
    expect(microcmsMock.getCategory).toHaveBeenCalledWith('programming', { fields: 'id,name' });
    expect(categoryPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        articles: [article],
        category,
        totalCount: 12,
      }),
    );
  });
});
