import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DoubleDate from '@/components/Common/DoubleDate';
import { createArticle } from '@/test/factories';

describe('DoubleDate', () => {
  it('renders only the published date when updatedAt is the same day', () => {
    render(
      <DoubleDate
        article={createArticle({
          publishedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T08:00:00.000Z',
        })}
      />,
    );

    expect(screen.getAllByText('2024年1月1日')).toHaveLength(1);
  });

  it('renders the updated date when updatedAt is a later day', () => {
    render(
      <DoubleDate
        article={createArticle({
          publishedAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        })}
      />,
    );

    expect(screen.getByText('2024年1月1日')).toBeInTheDocument();
    expect(screen.getByText('2024年1月2日')).toBeInTheDocument();
  });
});
