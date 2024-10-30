import { render } from '@testing-library/react';
import AdAlert from '@/components/Articles/Elements/AdAlert';

describe('AdAlert', () => {
  test('スナップショット（AdAlert）', () => {
    const { asFragment } = render(<AdAlert />);
    expect(asFragment()).toMatchSnapshot();
  });
});
