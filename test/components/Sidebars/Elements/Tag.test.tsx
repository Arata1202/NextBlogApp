import { render } from '@testing-library/react';
import Tag from '@/components/Sidebars/Elements/Tag';

describe('Tag', () => {
  test('スナップショット（Tag）', () => {
    const { asFragment } = render(<Tag />);
    expect(asFragment()).toMatchSnapshot();
  });
});
