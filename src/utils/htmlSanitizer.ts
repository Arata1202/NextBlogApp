import * as cheerio from 'cheerio';
import { SAFE_RESOURCE_PROTOCOLS, hasSafeUrlProtocol } from '@/utils/urlSafety';
import { applySponsoredRelToHtmlLinks } from '@/utils/sponsored';

const URL_ATTRIBUTES = new Set([
  'href',
  'src',
  'xlink:href',
  'action',
  'formaction',
  'poster',
  'data',
]);

export const loadHtmlFragment = (html: string) => cheerio.load(html, {}, false);

export const isSafeResourceUrl = (value: string) =>
  hasSafeUrlProtocol(value, SAFE_RESOURCE_PROTOCOLS);

export const sanitizeHtmlAttributes = ($: ReturnType<typeof cheerio.load>) => {
  $('*').each((_, element) => {
    const target = $(element);
    const attributes = target.attr() ?? {};

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      const normalizedAttributeName = attributeName.toLowerCase();

      if (normalizedAttributeName === 'srcdoc' || normalizedAttributeName.startsWith('on')) {
        target.removeAttr(attributeName);
        return;
      }

      const isNavigation =
        normalizedAttributeName === 'href' || normalizedAttributeName === 'xlink:href';
      if (
        URL_ATTRIBUTES.has(normalizedAttributeName) &&
        !(isNavigation ? hasSafeUrlProtocol(attributeValue) : isSafeResourceUrl(attributeValue))
      ) {
        target.removeAttr(attributeName);
      }
    });
  });
};

export const removeHtmlScripts = ($: ReturnType<typeof cheerio.load>) => {
  $('script').remove();
};

export const sanitizeCmsHtml = (html: string, sponsorUrl?: string) => {
  const $ = loadHtmlFragment(html);

  sanitizeHtmlAttributes($);
  applySponsoredRelToHtmlLinks($, sponsorUrl);
  removeHtmlScripts($);

  return $.html();
};
