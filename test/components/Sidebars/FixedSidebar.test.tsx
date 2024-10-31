import { render } from '@testing-library/react';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';

jest.mock('@/components/Sidebars/Elements/Search');
jest.mock('@/components/Sidebars/Elements/Profile');
jest.mock('@/components/Sidebars/Elements/Category');
jest.mock('@/components/Sidebars/Elements/News');
jest.mock('@/components/Sidebars/Elements/Tag');
jest.mock('@/components/Sidebars/Elements/Archive');
jest.mock('@/components/Sidebars/Elements/Popular');
jest.mock('@/components/Sidebars/Elements/Recent');
jest.mock('@/components/Adsense/Display');

describe('FixedSidebar', () => {
  test('スナップショット（FixedSidebar）', () => {
    const { asFragment } = render(<FixedSidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
