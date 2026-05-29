import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createArticle, createCategory, createTag } from '@/test/factories';

const microcmsMock = vi.hoisted(() => ({
  getDetail: vi.fn(),
  getCategory: vi.fn(),
  getTag: vi.fn(),
}));

vi.mock('@/libs/microcms', () => microcmsMock);
vi.mock('@/components/Common/Layouts/Header', () => ({ default: () => null }));
vi.mock('@/components/Common/Layouts/Footer', () => ({ default: () => null }));
vi.mock('@/components/Common/Layouts/ScrollToTop', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/GoogleSearchConsole', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/GoogleAdSense', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/GoogleAnalytics', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/Instagram', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/OneSignal', () => ({ default: () => null }));
vi.mock('@/components/ThirdParties/Embedly', () => ({ default: () => null }));

const parseJsonLd = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((script) =>
    JSON.parse(script.textContent ?? '{}'),
  );

describe('app metadata', () => {
  beforeEach(() => {
    microcmsMock.getDetail.mockReset();
    microcmsMock.getCategory.mockReset();
    microcmsMock.getTag.mockReset();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_TITLE = 'Example Blog';
  });

  it('generates canonical site metadata for the root layout', async () => {
    const { generateMetadata } = await import('@/app/layout');

    await expect(generateMetadata()).resolves.toMatchObject({
      title: 'Example Blog',
      openGraph: expect.objectContaining({
        type: 'website',
        title: 'Example Blog',
        images: 'https://example.com/images/thumbnail/7.webp',
        url: 'https://example.com',
      }),
      alternates: {
        canonical: 'https://example.com',
      },
    });
  });

  it('generates article metadata and article breadcrumb JSON-LD from microCMS data', async () => {
    const article = createArticle({
      id: 'article-a',
      title: 'Article A',
      description: 'Description A',
      thumbnail: {
        url: 'https://example.com/thumbnail.webp',
        width: 1200,
        height: 630,
      },
      categories: [createCategory({ id: 'category-a', name: 'Category A' })],
      publishedAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    });
    microcmsMock.getDetail.mockResolvedValue(article);
    const { generateMetadata, default: ArticleLayout } = await import(
      '@/app/articles/[slug]/layout'
    );

    await expect(
      generateMetadata({
        children: null,
        params: Promise.resolve({ slug: 'article-a' }),
      }),
    ).resolves.toMatchObject({
      title: 'Article A｜Example Blog',
      description: 'Description A',
      openGraph: expect.objectContaining({
        type: 'article',
        images: 'https://example.com/thumbnail.webp',
        url: 'https://example.com/articles/article-a',
        publishedTime: '2024-01-01T00:00:00.000Z',
        modifiedTime: '2024-01-02T00:00:00.000Z',
      }),
      alternates: {
        canonical: 'https://example.com/articles/article-a',
      },
    });

    const { container } = render(
      await ArticleLayout({
        children: <div>Article children</div>,
        params: Promise.resolve({ slug: 'article-a' }),
      }),
    );
    const [blogPostingJsonLd, breadcrumbJsonLd] = parseJsonLd(container);

    expect(screen.getByText('Article children')).toBeInTheDocument();
    expect(blogPostingJsonLd).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Article A',
      url: 'https://example.com/articles/article-a',
      mainEntityOfPage: {
        '@id': 'https://example.com/articles/article-a',
      },
    });
    expect(breadcrumbJsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'ホーム', item: 'https://example.com' }),
      expect.objectContaining({
        position: 2,
        name: 'Category A',
        item: 'https://example.com/category/category-a',
      }),
      expect.objectContaining({
        position: 3,
        name: 'Article A',
        item: 'https://example.com/articles/article-a',
      }),
    ]);
    expect(microcmsMock.getDetail).toHaveBeenCalledWith('article-a');
  });

  it('generates category metadata and breadcrumb JSON-LD', async () => {
    const category = createCategory({ id: 'programming', name: 'プログラミング' });
    microcmsMock.getCategory.mockResolvedValue(category);
    const { generateMetadata, default: CategoryLayout } = await import(
      '@/app/category/[categoryId]/layout'
    );

    await expect(
      generateMetadata({
        children: null,
        params: Promise.resolve({ categoryId: 'programming' }),
      }),
    ).resolves.toMatchObject({
      title: 'プログラミング｜Example Blog',
      description: 'プログラミングについて解説するカテゴリーです。',
      openGraph: expect.objectContaining({
        url: 'https://example.com/category/programming',
      }),
      alternates: {
        canonical: 'https://example.com/category/programming',
      },
    });

    const { container } = render(
      await CategoryLayout({
        children: <div>Category children</div>,
        params: Promise.resolve({ categoryId: 'programming' }),
      }),
    );
    const [breadcrumbJsonLd] = parseJsonLd(container);

    expect(screen.getByText('Category children')).toBeInTheDocument();
    expect(breadcrumbJsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'ホーム', item: 'https://example.com' }),
      expect.objectContaining({
        position: 2,
        name: 'プログラミング',
        item: 'https://example.com/category/programming',
      }),
    ]);
    expect(microcmsMock.getCategory).toHaveBeenCalledWith('programming', {
      fields: 'id,name',
    });
  });

  it('generates noindex tag metadata', async () => {
    microcmsMock.getTag.mockResolvedValue(createTag({ id: 'react', name: 'React' }));
    const { generateMetadata } = await import('@/app/tag/[tagId]/layout');

    await expect(
      generateMetadata({
        children: null,
        params: Promise.resolve({ tagId: 'react' }),
      }),
    ).resolves.toMatchObject({
      title: 'React｜Example Blog',
      description: 'Reactについて解説するタグです。',
      openGraph: expect.objectContaining({
        images: 'https://example.com/images/thumbnail/7.webp',
        url: 'https://example.com/tag/react',
      }),
      alternates: {
        canonical: 'https://example.com/tag/react',
      },
      robots: {
        index: false,
      },
    });
    expect(microcmsMock.getTag).toHaveBeenCalledWith('react', { fields: 'id,name' });
  });

  it('generates noindex archive metadata with a normalized month label', async () => {
    const { generateMetadata } = await import('@/app/archive/[year]/[month]/layout');

    await expect(
      generateMetadata({
        children: null,
        params: Promise.resolve({ year: '2024', month: '01' }),
      }),
    ).resolves.toMatchObject({
      title: '2024年1月｜Example Blog',
      description: '2024年1月の記事一覧です。',
      openGraph: expect.objectContaining({
        url: 'https://example.com/archive/2024/01',
      }),
      alternates: {
        canonical: 'https://example.com/archive/2024/01',
      },
      robots: {
        index: false,
      },
    });
  });

  it.each([
    [
      'privacy',
      '@/app/privacy/layout',
      'プライバシーポリシー',
      'プライバシーポリシーを記載しています。',
    ],
    ['disclaimer', '@/app/disclaimer/layout', '免責事項', '免責事項を記載しています。'],
    ['copyright', '@/app/copyright/layout', '著作権', '著作権についてを記載しています。'],
    ['link', '@/app/link/layout', 'リンク', 'リンクについてを記載しています。'],
    [
      'sitemap-html',
      '@/app/sitemap-html/layout',
      'サイトマップ',
      '当ブログのサイトマップを記載しています。',
    ],
    ['search', '@/app/search/layout', '検索結果', '検索結果を表示するページです。'],
  ] as const)(
    'generates fixed page metadata for /%s',
    async (route, importPath, titlePrefix, description) => {
      const { generateMetadata } = await import(importPath);

      await expect(generateMetadata()).resolves.toMatchObject({
        title: `${titlePrefix}｜Example Blog`,
        description,
        openGraph: expect.objectContaining({
          title: `${titlePrefix}｜Example Blog`,
          description,
          images: 'https://example.com/images/thumbnail/7.webp',
          url: `https://example.com/${route}`,
        }),
        alternates: {
          canonical: `https://example.com/${route}`,
        },
      });
    },
  );

  it('generates contact metadata and JSON-LD', async () => {
    const { generateMetadata, default: ContactLayout } = await import('@/app/contact/layout');

    await expect(generateMetadata()).resolves.toMatchObject({
      title: 'お問い合わせ｜Example Blog',
      description: 'お問い合わせのフォームを記載しています。',
      openGraph: expect.objectContaining({
        url: 'https://example.com/contact',
      }),
      alternates: {
        canonical: 'https://example.com/contact',
      },
    });

    const { container } = render(await ContactLayout({ children: <div>Contact children</div> }));
    const [contactPageJsonLd, breadcrumbJsonLd] = parseJsonLd(container);

    expect(screen.getByText('Contact children')).toBeInTheDocument();
    expect(contactPageJsonLd).toMatchObject({
      '@type': 'ContactPage',
      '@id': 'https://example.com/contact#contactpage',
      url: 'https://example.com/contact',
      name: 'お問い合わせ｜Example Blog',
    });
    expect(breadcrumbJsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'ホーム', item: 'https://example.com' }),
      expect.objectContaining({
        position: 2,
        name: 'お問い合わせ',
        item: 'https://example.com/contact',
      }),
    ]);
  });

  it('generates profile metadata and Person JSON-LD', async () => {
    const { generateMetadata, default: ProfileLayout } = await import('@/app/profile/layout');

    await expect(generateMetadata()).resolves.toMatchObject({
      title: 'プロフィール｜Example Blog',
      description: '筆者のプロフィールを紹介しています。',
      openGraph: expect.objectContaining({
        url: 'https://example.com/profile',
      }),
      alternates: {
        canonical: 'https://example.com/profile',
      },
    });

    const { container } = render(await ProfileLayout({ children: <div>Profile children</div> }));
    const [profilePageJsonLd, breadcrumbJsonLd] = parseJsonLd(container);

    expect(screen.getByText('Profile children')).toBeInTheDocument();
    expect(profilePageJsonLd).toMatchObject({
      '@type': 'ProfilePage',
      '@id': 'https://example.com/profile#profilepage',
      url: 'https://example.com/profile',
      name: 'プロフィール｜Example Blog',
      mainEntity: expect.objectContaining({
        '@type': 'Person',
        '@id': 'https://example.com/profile#person',
        url: 'https://example.com/profile',
      }),
    });
    expect(breadcrumbJsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'ホーム', item: 'https://example.com' }),
      expect.objectContaining({
        position: 2,
        name: 'プロフィール',
        item: 'https://example.com/profile',
      }),
    ]);
  });
});
