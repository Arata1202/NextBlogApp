import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useIframelyEmbeds } from '@/hooks/useIframelyEmbeds';

function IframelyHarness({ html, renderedHtml }: { html: string; renderedHtml: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIframelyEmbeds(ref, html);

  return (
    <div data-testid="container" ref={ref} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  );
}

describe('useIframelyEmbeds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete window.iframely;
    delete window.iframelyScriptLoading;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('restores broken embed markup and calls the Iframely loader', () => {
    const load = vi.fn();
    window.iframely = { load };

    render(
      <IframelyHarness
        html='<div class="iframely-embed"><a data-iframely-url href="https://example.com"></a></div>'
        renderedHtml='<div class="iframely-embed"></div>'
      />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('container').innerHTML).toContain('data-iframely-url');
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the html has no Iframely embed', () => {
    const load = vi.fn();
    window.iframely = { load };

    render(<IframelyHarness html="<p>No embed</p>" renderedHtml="<p>No embed</p>" />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(load).not.toHaveBeenCalled();
    expect(document.querySelector('script[src*="cdn.iframe.ly/embed.js"]')).not.toBeInTheDocument();
  });
});
