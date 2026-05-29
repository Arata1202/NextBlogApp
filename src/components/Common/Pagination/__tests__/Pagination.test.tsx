import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Common/Pagination';

describe('Pagination', () => {
  it('renders a compact page range with current page, ellipses, base path, and query', () => {
    render(<Pagination totalCount={100} current={5} basePath="/category/react" q="hooks" />);

    expect(screen.getByText('5')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '3ページ目へ移動' })).toHaveAttribute(
      'href',
      '/category/react/p/3?q=hooks',
    );
    expect(screen.getByRole('link', { name: '10ページ目へ移動' })).toHaveAttribute(
      'href',
      '/category/react/p/10?q=hooks',
    );
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('renders no items when there are no pages', () => {
    render(<Pagination totalCount={0} />);

    expect(within(screen.getByRole('list')).queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders query parameter pagination links', () => {
    render(
      <Pagination totalCount={100} current={1} basePath="/search" q="React Query" useQueryPage />,
    );

    expect(screen.getByRole('link', { name: '2ページ目へ移動' })).toHaveAttribute(
      'href',
      '/search?q=React+Query&page=2',
    );
  });
});
