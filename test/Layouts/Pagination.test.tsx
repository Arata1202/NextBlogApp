import { render } from '@testing-library/react';
import Pagination from '@/components/Layouts/Pagination';

describe('Pagination', () => {
  test('スナップショット（Pagination）', () => {
    const { asFragment } = render(<Pagination totalCount={100} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
