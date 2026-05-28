import { describe, expect, it } from 'vitest';
import { formatHeadings } from '@/utils/formatHeadings';
import type { Heading } from '@/types/heading';

describe('formatHeadings', () => {
  it('adds nested heading numbers and indentation metadata', () => {
    const headings: Heading[] = [
      { id: 'intro', title: 'Intro', level: 2 },
      { id: 'setup', title: 'Setup', level: 3 },
      { id: 'usage', title: 'Usage', level: 3 },
      { id: 'summary', title: 'Summary', level: 2 },
    ];

    expect(formatHeadings(headings)).toEqual([
      { id: 'intro', title: 'Intro', level: 2, number: '1', marginLeft: '20px' },
      { id: 'setup', title: 'Setup', level: 3, number: '1.1', marginLeft: '40px' },
      { id: 'usage', title: 'Usage', level: 3, number: '1.2', marginLeft: '40px' },
      { id: 'summary', title: 'Summary', level: 2, number: '2', marginLeft: '20px' },
    ]);
  });

  it('resets deeper heading counters after a higher-level heading', () => {
    const headings: Heading[] = [
      { id: 'a', title: 'A', level: 2 },
      { id: 'a-1', title: 'A.1', level: 3 },
      { id: 'b', title: 'B', level: 2 },
      { id: 'b-1', title: 'B.1', level: 3 },
    ];

    expect(formatHeadings(headings).map((heading) => heading.number)).toEqual([
      '1',
      '1.1',
      '2',
      '2.1',
    ]);
  });
});
