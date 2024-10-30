import { render } from '@testing-library/react';
import Profile from '@/components/Sidebars/Elements/Profile';

describe('Profile', () => {
  test('スナップショット（Profile）', () => {
    const { asFragment } = render(<Profile />);
    expect(asFragment()).toMatchSnapshot();
  });
});
