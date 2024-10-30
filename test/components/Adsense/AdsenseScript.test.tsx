import { render } from '@testing-library/react';
import { Adsense } from '@/components/Adsense/AdsenseScript';

describe('AdsenseScript', () => {
  test('AdsenseScript)', () => {
    const { asFragment } = render(<Adsense />);
    expect(asFragment()).toMatchSnapshot();
  });
});
