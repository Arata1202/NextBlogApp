export function focusAndScroll(target: HTMLElement, scrollTarget: HTMLElement = target) {
  target.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollTarget.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
}
