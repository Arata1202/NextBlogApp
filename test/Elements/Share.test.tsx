import { render } from '@testing-library/react';
import Share from '@/components/Elements/Share';

describe('Share', () => {
  test('スナップショット（Share）', () => {
    const { asFragment } = render(<Share />);
    expect(asFragment()).toMatchSnapshot();
  });
});
