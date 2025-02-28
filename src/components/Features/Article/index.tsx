'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import * as cheerio from 'cheerio';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  LinkIcon,
  LightBulbIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
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
import { Article } from '@/libs/Microcms';
import styles from './index.module.css';
import './plugin.css';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import DoubleDate from '@/components/Common/DoubleDate';
import TableOfContents from '@/components/Common/TableOfContent';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import ArticleCard from '@/components/Common/ArticleCard';
import AdAlert from '@/components/Common/AdAlert';
import Share from '@/components/Common/Share';
import BreadCrumb from '@/components/Common/BreadCrumb';
import WebpImage from '@/components/Common/Elements/WebpImage';

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

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  data: Article;
  articles: Article[];
};

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

function useExtractHeadings(contentBlocks: { rich_text?: string }[]): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];

    contentBlocks.forEach((block) => {
      if (block.rich_text) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.rich_text;
        const blockHeadings: Heading[] = Array.from(
          tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        ).map((el) => ({
          id: el.id,
          title: el.textContent || '',
          level: parseInt(el.tagName[1], 10),
        }));
        extractedHeadings.push(...blockHeadings);
      }
    });

    setHeadings(extractedHeadings);
  }, [contentBlocks]);

  return headings;
}

export default function ArticleFeature({ data, articles }: Props) {
  const { theme } = useTheme();

  const headings = useExtractHeadings(data.content_blocks);

  return (
    <>
      <MainContainer article={true}>
        <ContentContainer>
          <BreadCrumb article={data} />
          <div className="space-y-5 lg:space-y-8">
            <h1 className={`${styles.title} text-3xl font-bold lg:text-3xl`}>{data.title}</h1>
            <WebpImage article={data} />
            <DoubleDate article={data} articleMode={true} />
            <AdAlert />
            {data.introduction_blocks.map((block, index) => (
              <div key={index}>
                {block.bubble_text && block.bubble_image && (
                  <div className="my-10">
                    <div className={`speech-bubble ${block.bubble_isRight ? 'right' : 'left'}`}>
                      {block.bubble_image && (
                        <div
                          className={`bubble-image-wrapper ${
                            block.bubble_isRight ? 'right' : 'left'
                          }`}
                        >
                          <img
                            src={block.bubble_image.url}
                            alt="吹き出しのイメージ"
                            width={75}
                            height={75}
                            className="bubble-image"
                          />
                        </div>
                      )}
                      <div className={`bubble-content ${block.bubble_isRight ? 'right' : 'left'}`}>
                        <p className="bubble-text text-gray-700">{block.bubble_text}</p>
                      </div>
                    </div>
                  </div>
                )}
                {block.rich_text && (
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{
                      __html: formatRichText(block.rich_text, theme).replace(
                        /<img/g,
                        '<img loading="lazy"',
                      ),
                    }}
                  />
                )}
                {block.custom_html && (
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: block.custom_html }}
                  />
                )}
                {block.article_link && typeof block.article_link !== 'string' && (
                  <>
                    <div className="flex mt-10">
                      <LinkIcon className="h-8 w-8 mr-2" />
                      <div className="text-2xl font-semibold mb-5">あわせて読みたい</div>
                    </div>
                    <ArticleCard article={block.article_link} />
                  </>
                )}
                {block.box_merit && (
                  <div className={`${styles.tab_merit_box} text-gray-700 flex items-center`}>
                    <HandThumbUpIcon className={`h-8 w-8 ${styles.tab_merit_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_merit }} />
                  </div>
                )}
                {block.box_demerit && (
                  <div className={`${styles.tab_demerit_box} text-gray-700 flex items-center`}>
                    <HandThumbDownIcon className={`h-8 w-8 ${styles.tab_demerit_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_demerit }} />
                  </div>
                )}
                {block.box_point && (
                  <div className={`${styles.tab_point_box} text-gray-700 flex items-center`}>
                    <LightBulbIcon className={`h-8 w-8 ${styles.tab_point_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_point }} />
                  </div>
                )}
                {block.box_common && (
                  <div className={`${styles.tab_common_box} text-gray-700 flex items-center`}>
                    <InformationCircleIcon className={`h-8 w-8 ${styles.tab_common_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_common }} />
                  </div>
                )}
              </div>
            ))}
            <>{headings.length > 0 && <TableOfContents headings={headings} />}</>
            {data.content_blocks.map((block, index) => (
              <div key={index}>
                {block.google_adsense && <AdUnit slot={block.google_adsense} />}
                {block.bubble_text && block.bubble_image && (
                  <div className="my-10">
                    <div className={`speech-bubble ${block.bubble_isRight ? 'right' : 'left'}`}>
                      {block.bubble_image && (
                        <div
                          className={`bubble-image-wrapper ${
                            block.bubble_isRight ? 'right' : 'left'
                          }`}
                        >
                          <img
                            src={block.bubble_image.url}
                            alt="吹き出しのイメージ"
                            width={75}
                            height={75}
                            className="bubble-image"
                          />
                        </div>
                      )}
                      <div className={`bubble-content ${block.bubble_isRight ? 'right' : 'left'}`}>
                        <p className="bubble-text text-gray-700">{block.bubble_text}</p>
                      </div>
                    </div>
                  </div>
                )}
                {block.rich_text && (
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{
                      __html: formatRichText(block.rich_text, theme).replace(
                        /<img/g,
                        '<img loading="lazy"',
                      ),
                    }}
                  />
                )}
                {block.custom_html && (
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: block.custom_html }}
                  />
                )}
                {block.article_link && typeof block.article_link !== 'string' && (
                  <>
                    <div className="flex mt-10">
                      <LinkIcon className="h-8 w-8 mr-2" />
                      <div className="text-2xl font-semibold mb-5">あわせて読みたい</div>
                    </div>
                    <ArticleCard article={block.article_link} />
                  </>
                )}
                {block.box_merit && (
                  <div className={`${styles.tab_merit_box} text-gray-700 flex items-center`}>
                    <HandThumbUpIcon className={`h-8 w-8 ${styles.tab_merit_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_merit }} />
                  </div>
                )}
                {block.box_demerit && (
                  <div className={`${styles.tab_demerit_box} text-gray-700 flex items-center`}>
                    <HandThumbDownIcon className={`h-8 w-8 ${styles.tab_demerit_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_demerit }} />
                  </div>
                )}
                {block.box_point && (
                  <div className={`${styles.tab_point_box} text-gray-700 flex items-center`}>
                    <LightBulbIcon className={`h-8 w-8 ${styles.tab_point_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_point }} />
                  </div>
                )}
                {block.box_common && (
                  <div className={`${styles.tab_common_box} text-gray-700 flex items-center`}>
                    <InformationCircleIcon className={`h-8 w-8 ${styles.tab_common_box_icon}`} />
                    <div dangerouslySetInnerHTML={{ __html: block.box_common }} />
                  </div>
                )}
              </div>
            ))}
            <AdUnit slot="1831092739" />
            <div className="mt-10">
              <div className={`text-2xl font-semibold flex justify-center pt-10`}>
                <LinkIcon className="h-8 w-8 mr-2" />
                関連記事
              </div>
              <div className="mt-5">
                {data.related_articles.map((block, index) => (
                  <div key={index}>
                    {block.article_link && typeof block.article_link !== 'string' && (
                      <ArticleCard article={block.article_link} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Share data={data} />
          </div>
        </ContentContainer>
        <Sidebar recentArticles={articles} contentBlocks={data.content_blocks} article={true} />
      </MainContainer>
    </>
  );
}
