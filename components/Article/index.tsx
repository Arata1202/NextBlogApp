'use client';

import cheerio from 'cheerio';
const hljs = require('highlight.js/lib/common');
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import shell from 'highlight.js/lib/languages/shell';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import vim from 'highlight.js/lib/languages/vim';
import 'highlight.js/styles/hybrid.css';
import { Article as ArticleType } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import Image from 'next/image';
import TableOfContents from '../../components/TableOfContent';
import Sidebar from '../Sidebar';
import WithArticleItem from '../WithArticleItem';
import { useEffect, useState } from 'react';
import './article.css';
import TagList from '../TagList';
import TagList2 from '../TagList2';
import PanTagList from '../PanTagList';
import AdAlert from '../AdAlert';
import Display from '../Adsense/display';
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import {
  ArrowPathIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  LinkIcon,
  LightBulbIcon,
  InformationCircleIcon,
  HomeIcon,
  ChevronRightIcon,
  RssIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
import { FolderIcon } from '@heroicons/react/24/outline';
import { SiFeedly } from 'react-icons/si';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('json', json);
hljs.registerLanguage('java', java);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('vim', vim);

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  data: ArticleType;
  articles?: ArticleType[];
};

const formatRichText = (richText: string) => {
  const $ = cheerio.load(richText);
  const highlight = (text: string, lang?: string) => {
    if (!lang) return hljs.highlightAuto(text);
    try {
      return hljs.highlight(text, { language: lang?.replace(/^language-/, '') || '' });
    } catch (e) {
      return hljs.highlightAuto(text);
    }
  };
  $('pre code').each((_, elm) => {
    const lang = $(elm).attr('class');
    const res = highlight($(elm).text(), lang);
    $(elm).html(res.value);
    $(elm).addClass('hljs');
  });
  return $.html();
};

