import { render } from '@testing-library/react';
import TableOfContents from '@/components/Articles/Elements/TableOfContent';

const mockHeadings = [
  { id: '1', title: 'Heading 1', level: 1 },
  { id: '2', title: 'Heading 2', level: 2 },
  { id: '3', title: 'Heading 3', level: 3 },
  { id: '4', title: 'Heading 2', level: 2 },
  { id: '5', title: 'Heading 1', level: 1 },
];

describe('TableOfContent', () => {
  test('スナップショット（TableOfContent）', () => {
    const { asFragment } = render(<TableOfContents headings={mockHeadings} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
