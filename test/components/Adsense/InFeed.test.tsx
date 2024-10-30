import { render } from '@testing-library/react';
import InFeed from '@/components/Adsense/InFeed';

describe('InFeed', () => {
  test('スナップショット（InFeed)', () => {
    const { asFragment } = render(<InFeed slot="00000" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
