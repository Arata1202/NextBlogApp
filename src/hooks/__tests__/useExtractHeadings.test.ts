import { describe, expect, it } from 'vitest';
import { useExtractHeadings } from '@/hooks/useExtractHeadings';

describe('useExtractHeadings', () => {
  it('extracts h1 through h5 headings from rich text blocks in order', () => {
    expect(
      useExtractHeadings([
        { rich_text: '<h2 id="first">First</h2><p>Body</p><h3 id="child">Child</h3>' },
        {},
        { rich_text: '<h5 id="deep">Deep <span>heading</span></h5><h6 id="ignored">Ignored</h6>' },
      ]),
    ).toEqual([
      { id: 'first', title: 'First', level: 2 },
      { id: 'child', title: 'Child', level: 3 },
      { id: 'deep', title: 'Deep heading', level: 5 },
    ]);
  });

  it('falls back to an empty id when the heading has no id attribute', () => {
    expect(useExtractHeadings([{ rich_text: '<h2>Untitled</h2>' }])).toEqual([
      { id: '', title: 'Untitled', level: 2 },
    ]);
  });
});
