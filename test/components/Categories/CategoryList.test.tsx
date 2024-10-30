import { render } from '@testing-library/react';
import CategoryList from '@/components/Categories/CategoryList';

describe('CategoryList', () => {
  test('スナップショット(CategoryList)', () => {
    const { asFragment } = render(<CategoryList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
