import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useIsClient } from '@/hooks/useIsClient';

function UseIsClientHarness() {
  const isClient = useIsClient();

  return <div>{isClient ? 'client' : 'server'}</div>;
}

describe('useIsClient', () => {
  it('returns true after mounting in a browser-like environment', () => {
    render(<UseIsClientHarness />);

    expect(screen.getByText('client')).toBeInTheDocument();
  });
});
