import { render } from '@testing-library/react';
import Footer from '@/components/Layouts/Footer';

jest.mock('@/components/Layouts/MobileBanner');

describe('Footer', () => {
  test('スナップショット（Footer）', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
