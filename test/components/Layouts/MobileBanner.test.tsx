import { render } from '@testing-library/react';
import MobileBanner from '@/components/Layouts/MobileBanner';

describe('MobileBanner', () => {
  test('スナップショット（MobileBanner）', () => {
    const { asFragment } = render(<MobileBanner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
