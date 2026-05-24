import * as cheerio from 'cheerio';
import 'highlight.js/styles/hybrid.css';
import hljs from 'highlight.js/lib/common';
import javascript from 'highlight.js/lib/languages/javascript';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import php from 'highlight.js/lib/languages/php';
import shell from 'highlight.js/lib/languages/shell';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import dart from 'highlight.js/lib/languages/dart';
import vim from 'highlight.js/lib/languages/vim';
import { formatMicroCmsImageUrl, isMicroCmsImageUrl } from './formatMicroCmsImageUrl';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('dart', dart);
hljs.registerLanguage('vim', vim);

const RICH_TEXT_IMAGE_WIDTHS = [640, 960, 1200];
export const ARTICLE_CONTENT_AD_MARKER = '<!--article-content-ad-->';

type FormatRichTextOptions = {
  insertAdsBeforeH2?: boolean;
};

const loadHtmlFragment = (html: string) => {
  const load = cheerio.load as unknown as (
    content: string,
    options: null,
    isDocument: boolean,
  ) => ReturnType<typeof cheerio.load>;

  return load(html, null, false);
};

const formatRichTextImages = ($: ReturnType<typeof cheerio.load>) => {
  $('img').each((_, elm) => {
    const image = $(elm);
    const src = image.attr('src');

    if (!src) {
      return;
    }

    if (isMicroCmsImageUrl(src)) {
      image.attr('src', formatMicroCmsImageUrl(src, { width: 960 }));
      image.attr(
        'srcset',
        RICH_TEXT_IMAGE_WIDTHS.map((width) => {
          return `${formatMicroCmsImageUrl(src, { width })} ${width}w`;
        }).join(', '),
      );
      image.attr('sizes', '(max-width: 768px) 100vw, 960px');
    }

    if (!image.attr('loading')) {
      image.attr('loading', 'lazy');
    }
  });
};

export const formatRichText = (richText: string, options: FormatRichTextOptions = {}) => {
  const $ = loadHtmlFragment(richText);
  const highlight = (text: string, lang?: string) => {
    if (!lang) return hljs.highlightAuto(text);
    try {
      return hljs.highlight(text, { language: lang.replace(/^language-/, '') });
    } catch {
      return hljs.highlightAuto(text);
    }
  };

  $('pre code').each((_, elm) => {
    const lang = $(elm).attr('class');
    const res = highlight($(elm).text(), lang);
    $(elm).html(res.value);
    $(elm).addClass('hljs');
  });

  formatRichTextImages($);

  if (options.insertAdsBeforeH2) {
    $('h2').before(ARTICLE_CONTENT_AD_MARKER);
  }

  return $.html();
};
