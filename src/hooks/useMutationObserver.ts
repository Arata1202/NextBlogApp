import { useCallback } from 'react';

export const useMutationObserver = () =>
  useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const observer = new MutationObserver((mutations) => {
      for (const { target } of mutations) {
        if (!(target instanceof HTMLElement) || !target.classList.contains('mut-guard')) continue;
        // Each mounted guard owns itself and its immediate ad element.
        if (target !== container && target.parentElement !== container) continue;
        if (target.style.height) target.style.height = '';
        if (target.style.minHeight) target.style.minHeight = '';
      }
    });
    observer.observe(container, { subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);
