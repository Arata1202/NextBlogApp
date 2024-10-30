import { render } from '@testing-library/react';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';

describe('FixedSidebar', () => {
  test('スナップショット（FixedSidebar）', () => {
    const { asFragment } = render(<FixedSidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
