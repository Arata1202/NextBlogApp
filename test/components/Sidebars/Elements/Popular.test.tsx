import { render } from '@testing-library/react';
import Popular from '@/components/Sidebars/Elements/Popular';

describe('Popular', () => {
  test('スナップショット（Popular）', () => {
    const { asFragment } = render(<Popular />);
    expect(asFragment()).toMatchSnapshot();
  });
});
