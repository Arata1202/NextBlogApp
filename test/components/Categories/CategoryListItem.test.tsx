import { render } from '@testing-library/react';
import CategoryListItem from '@/components/Categories/CategoryListItem';
import type { Tag } from '@/libs/microcms';

describe('CategoryListItem', () => {
  test('CategoryListItem)', () => {
    const tag: Tag = { name: 'example', id: '1', createdAt: '', updatedAt: '' };
    const { asFragment } = render(<CategoryListItem tag={tag} hasLink={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
