import { render } from '@testing-library/react';
import Category from '@/components/Sidebars/Elements/Category';

describe('Category', () => {
  test('スナップショット（Category）', () => {
    const { asFragment } = render(<Category />);
    expect(asFragment()).toMatchSnapshot();
  });
});
