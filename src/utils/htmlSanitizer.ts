import * as cheerio from 'cheerio';
import { SAFE_RESOURCE_PROTOCOLS, hasSafeUrlProtocol } from '@/utils/urlSafety';

const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href']);

export const loadHtmlFragment = (html: string) => {
  const load = cheerio.load as unknown as (
    content: string,
    options: null,
    isDocument: boolean,
  ) => ReturnType<typeof cheerio.load>;

  return load(html, null, false);
};

export const isSafeResourceUrl = (value: string) =>
  hasSafeUrlProtocol(value, SAFE_RESOURCE_PROTOCOLS);

export const sanitizeHtmlAttributes = ($: ReturnType<typeof cheerio.load>) => {
  $('*').each((_, element) => {
    const target = $(element);
    const attributes = target.attr() ?? {};

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      const normalizedAttributeName = attributeName.toLowerCase();

      if (normalizedAttributeName.startsWith('on')) {
        target.removeAttr(attributeName);
        return;
      }

      if (URL_ATTRIBUTES.has(normalizedAttributeName) && !hasSafeUrlProtocol(attributeValue)) {
        target.removeAttr(attributeName);
      }
    });
  });
};

export const removeHtmlScripts = ($: ReturnType<typeof cheerio.load>) => {
  $('script').remove();
};

export const sanitizeCmsHtml = (html: string) => {
  const $ = loadHtmlFragment(html);

  sanitizeHtmlAttributes($);
  removeHtmlScripts($);

  return $.html();
};
