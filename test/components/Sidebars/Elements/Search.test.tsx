import { render } from '@testing-library/react';
import Search from '@/components/Sidebars/Elements/Search';

describe('Search', () => {
  test('スナップショット（Search）', () => {
    const { asFragment } = render(<Search />);
    expect(asFragment()).toMatchSnapshot();
  });
});
