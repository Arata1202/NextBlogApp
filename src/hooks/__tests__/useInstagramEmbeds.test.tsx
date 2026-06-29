import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useInstagramEmbeds } from '@/hooks/useInstagramEmbeds';

function InstagramHarness({ html, renderedHtml }: { html: string; renderedHtml: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useInstagramEmbeds(ref, html);

  return (
    <div data-testid="container" ref={ref} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  );
}

describe('useInstagramEmbeds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete window.instgrm;
    delete window.instagramScriptLoading;
  });

  afterEach(() => {
    document.querySelectorAll('script[src*="instagram.com/embed.js"]').forEach((script) => {
      script.remove();
    });
    vi.useRealTimers();
  });

  it('calls the Instagram embed processor when an embed exists', () => {
    const process = vi.fn();
    window.instgrm = { Embeds: { process } };

    render(
      <InstagramHarness
        html='<blockquote class="instagram-media"></blockquote>'
        renderedHtml='<blockquote class="instagram-media"></blockquote>'
      />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(process).toHaveBeenCalledTimes(1);
  });

  it('loads the Instagram script only when the html contains an embed', () => {
    render(
      <InstagramHarness
        html='<blockquote class="instagram-media"></blockquote>'
        renderedHtml='<blockquote class="instagram-media"></blockquote>'
      />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(
      document.querySelector('script[src="https://www.instagram.com/embed.js"]'),
    ).toBeInTheDocument();
  });

  it('does nothing when the html has no Instagram embed', () => {
    const process = vi.fn();
    window.instgrm = { Embeds: { process } };

    render(<InstagramHarness html="<p>No embed</p>" renderedHtml="<p>No embed</p>" />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(process).not.toHaveBeenCalled();
    expect(document.querySelector('script[src*="instagram.com/embed.js"]')).not.toBeInTheDocument();
    expect(screen.getByTestId('container')).toHaveTextContent('No embed');
  });
});
