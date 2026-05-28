import { describe, expect, it } from 'vitest';
import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('formats an ISO date in Japanese date notation', () => {
    expect(formatDate('2024-01-15T03:30:00.000Z')).toBe('2024年1月15日');
  });

  it('uses Asia/Tokyo timezone when the UTC date crosses midnight', () => {
    expect(formatDate('2024-01-01T15:00:00.000Z')).toBe('2024年1月2日');
  });
});
