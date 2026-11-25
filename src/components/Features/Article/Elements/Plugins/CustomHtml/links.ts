import { parseUrl } from '@/utils/urlSafety';
import { isSponsorLink, mergeSponsoredRel } from '@/utils/sponsored';

const SAFE_TARGET_BLANK_REL_VALUES = ['noopener', 'noreferrer'];
const generatedBlankTargets = new WeakSet<HTMLAnchorElement>();
const generatedSponsoredRels = new WeakSet<HTMLAnchorElement>();

const shouldOpenInNewTab = (anchor: HTMLAnchorElement) => {
  const url = parseUrl(anchor.href);
  const current = anchor.ownerDocument.location;
  return (
    url !== null &&
    ['https:', 'http:'].includes(url.protocol) &&
    !(
      url.href.includes('#') &&
      current &&
      url.origin === current.origin &&
      url.pathname === current.pathname &&
      url.search === current.search
    )
  );
};

const updateRel = (anchor: HTMLAnchorElement, rel: string) => {
  if (anchor.getAttribute('rel') !== rel) anchor.setAttribute('rel', rel);
};

const mergeRelValues = (currentRel: string | null) => {
  const values = new Set(currentRel?.split(/\s+/).filter(Boolean));

  SAFE_TARGET_BLANK_REL_VALUES.forEach((value) => values.add(value));

  return Array.from(values).join(' ');
};

export const applyTargetBlankToLinks = (content: HTMLElement) => {
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    const target = anchor.target.trim().toLowerCase();
    const openInNewTab = Boolean(href) && shouldOpenInNewTab(anchor);
    if (generatedBlankTargets.has(anchor) && (target !== '_blank' || !openInNewTab)) {
      if (target === '_blank') anchor.removeAttribute('target');
      generatedBlankTargets.delete(anchor);
    }
    if (!target && openInNewTab) {
      anchor.target = '_blank';
      generatedBlankTargets.add(anchor);
    }
    if (anchor.target.toLowerCase() === '_blank') {
      if (anchor.relList.contains('opener')) anchor.relList.remove('opener');
      updateRel(anchor, mergeRelValues(anchor.getAttribute('rel')));
    }
  });
};

export const applySponsoredRelToLinks = (content: HTMLElement, sponsorUrl?: string) => {
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');

    if (sponsorUrl && href && isSponsorLink(href, sponsorUrl)) {
      const rel = anchor.getAttribute('rel');
      const merged = mergeSponsoredRel(rel);
      if (merged !== rel && !/\bsponsored\b/i.test(rel ?? '')) generatedSponsoredRels.add(anchor);
      updateRel(anchor, merged);
    } else if (generatedSponsoredRels.delete(anchor)) {
      anchor.relList.remove('sponsored');
    }
  });
};
