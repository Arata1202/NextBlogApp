import { render } from '@testing-library/react';
import TagList from '@/components/Tags/TagList';

describe('TagList', () => {
  test('TagList)', () => {
    const { asFragment } = render(<TagList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
