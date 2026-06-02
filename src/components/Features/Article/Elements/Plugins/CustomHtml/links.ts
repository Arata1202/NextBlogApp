import { parseUrl } from '@/utils/urlSafety';

const SAFE_TARGET_BLANK_REL_VALUES = ['noopener', 'noreferrer'];
const SAME_PAGE_FRAGMENT_BASE = 'https://example.invalid/';
const EXCLUDED_TARGET_BLANK_PROTOCOLS = new Set(['mailto:', 'tel:']);

const shouldOpenInNewTab = (href: string) => {
  const trimmedHref = href.trim();
  const url = parseUrl(trimmedHref, SAME_PAGE_FRAGMENT_BASE);

  return (
    trimmedHref.charAt(0) !== '#' &&
    Boolean(url) &&
    !(
      url?.origin === new URL(SAME_PAGE_FRAGMENT_BASE).origin &&
      url.pathname === '/' &&
      url.hash
    ) &&
    !EXCLUDED_TARGET_BLANK_PROTOCOLS.has(url?.protocol ?? '')
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
