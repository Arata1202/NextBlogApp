import { useTheme } from 'next-themes';
import * as cheerio from 'cheerio';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
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
import 'highlight.js/styles/hybrid.css';

type Props = {
  block: ContentBlock;
};

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

const formatRichText = (richText: string, theme?: string) => {
  const $ = cheerio.load(richText);
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

  $('h2').each((_, elm) => {
    $(elm).addClass(theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700');
  });

  $('h3').each((_, elm) => {
    $(elm).addClass(
      theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700',
    );
  });

  $('h4').each((_, elm) => {
    $(elm).addClass(
      theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700',
    );
  });

  return $.html();
};

export default function RichText({ block }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: formatRichText(block.rich_text!, theme).replace(/<img/g, '<img loading="lazy"'),
        }}
      />
    </>
  );
}
