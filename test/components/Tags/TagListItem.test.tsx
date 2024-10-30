import { render } from '@testing-library/react';
import TagListItem from '@/components/Tags/TagListItem';
import type { Tag } from '@/libs/microcms';

describe('TagListItem', () => {
  test('スナップショット(TagListItem)', () => {
    const tag: Tag = { name: 'example', id: '1', createdAt: '', updatedAt: '' };
    const { asFragment } = render(<TagListItem tag={tag} hasLink={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
