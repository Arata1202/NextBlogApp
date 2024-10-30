import { render } from '@testing-library/react';
import Header from '@/components/Layouts/Header';

describe('Header', () => {
  test('スナップショット（Header）', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
