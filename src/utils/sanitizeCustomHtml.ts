import {
  CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE,
  CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE,
} from '@/constants/customHtml';
import { isSafeResourceUrl, loadHtmlFragment, sanitizeHtmlAttributes } from '@/utils/htmlSanitizer';

const INERT_SCRIPT_TYPE = 'application/json';
const MOSHIMO_SCRIPT_ID = 'msmaflink';
const MOSHIMO_SCRIPT_KEYWORD = 'MoshimoAffiliateEasyLink';

const isMoshimoEasyLinkScript = (src: string | undefined, text: string) => {
  return (
    text.includes(MOSHIMO_SCRIPT_ID) ||
    text.includes(MOSHIMO_SCRIPT_KEYWORD) ||
    src?.includes('dn.msmstatic.com/site/cardlink/bundle.js')
  );
};

export const sanitizeCustomHtml = (html: string) => {
  const $ = loadHtmlFragment(html);

  sanitizeHtmlAttributes($);

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

    if (src && isSafeResourceUrl(src)) {
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
