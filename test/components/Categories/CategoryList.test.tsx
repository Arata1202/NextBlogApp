import { render } from '@testing-library/react';
import CategoryList from '@/components/Categories/CategoryList';

jest.mock('@/components/Categories/CategoryListItem');

describe('CategoryList', () => {
  test('スナップショット(CategoryList)', () => {
    const { asFragment } = render(<CategoryList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
