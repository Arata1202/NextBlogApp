import { render } from '@testing-library/react';
import BreadcrumbsCategoryList from '@/components/Breadcrumbs/BreadcrumbsCategoryList';

describe('BreadcrumbsCategoryList', () => {
  test('BreadcrumbsCategoryList)', () => {
    const { asFragment } = render(<BreadcrumbsCategoryList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
