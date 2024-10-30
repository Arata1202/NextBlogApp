import { render } from '@testing-library/react';
import Archive from '@/components/Sidebars/Elements/Archive';

describe('Archive', () => {
  test('スナップショット（Archive）', () => {
    const { asFragment } = render(<Archive />);
    expect(asFragment()).toMatchSnapshot();
  });
});
