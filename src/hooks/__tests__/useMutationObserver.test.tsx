import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMutationObserver } from '@/hooks/useMutationObserver';

function MutationObserverHarness() {
  useMutationObserver();

  return (
    <div
      className="mut-guard"
      data-testid="target"
      style={{ height: '100px', minHeight: '100px' }}
    />
  );
}

describe('useMutationObserver', () => {
  it('removes forced height styles when the guarded element style changes', async () => {
    const { getByTestId } = render(<MutationObserverHarness />);
    const target = getByTestId('target');

    target.style.height = '200px';
    target.style.minHeight = '200px';

    await waitFor(() => {
      expect(target).not.toHaveStyle({ height: '200px' });
      expect(target).not.toHaveStyle({ minHeight: '200px' });
    });
  });
});
