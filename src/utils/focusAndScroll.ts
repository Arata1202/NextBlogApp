export function focusAndScroll(target: HTMLElement, block: ScrollLogicalPosition) {
  target.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block });
}
