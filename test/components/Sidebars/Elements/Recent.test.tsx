import { render } from '@testing-library/react';
import Recent from '@/components/Sidebars/Elements/Recent';

jest.mock('@/components/Sidebars/Elements/Elements/SidebarArticleListItem');

describe('Recent', () => {
  test('スナップショット（Recent）', () => {
    const { asFragment } = render(<Recent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
