import { render } from '@testing-library/react';
import SearchField from '@/components/Elements/SearchField';

describe('SearchField', () => {
  test('スナップショット（SearchField）', () => {
    const { asFragment } = render(<SearchField />);
    expect(asFragment()).toMatchSnapshot();
  });
});
