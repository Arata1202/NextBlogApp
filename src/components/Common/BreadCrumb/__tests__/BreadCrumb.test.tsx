import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BreadCrumb from '@/components/Common/BreadCrumb';
import { createArticle, createCategory, createTag } from '@/test/factories';

describe('BreadCrumb', () => {
  it('renders article category and article links', () => {
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
    expect(screen.getByRole('link', { name: 'Article A' })).toHaveAttribute(
      'href',
      '/articles/article-a',
    );
  });

  it('renders archive, category, and tag destinations', () => {
    const { rerender } = render(<BreadCrumb year="2024" month="01" />);

    expect(screen.getByRole('link', { name: '2024月1月' })).toHaveAttribute(
      'href',
      '/archive/2024/01',
    );

    rerender(<BreadCrumb category={createCategory({ id: 'work', name: '社会人生活' })} />);
    expect(screen.getByRole('link', { name: '社会人生活' })).toHaveAttribute(
      'href',
      '/category/work',
    );

    rerender(<BreadCrumb tag={createTag({ id: 'react', name: 'React' })} />);
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', '/tag/react');
  });

  it.each([
    ['contact', 'お問い合わせ', '/contact'],
    ['copyright', '著作権', '/copyright'],
    ['disclaimer', '免責事項', '/disclaimer'],
    ['link', 'リンク', '/link'],
    ['privacy', 'プライバシーポリシー', '/privacy'],
    ['profile', 'プロフィール', '/profile'],
    ['sitemap', 'サイトマップ', '/sitemap-html'],
  ] as const)('renders the %s fixed page link', (prop, label, href) => {
    render(<BreadCrumb {...{ [prop]: true }} />);

    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
  });
});
