import { describe, expect, it } from 'vitest';
import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('formats an ISO date in Japanese date notation', () => {
    expect(formatDate('2024-01-15T03:30:00.000Z')).toBe('2024年1月15日');
  });

  it('handles unzoned timestamps consistently and omits invalid values', () => {
    expect(formatDate('2026-11-25T16:00:00')).toBe('2026年11月26日');
    expect(formatDate('invalid')).toBe('');
  });

  it('uses Asia/Tokyo timezone when the UTC date crosses midnight', () => {
    expect(formatDate('2024-01-01T15:00:00.000Z')).toBe('2024年1月2日');
  });
});
