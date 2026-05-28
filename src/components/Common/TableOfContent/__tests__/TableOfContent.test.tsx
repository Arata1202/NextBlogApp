import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TableOfContents from '@/components/Common/TableOfContent';

describe('TableOfContents', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 20,
    });
  });

  it('renders formatted heading numbers and scrolls to the clicked heading with offset', async () => {
    const user = userEvent.setup();
    const target = document.createElement('section');
    target.id = 'intro';
    target.getBoundingClientRect = vi.fn(() => ({
      top: 300,
      bottom: 500,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: 300,
      toJSON: () => ({}),
    }));
    document.body.appendChild(target);

    render(
      <TableOfContents
        headings={[
          { id: 'intro', title: 'Intro', level: 2 },
          { id: 'child', title: 'Child', level: 3 },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: '1 Intro' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: '1.1 Child' })).toHaveAttribute('href', '#child');

    await user.click(screen.getByRole('link', { name: '1 Intro' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 190, behavior: 'smooth' });
  });
});
