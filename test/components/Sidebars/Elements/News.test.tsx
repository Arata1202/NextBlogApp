import { render } from '@testing-library/react';
import News from '@/components/Sidebars/Elements/News';

describe('News', () => {
  test('スナップショット（News）', () => {
    const { asFragment } = render(<News />);
    expect(asFragment()).toMatchSnapshot();
  });
});
