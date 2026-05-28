import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createArticle,
  createListResponse,
  createTag,
  createUnifiedArticle,
} from '@/test/factories';

const articlePageMock = vi.hoisted(() => vi.fn());
const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
  getDetail: vi.fn(),
  getList: vi.fn(),
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
vi.mock('@/components/Pages/Article', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      articlePageMock(props);
      return React.createElement('div', null, 'ArticlePage mock');
    },
  };
});

describe('article app page', () => {
  beforeEach(() => {
    articlePageMock.mockReset();
    microcmsMock.getAllLists.mockReset();
    microcmsMock.getDetail.mockReset();
    microcmsMock.getList.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
  });

  it('generates static params from article ids', async () => {
    const { generateStaticParams } = await import('@/app/articles/[slug]/page');

    microcmsMock.getAllLists.mockResolvedValue([
      createArticle({ id: 'article-a' }),
      createArticle({ id: 'article-b' }),
    ]);

    await expect(generateStaticParams()).resolves.toEqual([
      { slug: 'article-a' },
      { slug: 'article-b' },
    ]);
    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({ fields: 'id' });
  });

  it('loads article detail, related articles, navigation data, and passes page props', async () => {
    const Page = (await import('@/app/articles/[slug]/page')).default;
    const article = createArticle({
      id: 'article-a',
      title: 'Article A',
      categories: [{ ...createArticle().categories[0], id: 'category-a' }],
    });
    const related = createArticle({ id: 'related-a', title: 'Related A' });
    const recentArticles = [createUnifiedArticle({ id: 'recent-a' })];

    microcmsMock.getDetail.mockResolvedValue(article);
    microcmsMock.getList.mockResolvedValue(createListResponse([related]));
    microcmsMock.getAllTagLists.mockResolvedValue([createTag({ id: 'react', name: 'React' })]);
    archiveMock.getArchiveList.mockResolvedValue([{ year: '2024', month: '1' }]);
    recentMock.getMixedRecentArticles.mockResolvedValue(recentArticles);

    render(await Page({ params: Promise.resolve({ slug: 'article-a' }) }));

    expect(screen.getByText('ArticlePage mock')).toBeInTheDocument();
    expect(microcmsMock.getDetail).toHaveBeenCalledWith('article-a');
    expect(recentMock.getMixedRecentArticles).toHaveBeenCalledWith(4);
    expect(microcmsMock.getList).toHaveBeenCalledWith({
      limit: 3,
      fields: 'id,title,tags,description,thumbnail,publishedAt,updatedAt',
      filters: 'categories[contains]category-a,title[not_equals]Article A',
    });
    expect(articlePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        article,
        relatedArticles: [related],
        recentArticles,
      }),
    );
  });
});
