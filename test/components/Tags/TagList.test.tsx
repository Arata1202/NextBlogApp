import { render } from '@testing-library/react';
import TagList from '@/components/Tags/TagList';

jest.mock('@/components/Tags/TagListItem');

describe('TagList', () => {
  test('スナップショット(TagList)', () => {
    const { asFragment } = render(<TagList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
