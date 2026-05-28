import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageHeading from '@/components/Common/PageHeading';
import { createCategory } from '@/test/factories';

describe('PageHeading', () => {
  it('renders breadcrumb and title for non-home pages', () => {
    render(
      <PageHeading category={createCategory({ id: 'programming', name: 'プログラミング' })} />,
    );

    expect(screen.getByRole('link', { name: 'プログラミング' })).toHaveAttribute(
      'href',
      '/category/programming',
    );
    expect(screen.getByRole('heading', { name: 'プログラミング' })).toBeInTheDocument();
  });

  it('omits breadcrumbs on the home heading', () => {
    render(<PageHeading home />);

    expect(screen.getByRole('heading', { name: '最新記事' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
