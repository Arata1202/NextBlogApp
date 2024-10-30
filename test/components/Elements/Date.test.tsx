import { render } from '@testing-library/react';
import PublishedDate from '@/components/Elements/Date';

const dummyDate = new Date(2023, 10, 27);
const formattedDate = dummyDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

describe('PublishedDate', () => {
  test('スナップショット（PublishedDate）', () => {
    const { asFragment } = render(<PublishedDate date={formattedDate} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
