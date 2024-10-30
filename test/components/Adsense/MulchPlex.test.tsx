import { render } from '@testing-library/react';
import Mulchplex from '@/components/Adsense/MulchPlex';

describe('MulchPlex', () => {
  test('スナップショット（MulchPlex)', () => {
    const { asFragment } = render(<Mulchplex slot="00000" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
