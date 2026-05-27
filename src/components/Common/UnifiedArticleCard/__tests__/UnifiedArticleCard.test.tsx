import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UnifiedArticleCard from '@/components/Common/UnifiedArticleCard';
import { createUnifiedArticle } from '@/test/factories';

describe('UnifiedArticleCard', () => {
  it('renders blog articles as internal links', () => {
    render(
      <UnifiedArticleCard
        article={createUnifiedArticle({
          source: 'blog',
          title: 'Blog title',
          url: '/articles/blog-title',
        })}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/articles/blog-title');
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
    expect(screen.getByText('Blog title')).toBeInTheDocument();
  });

  it('renders external Zenn articles with safe link attributes', () => {
    render(
      <UnifiedArticleCard
        article={createUnifiedArticle({
          source: 'zenn',
          title: 'Zenn title',
          thumbnail: undefined,
          thumbnailUrl: 'https://example.com/zenn.png',
          url: 'https://zenn.dev/user/articles/article',
        })}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('img', { name: 'Zenn title' })).toHaveAttribute(
      'src',
      'https://example.com/zenn.png',
    );
  });

  it('renders the updated date only when it is a later day than publishedAt', () => {
    render(
      <UnifiedArticleCard
        article={createUnifiedArticle({
          publishedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        })}
      />,
    );

    expect(screen.getByText('2024年1月1日')).toBeInTheDocument();
    expect(screen.getByText('2024年1月2日')).toBeInTheDocument();
  });
});
