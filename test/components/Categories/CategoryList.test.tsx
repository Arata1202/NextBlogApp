import { render } from '@testing-library/react';
import CategoryList from '@/components/Categories/CategoryList';

describe('CategoryList', () => {
  test('CategoryList)', () => {
    const { asFragment } = render(<CategoryList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
