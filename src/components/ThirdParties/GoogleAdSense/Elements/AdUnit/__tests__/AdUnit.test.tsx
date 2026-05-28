import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';

describe('AdUnit', () => {
  afterEach(() => {
    vi.useRealTimers();
    window.adsbygoogle = [];
  });

  it('renders the configured ad slot and pushes to adsbygoogle after mount', () => {
    vi.useFakeTimers();
    window.adsbygoogle = [];

    render(<AdUnit slot="slot-1" format="auto" responsive="true" />);

    const ad = screen.getByText('スポンサーリンク').nextElementSibling;
    expect(ad).toHaveAttribute('data-ad-slot', 'slot-1');
    expect(ad).toHaveAttribute('data-ad-format', 'auto');
    expect(ad).toHaveAttribute('data-full-width-responsive', 'true');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(window.adsbygoogle).toHaveLength(1);
  });
});
