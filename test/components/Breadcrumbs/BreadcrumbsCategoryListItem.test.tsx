import { render } from '@testing-library/react';
import BreadcrumbsCategoryListItem from '@/components/Breadcrumbs/BreadcrumbsCategoryListItem';
import type { Tag } from '@/libs/microcms';

describe('BreadcrumbsCategoryListItem', () => {
  test('スナップショット(BreadcrumbsCategoryListItem)', () => {
    const tag: Tag = { name: 'example', id: '1', createdAt: '', updatedAt: '' };
    const { asFragment } = render(<BreadcrumbsCategoryListItem tag={tag} hasLink={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
