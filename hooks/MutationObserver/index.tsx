import { useEffect } from 'react';

export const useGuardObserver = () => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const targets = document.querySelectorAll<HTMLElement>('.mut-guard');
      const observers: MutationObserver[] = [];

      targets.forEach((target) => {
        const heightChangeObserver = new MutationObserver(() => {
          target.style.height = '';
          target.style.minHeight = '';
        });

        heightChangeObserver.observe(target, {
          attributes: true,
          attributeFilter: ['style'],
        });

        observers.push(heightChangeObserver);
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
