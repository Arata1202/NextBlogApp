import { render } from '@testing-library/react';
import TopSidebar from '@/components/Sidebars/TopSidebar';

describe('TopSidebar', () => {
  test('スナップショット（TopSidebar）', () => {
    const { asFragment } = render(<TopSidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
