import { render } from '@testing-library/react';
import Search from '@/components/Sidebars/Elements/Search';

jest.mock('@/components/Elements/SearchField');

describe('Search', () => {
  test('スナップショット（Search）', () => {
    const { asFragment } = render(<Search />);
    expect(asFragment()).toMatchSnapshot();
  });
});
