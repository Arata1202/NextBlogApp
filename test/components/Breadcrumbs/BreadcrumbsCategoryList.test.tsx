import { render } from '@testing-library/react';
import BreadcrumbsCategoryList from '@/components/Breadcrumbs/BreadcrumbsCategoryList';

jest.mock('@/components/Breadcrumbs/BreadcrumbsCategoryListItem');

describe('BreadcrumbsCategoryList', () => {
  test('スナップショット(BreadcrumbsCategoryList)', () => {
    const { asFragment } = render(<BreadcrumbsCategoryList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
