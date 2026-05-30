import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { createArticle, createCategory, createTag } from '@/test/factories';

describe('BreadCrumb', () => {
  it('renders the article category link and article as the current page', () => {
    render(
      <BreadCrumb
        article={createArticle({
          id: 'article-a',
          title: 'Article A',
          categories: [createCategory({ id: 'programming', name: 'プログラミング' })],
        })}
      />,
    );

    expect(screen.getByRole('link', { name: 'プログラミング' })).toHaveAttribute(
      'href',
      '/category/programming',
    );
    expect(screen.getByText('Article A')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Article A' })).not.toBeInTheDocument();
  });

  it('renders archive, category, and tag breadcrumbs as the current page', () => {
    const { rerender } = render(<BreadCrumb year="2024" month="01" />);

    expect(screen.getByText('2024年1月')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '2024年1月' })).not.toBeInTheDocument();

    rerender(<BreadCrumb category={createCategory({ id: 'work', name: '社会人生活' })} />);
    expect(screen.getByText('社会人生活')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '社会人生活' })).not.toBeInTheDocument();

    rerender(<BreadCrumb tag={createTag({ id: 'react', name: 'React' })} />);
    expect(screen.getByText('React')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'React' })).not.toBeInTheDocument();
  });

  it.each([
    ['contact', 'お問い合わせ'],
    ['copyright', '著作権'],
    ['disclaimer', '免責事項'],
    ['link', 'リンク'],
    ['privacy', 'プライバシーポリシー'],
    ['profile', 'プロフィール'],
    ['sitemap', 'サイトマップ'],
  ] as const)('renders the %s fixed page breadcrumb as the current page', (prop, label) => {
    render(<BreadCrumb {...{ [prop]: true }} />);

    expect(screen.getByText(label)).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument();
  });

  it('renders the search result breadcrumb with an empty keyword as the current page', () => {
    render(<BreadCrumb search />);

    expect(screen.getByText('検索結果')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: '検索結果' })).not.toBeInTheDocument();
  });

  it('renders the search result breadcrumb with the keyword as the current page', () => {
    render(<BreadCrumb search searchKeyword="React Hooks" />);

    expect(screen.getByText('「React Hooks」の検索結果')).toHaveAttribute('aria-current', 'page');
    expect(
      screen.queryByRole('link', { name: '「React Hooks」の検索結果' }),
    ).not.toBeInTheDocument();
  });
});
