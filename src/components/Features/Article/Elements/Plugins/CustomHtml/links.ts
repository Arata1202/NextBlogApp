const SAFE_TARGET_BLANK_REL_VALUES = ['noopener', 'noreferrer'];

const shouldOpenInNewTab = (href: string) => {
  const trimmedHref = href.trim();
  const lowerHref = trimmedHref.toLowerCase();

  return (
    trimmedHref !== '' &&
    !trimmedHref.startsWith('#') &&
    !lowerHref.startsWith('javascript:') &&
    !lowerHref.startsWith('mailto:') &&
    !lowerHref.startsWith('tel:')
  );
};

const mergeRelValues = (currentRel: string | null) => {
  const values = new Set(currentRel?.split(/\s+/).filter(Boolean));

  SAFE_TARGET_BLANK_REL_VALUES.forEach((value) => values.add(value));

  return Array.from(values).join(' ');
};

export const applyTargetBlankToLinks = (content: HTMLElement) => {
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');

    if (!href || !shouldOpenInNewTab(href) || target?.trim()) {
      return;
    }

    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', mergeRelValues(anchor.getAttribute('rel')));
  });
};
