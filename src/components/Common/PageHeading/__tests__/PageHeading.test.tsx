import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageHeading from '@/components/Common/PageHeading';
import { createCategory } from '@/test/factories';

describe('PageHeading', () => {
  it('renders breadcrumb and title for non-home pages', () => {
    render(
      <PageHeading category={createCategory({ id: 'programming', name: 'プログラミング' })} />,
    );

    expect(
      screen.getByText('プログラミング', { selector: '[aria-current="page"]' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'プログラミング' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'プログラミング' })).toBeInTheDocument();
  });

  it('omits breadcrumbs on the home heading', () => {
    render(<PageHeading home />);

    expect(screen.getByRole('heading', { name: '最新記事' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the search heading and breadcrumb with an empty keyword', () => {
    render(<PageHeading search />);

    expect(
      screen.getByText('「」の検索結果', { selector: '[aria-current="page"]' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '「」の検索結果' })).toBeInTheDocument();
  });

  it('renders the search heading and breadcrumb with the keyword', () => {
    render(<PageHeading search searchKeyword="React" />);

    expect(
      screen.getByText('「React」の検索結果', { selector: '[aria-current="page"]' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '「React」の検索結果' })).toBeInTheDocument();
  });
});
