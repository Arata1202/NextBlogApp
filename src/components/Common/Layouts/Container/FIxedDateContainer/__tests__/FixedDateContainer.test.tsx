import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FixedDateContainer from '@/components/Common/Layouts/Container/FixedDateContainer';

describe('FixedDateContainer', () => {
  it('renders published and updated dates with the ad disclosure', () => {
    render(
      <FixedDateContainer
        date={new Date('2024-01-02T00:00:00.000Z')}
        updatedDate={new Date('2024-01-03T00:00:00.000Z')}
      />,
    );

    expect(screen.getByText('2024年1月2日')).toBeInTheDocument();
    expect(screen.getByText('2024年1月3日')).toBeInTheDocument();
    expect(screen.getByText('記事内に広告が含まれています。')).toBeInTheDocument();
  });

  it('omits the updated date when it is not provided', () => {
    render(<FixedDateContainer date={new Date('2024-01-02T00:00:00.000Z')} />);

    expect(screen.getByText('2024年1月2日')).toBeInTheDocument();
    expect(screen.queryByText('2024年1月3日')).not.toBeInTheDocument();
  });
});
