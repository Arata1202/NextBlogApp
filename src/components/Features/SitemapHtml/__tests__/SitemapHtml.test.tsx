import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SitemapHtmlFeature from '@/components/Features/SitemapHtml';
import { createArticle, createCategory } from '@/test/factories';

describe('SitemapHtmlFeature', () => {
  it('renders fixed pages, categories, and article links', () => {
    render(
      <SitemapHtmlFeature
        articles={[createArticle({ id: 'article-a', title: 'Article A' })]}
        categories={[createCategory({ id: 'programming', name: 'プログラミング' })]}
      />,
    );

    expect(screen.getByRole('heading', { name: '固定ページ' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'お問い合わせ' })).toHaveAttribute('href', 'contact');
    expect(screen.getByRole('heading', { name: 'カテゴリー' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'プログラミング' })).toHaveAttribute(
      'href',
      '/category/programming',
    );
    expect(screen.getByRole('heading', { name: '投稿一覧' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Article A' })).toHaveAttribute(
      'href',
      '/articles/article-a',
    );
  });
});