function useExtractHeadings(contentBlocks: { rich_text2?: string }[]): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];

    contentBlocks.forEach((block) => {
      if (block.rich_text2) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.rich_text2;
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

export default function Article({ data, articles }: Props) {
  const headings = useExtractHeadings(data.content_blocks);

  return (
    <>
      <div className="hiddenBlock categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
              <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                  <li>
                    <a href="/" className="flex text-gray-500 hover:text-blue-500">
                      <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="h-4 w-4 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500">
                        <PanTagList tags={data.tags} hasLink={true} />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="h-4 w-4 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <a
                        href={`${data.id}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                      >
                        {data.title}
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="space-y-5 lg:space-y-8">
                <h1 className={`${styles.title} text-3xl font-bold lg:text-3xl`}>{data.title}</h1>
                <picture className="w-full">
                  <source
                    type="image/webp"
                    media="(max-width: 640px)"
                    srcSet={`${data.thumbnail?.url}?fm=webp&w=414 1x, ${data.thumbnail?.url}?fm=webp&w=414&dpr=2 2x`}
                  />
                  <source
                    type="image/webp"
                    srcSet={`${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504 1x, ${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504&dpr=2 2x`}
                  />
                  <Image
                    src={data.thumbnail?.url || ''}
                    alt={data.title}
                    className={styles.thumbnail}
                    width={960}
                    height={504}
                    loading="eager"
                  />
                </picture>
                <div className="FirstAd">
                  <Display slot="7197259627" />
                </div>
                <div className={styles.date}>
                  <FolderIcon className="h-5 w-5 mr-2 mt-3" aria-hidden="true" />
                  <TagList tags={data.tags} hasLink={true} />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <PublishedDate date={data.publishedAt || data.createdAt} />
                </div>
                {data.tags2 && data.tags2.length > 0 && (
                  <div className={styles.date}>
                    <TagList2 tags={data.tags2} hasLink={true} />
                  </div>
                )}
                <AdAlert />
                {data.introduction_blocks.map((block, index) => (
                  <div key={index}>
                    {(block.bubble_name || block.bubble_text || block.bubble_image) && (
                      <div className="my-10">
                        <div className={`speech-bubble ${block.bubble_isRight ? 'right' : 'left'}`}>
                          {block.bubble_image && (
                            <div
                              className={`bubble-image-wrapper ${
                                block.bubble_isRight ? 'right' : 'left'
                              }`}
                            >
                              <div>
                                <Image
                                  src={block.bubble_image.url}
                                  width={75}
                                  height={75}
                                  alt="吹き出しのイメージ"
                                  className="bubble-image"
                                />
                              </div>
                            </div>
                          )}
                          <div
                            className={`bubble-content ${block.bubble_isRight ? 'right' : 'left'}`}
                          >
                            <p className="bubble-text">{block.bubble_text}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {block.rich_text2 && (
                      <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                          __html: formatRichText(block.rich_text2).replace(
                            /<img/g,
                            '<img loading="lazy"',
                          ),
                        }}
                      />
                    )}
                    {block.custom_html2 && (
                      <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: block.custom_html2 }}
                      />
                    )}
                    {block.articleLink3 && typeof block.articleLink3 !== 'string' && (
                      <div>
                        <div className="flex mt-10">
                          <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                          <h1 className="text-2xl font-semibold mb-5">あわせて読みたい</h1>
                        </div>
                        <WithArticleItem article={block.articleLink3 as ArticleType} />
                      </div>
                    )}
                    {block.box_merit && (
                      <div className={`${styles.tab_merit_box} flex items-center`}>
                        <HandThumbUpIcon
                          className={`h-8 w-8 ${styles.tab_merit_box_icon}`}
                          aria-hidden="true"
                        />
                        <div dangerouslySetInnerHTML={{ __html: block.box_merit }} />
                      </div>
                    )}
                    {block.box_demerit && (
                      <div className={`${styles.tab_demerit_box} flex items-center`}>
                        <HandThumbDownIcon
                          className={`h-8 w-8 ${styles.tab_demerit_box_icon}`}
                          aria-hidden="true"
                        />
                        <div dangerouslySetInnerHTML={{ __html: block.box_demerit }} />
                      </div>
                    )}
                    {block.box_point && (
                      <div className={`${styles.tab_point_box} flex items-center`}>
                        <LightBulbIcon
                          className={`h-8 w-8 ${styles.tab_point_box_icon}`}
                          aria-hidden="true"
                        />
                        <div dangerouslySetInnerHTML={{ __html: block.box_point }} />
                      </div>
                    )}
                    {block.box_common && (
                      <div className={`${styles.tab_common_box} flex items-center`}>
                        <InformationCircleIcon
                          className={`h-8 w-8 ${styles.tab_common_box_icon}`}
                          aria-hidden="true"
                        />
                        <div dangerouslySetInnerHTML={{ __html: block.box_common }} />
                      </div>
                    )}
                  </div>
                ))}
                <div>{headings.length > 0 && <TableOfContents headings={headings} />}</div>
                <div>
                  <div className={styles.content}>
                    <h2>（宣伝）コミュニティのお知らせ </h2>
                    <img className="" src="/images/blog/community.jpg" alt="" />
                    <p>
                      エンジニア初学者の方がゆるく楽しく学べる場所、<b>リアル大学生コミュニティ</b>
                      を紹介します！
                      <br />
                      以下のような活動を通じて、メンバー同士で交流しています。
                    </p>
                    <ul>
                      <li>
                        <b>アプリ紹介</b>
                        ：メンバーが自身の開発物を紹介できます（開発物がなくてもOK）。
                      </li>
                      <li>
                        <b>フィードバックやアドバイス</b>
                        ：開発物に対するフィードバックを送り合うことができます。
                      </li>
                      <li>
                        <b>ヘルプ</b>
                        ：わからないことがあればいつでも質問可能です。
                      </li>
                      <li>
                        <b>雑談</b>
                        ：エンジニア関連の話題から、それ以外のことまで自由に話せます。
                      </li>
                    </ul>
                    <p>
                      学生以外やエンジニア初学者以外も大歓迎です！
                      <br />
                      興味のある方は、ぜひ以下のリンクからご参加ください。お待ちしております✨
                      <br />
                      <a target="blank" href="https://discord.gg/dzqeSFZf">
                        👉コミュニティに参加する
                      </a>
                    </p>
                  </div>
                  {data.content_blocks.map((block, index) => (
                    <div key={index}>
                      {block.adsense && <Display slot={block.adsense} />}
                      {(block.bubble_name || block.bubble_text || block.bubble_image) && (
                        <div className="my-10">
                          <div
                            className={`speech-bubble ${block.bubble_isRight ? 'right' : 'left'}`}
                          >
                            {block.bubble_image && (
                              <div
                                className={`bubble-image-wrapper ${
                                  block.bubble_isRight ? 'right' : 'left'
                                }`}
                              >
                                <div>
                                  <Image
                                    src={block.bubble_image.url}
                                    width={75}
                                    height={75}
                                    alt="吹き出しのイメージ"
                                    className="bubble-image"
                                  />
                                </div>
                              </div>
                            )}
                            <div
                              className={`bubble-content ${
                                block.bubble_isRight ? 'right' : 'left'
                              }`}
                            >
                              <p className="bubble-text">{block.bubble_text}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {block.rich_text2 && (
                        <div
                          className={styles.content}
                          dangerouslySetInnerHTML={{
                            __html: formatRichText(block.rich_text2).replace(
                              /<img/g,
                              '<img loading="lazy"',
                            ),
                          }}
                        />
                      )}
                      {block.custom_html2 && (
                        <div
                          className={styles.content}
                          dangerouslySetInnerHTML={{ __html: block.custom_html2 }}
                        />
                      )}
                      {block.articleLink3 && typeof block.articleLink3 !== 'string' && (
                        <div>
                          <div className="flex mt-10">
                            <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                            <h1 className="text-2xl font-semibold mb-5">あわせて読みたい</h1>
                          </div>
                          <WithArticleItem article={block.articleLink3 as ArticleType} />
                        </div>
                      )}
                      {block.box_merit && (
                        <div className={`${styles.tab_merit_box} flex items-center`}>
                          <HandThumbUpIcon
                            className={`h-8 w-8 ${styles.tab_merit_box_icon}`}
                            aria-hidden="true"
                          />
                          <div dangerouslySetInnerHTML={{ __html: block.box_merit }} />
                        </div>
                      )}
                      {block.box_demerit && (
                        <div className={`${styles.tab_demerit_box} flex items-center`}>
                          <HandThumbDownIcon
                            className={`h-8 w-8 ${styles.tab_demerit_box_icon}`}
                            aria-hidden="true"
                          />
                          <div dangerouslySetInnerHTML={{ __html: block.box_demerit }} />
                        </div>
                      )}
                      {block.box_point && (
                        <div className={`${styles.tab_point_box} flex items-center`}>
                          <LightBulbIcon
                            className={`h-8 w-8 ${styles.tab_point_box_icon}`}
                            aria-hidden="true"
                          />
                          <div dangerouslySetInnerHTML={{ __html: block.box_point }} />
                        </div>
                      )}
                      {block.box_common && (
                        <div className={`${styles.tab_common_box} flex items-center`}>
                          <InformationCircleIcon
                            className={`h-8 w-8 ${styles.tab_common_box_icon}`}
                            aria-hidden="true"
                          />
                          <div dangerouslySetInnerHTML={{ __html: block.box_common }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="FirstAd">
                  <Display slot="1831092739" />
                  {/* <Mulchplex slot="8943295990" /> */}
                </div>
                <div className="related-articles mt-10">
                  <h1
                    className={`${styles.profile} text-2xl font-semibold flex justify-center pt-10`}
                  >
                    <ArrowPathIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                    関連記事
                  </h1>
                  <div className="mt-5">
                    {data.related_articles?.map((block, index) => (
                      <div key={index}>
                        {block.articleLink3 && typeof block.articleLink3 !== 'string' && (
                          <div>
                            <WithArticleItem article={block.articleLink3 as ArticleType} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <h1
                    className={`${styles.profile} text-2xl font-semibold flex justify-center mb-5`}
                  >
                    <HandThumbUpIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                    シェアする
                  </h1>
                </div>
                <div className="flex justify-center">
                  <TwitterShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    className="m-1"
                  >
                    <TwitterIcon size={40} round={true} />
                  </TwitterShareButton>

                  <FacebookShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    className="m-1"
                  >
                    <FacebookIcon size={40} round={true} />
                  </FacebookShareButton>

                  <LineShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    className="m-1"
                  >
                    <LineIcon size={40} round={true} />
                  </LineShareButton>

                  <HatenaShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    className="m-1"
                  >
                    <HatenaIcon size={40} round={true} />
                  </HatenaShareButton>

                  <PinterestShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    media={data.thumbnail?.url || ''}
                    description={data.title}
                    className="m-1"
                  >
                    <PinterestIcon size={40} round={true} />
                  </PinterestShareButton>

                  <RedditShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    className="m-1"
                  >
                    <RedditIcon size={40} round={true} />
                  </RedditShareButton>

                  <LinkedinShareButton
                    aria-label="シェアボタン"
                    url={`https://realunivlog.com/articles/${data.id}`}
                    title={data.title}
                    summary={data.description}
                    className="m-1"
                  >
                    <LinkedinIcon size={40} round={true} />
                  </LinkedinShareButton>
                </div>
                <div className="mt-2">
                  <div className="pt-3">
                    <h1 className={`text-2xl font-semibold flex justify-center mb-5`}>
                      <UserPlusIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                      フォローする
                    </h1>
                  </div>
                  <div className="flex justify-center">
                    <a
                      aria-label="RSSフォローボタン"
                      href="https://d1n5q2wwrdsa8j.cloudfront.net/rss.xml"
                      className="bg-orange-500 rounded-full p-2 m-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RssIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                    <a
                      aria-label="Feedlyフォローボタン"
                      href="https://feedly.com/i/subscription/feed/https://d1n5q2wwrdsa8j.cloudfront.net/rss.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 rounded-full p-2 m-1"
                    >
                      <SiFeedly className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="flex justify-center mt-5">
                    <a
                      href="https://blogmura.com/profiles/11190305/?p_cid=11190305&reader=11190305"
                      target="_blank"
                    >
                      <img
                        src="https://b.blogmura.com/banner-blogmura-reader-white-small.svg"
                        loading="lazy"
                        width="160"
                        height="36"
                        alt="リアル大学生 - にほんブログ村"
                      />
                    </a>
                    <a
                      href="https://blog.with2.net/link/?id=2117761"
                      title="人気ブログランキング"
                      target="_blank"
                      className="ml-3"
                    >
                      <img
                        alt="人気ブログランキング"
                        loading="lazy"
                        width="93"
                        height="36"
                        src="https://blog.with2.net/img/banner/banner_22.gif"
                      />
                    </a>
                    <a
                      href="https://blogranking.fc2.com/in.php?id=1067087"
                      target="_blank"
                      className="ml-3"
                    >
                      <img
                        loading="lazy"
                        src="https://static.fc2.com/blogranking/ranking_banner/a_02.gif"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="articleSidebar">
            <Sidebar articles={articles} contentBlocks={data.content_blocks} />
          </div>
        </div>
      </div>
    </>
  );
}
