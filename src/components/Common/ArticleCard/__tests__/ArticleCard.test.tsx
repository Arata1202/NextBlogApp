import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArticleCard from '@/components/Common/ArticleCard';
import { createArticle } from '@/test/factories';

describe('ArticleCard', () => {
  it('shows a PR badge only for sponsored articles', () => {
    const { rerender } = render(<ArticleCard article={createArticle({ isSponsored: true })} />);

    expect(screen.getByText('PR')).toHaveClass('w-fit');

    rerender(<ArticleCard article={createArticle({ isSponsored: false })} />);
    expect(screen.queryByText('PR')).not.toBeInTheDocument();
  });
});
