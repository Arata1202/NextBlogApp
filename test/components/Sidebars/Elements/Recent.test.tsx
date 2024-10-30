import { render } from '@testing-library/react';
import Recent from '@/components/Sidebars/Elements/Recent';

describe('Recent', () => {
  test('スナップショット（Recent）', () => {
    const { asFragment } = render(<Recent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
