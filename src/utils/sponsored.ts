import type { CheerioAPI } from 'cheerio';
import type { Blog } from '@/types/microcms';

const SPONSORED_REL_VALUE = 'sponsored';
const SPONSORED_FIELDS = ['isSponsored', 'sponsorName', 'sponsorUrl'] as const;

const normalizeHostname = (hostname: string) => hostname.toLowerCase().replace(/^www\./, '');

const parseHttpUrl = (value: string) => {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
};

export const isSponsorLink = (href: string, sponsorUrl: string) => {
  const link = parseHttpUrl(href);
  const sponsor = parseHttpUrl(sponsorUrl);

  if (!link || !sponsor) {
    return false;
  }

  const linkHostname = normalizeHostname(link.hostname);
  const sponsorHostname = normalizeHostname(sponsor.hostname);

  return linkHostname === sponsorHostname || linkHostname.endsWith(`.${sponsorHostname}`);
};

export const mergeSponsoredRel = (currentRel?: string | null) => {
  const values = new Set(currentRel?.split(/\s+/).filter(Boolean));
  values.add(SPONSORED_REL_VALUE);

  return Array.from(values).join(' ');
};

export const applySponsoredRelToHtmlLinks = ($: CheerioAPI, sponsorUrl?: string) => {
  if (!sponsorUrl) {
    return;
  }

  $('a[href]').each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr('href');

    if (href && isSponsorLink(href, sponsorUrl)) {
      anchor.attr('rel', mergeSponsoredRel(anchor.attr('rel')));
    }
  });
};

export const assertValidSponsoredArticle = (article: Blog) => {
  if (!article.isSponsored) {
    return;
  }

  if (!article.sponsorName?.trim()) {
    throw new Error(`Sponsored article "${article.title}" requires sponsorName`);
  }

  if (!article.sponsorUrl?.trim() || !parseHttpUrl(article.sponsorUrl)) {
    throw new Error(`Sponsored article "${article.title}" requires a valid sponsorUrl`);
  }
};

export const includeSponsoredFields = (fields?: string | string[]) => {
  if (fields === undefined || (typeof fields === 'string' && fields.trim() === '')) {
    return fields;
  }

  const fieldList = Array.isArray(fields) ? fields : fields.split(',');
  const values = new Set(fieldList.map((field) => field.trim()).filter(Boolean));
  SPONSORED_FIELDS.forEach((field) => values.add(field));

  return Array.isArray(fields) ? Array.from(values) : Array.from(values).join(',');
};
