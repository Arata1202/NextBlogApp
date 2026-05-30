import * as cheerio from 'cheerio';
import {
  CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE,
  CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE,
} from '@/constants/customHtml';

const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href']);
const INERT_SCRIPT_TYPE = 'application/json';
const MOSHIMO_SCRIPT_ID = 'msmaflink';
const MOSHIMO_SCRIPT_KEYWORD = 'MoshimoAffiliateEasyLink';

const loadHtmlFragment = (html: string) => {
  const load = cheerio.load as unknown as (
    content: string,
    options: null,
    isDocument: boolean,
  ) => ReturnType<typeof cheerio.load>;

  return load(html, null, false);
};

const isDangerousUrl = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  return (
    normalizedValue.startsWith('javascript:') ||
    normalizedValue.startsWith('vbscript:') ||
    normalizedValue.startsWith('data:text/html') ||
    normalizedValue.startsWith('data:image/svg+xml')
  );
};

const isMoshimoEasyLinkScript = (src: string | undefined, text: string) => {
  return (
    text.includes(MOSHIMO_SCRIPT_ID) ||
    text.includes(MOSHIMO_SCRIPT_KEYWORD) ||
    src?.includes('dn.msmstatic.com/site/cardlink/bundle.js')
  );
};

export const sanitizeCustomHtml = (html: string) => {
  const $ = loadHtmlFragment(html);

  $('*').each((_, element) => {
    const target = $(element);
    const attributes = target.attr() ?? {};

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      const normalizedAttributeName = attributeName.toLowerCase();

      if (normalizedAttributeName.startsWith('on')) {
        target.removeAttr(attributeName);
        return;
      }

      if (URL_ATTRIBUTES.has(normalizedAttributeName) && isDangerousUrl(attributeValue)) {
        target.removeAttr(attributeName);
      }
    });
  });

  $('script').each((_, element) => {
    const script = $(element);
    const src = script.attr('src')?.trim();

    if (isMoshimoEasyLinkScript(src, script.text())) {
      Object.keys(script.attr() ?? {}).forEach((attributeName) => {
        script.removeAttr(attributeName);
      });
      script.attr('type', INERT_SCRIPT_TYPE);
      script.attr(CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE, 'true');
      return;
    }

    if (src && !isDangerousUrl(src)) {
      Object.keys(script.attr() ?? {}).forEach((attributeName) => {
        script.removeAttr(attributeName);
      });
      script.attr('type', INERT_SCRIPT_TYPE);
      script.attr(CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE, src);
      script.text('');
      return;
    }

    script.remove();
  });

  return $.html();
};
