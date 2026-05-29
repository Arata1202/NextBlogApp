import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createCategory, createTag, createUnifiedArticle } from '@/test/factories';

const pageMocks = vi.hoisted(() => ({
  contact: vi.fn(),
  profile: vi.fn(),
  privacy: vi.fn(),
  disclaimer: vi.fn(),
  copyright: vi.fn(),
  link: vi.fn(),
  sitemapHtml: vi.fn(),
  search: vi.fn(),
}));

const microcmsMock = vi.hoisted(() => ({
  getAllLists: vi.fn(),
  getAllCategoryLists: vi.fn(),
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

const createPageMock = async (mockName: keyof typeof pageMocks, label: string) => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => {
      pageMocks[mockName](props);
      return React.createElement('div', null, label);
    },
  };
};

vi.mock('@/components/Pages/Contact', () => createPageMock('contact', 'ContactPage mock'));
vi.mock('@/components/Pages/Profile', () => createPageMock('profile', 'ProfilePage mock'));
vi.mock('@/components/Pages/Privacy', () => createPageMock('privacy', 'PrivacyPage mock'));
vi.mock('@/components/Pages/Disclaimer', () => createPageMock('disclaimer', 'DisclaimerPage mock'));
vi.mock('@/components/Pages/Copyright', () => createPageMock('copyright', 'CopyrightPage mock'));
vi.mock('@/components/Pages/Link', () => createPageMock('link', 'LinkPage mock'));
vi.mock('@/components/Pages/SitemapHtml', () =>
  createPageMock('sitemapHtml', 'SitemapHtmlPage mock'),
);
vi.mock('@/components/Pages/Search', () => createPageMock('search', 'SearchPage mock'));

describe('fixed app pages', () => {
  const recentArticles = [createUnifiedArticle({ id: 'recent-a' })];
  const tags = [createTag({ id: 'react', name: 'React' })];
  const archiveList = [{ year: '2024', month: '1' }];

  beforeEach(() => {
    Object.values(pageMocks).forEach((mock) => mock.mockReset());
    microcmsMock.getAllLists.mockReset();
    microcmsMock.getAllCategoryLists.mockReset();
    microcmsMock.getAllTagLists.mockReset();
    archiveMock.getArchiveList.mockReset();
    recentMock.getMixedRecentArticles.mockReset();
    microcmsMock.getAllTagLists.mockResolvedValue(tags);
    archiveMock.getArchiveList.mockResolvedValue(archiveList);
    recentMock.getMixedRecentArticles.mockResolvedValue(recentArticles);
  });

  it.each([
    ['contact', '@/app/contact/page', 'ContactPage mock'],
    ['profile', '@/app/profile/page', 'ProfilePage mock'],
    ['privacy', '@/app/privacy/page', 'PrivacyPage mock'],
    ['disclaimer', '@/app/disclaimer/page', 'DisclaimerPage mock'],
    ['copyright', '@/app/copyright/page', 'CopyrightPage mock'],
    ['link', '@/app/link/page', 'LinkPage mock'],
    ['search', '@/app/search/page', 'SearchPage mock'],
  ] as const)('loads shared sidebar data for the %s page', async (mockName, importPath, label) => {
    const Page = (await import(importPath)).default;

    render(await Page());

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(recentMock.getMixedRecentArticles).toHaveBeenCalledTimes(1);
    expect(microcmsMock.getAllTagLists).toHaveBeenCalledWith({ fields: 'id,name' });
    expect(archiveMock.getArchiveList).toHaveBeenCalledTimes(1);
    expect(pageMocks[mockName]).toHaveBeenCalledWith({
      recentArticles,
      tags,
      archiveList,
    });
  });

  it('loads sitemap html data and passes it to the sitemap page', async () => {
    const Page = (await import('@/app/sitemap-html/page')).default;
    const articles = [createArticle({ id: 'article-a', title: 'Article A' })];
    const categories = [createCategory({ id: 'programming', name: 'プログラミング' })];

    microcmsMock.getAllLists.mockResolvedValue(articles);
    microcmsMock.getAllCategoryLists.mockResolvedValue(categories);

    render(await Page());

    expect(screen.getByText('SitemapHtmlPage mock')).toBeInTheDocument();
    expect(microcmsMock.getAllLists).toHaveBeenCalledWith({ fields: 'id,title,thumbnail' });
    expect(microcmsMock.getAllCategoryLists).toHaveBeenCalledWith({ fields: 'id,name' });
    expect(pageMocks.sitemapHtml).toHaveBeenCalledWith({
      articles,
      recentArticles,
      categories,
      tags,
      archiveList,
    });
  });
});
