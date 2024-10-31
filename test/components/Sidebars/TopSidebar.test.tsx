import { render } from '@testing-library/react';
import TopSidebar from '@/components/Sidebars/TopSidebar';

jest.mock('@/components/Sidebars/Elements/Search');
jest.mock('@/components/Sidebars/Elements/Profile');
jest.mock('@/components/Sidebars/Elements/Category');
jest.mock('@/components/Sidebars/Elements/News');
jest.mock('@/components/Sidebars/Elements/Tag');
jest.mock('@/components/Sidebars/Elements/Archive');
jest.mock('@/components/Sidebars/Elements/Popular');
jest.mock('@/components/Adsense/Display');

describe('TopSidebar', () => {
  test('スナップショット（TopSidebar）', () => {
    const { asFragment } = render(<TopSidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
