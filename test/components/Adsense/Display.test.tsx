import { render } from '@testing-library/react';
import Display from '@/components/Adsense/Display';

describe('Display', () => {
  test('スナップショット（Display)', () => {
    const { asFragment } = render(<Display slot="00000" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
