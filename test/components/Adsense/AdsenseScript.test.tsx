import { render } from '@testing-library/react';
import { Adsense } from '@/components/Adsense/AdsenseScript';

describe('Adsense', () => {
  test('Adsense)', () => {
    const { asFragment } = render(<Adsense />);
    expect(asFragment()).toMatchSnapshot();
  });
});
