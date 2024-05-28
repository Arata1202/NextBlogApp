'use client';

import cheerio from 'cheerio';
import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { formatRichText } from '@/libs/utils';
import { Article as ArticleType } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import Image from 'next/image';
import TableOfContents from '../../components/TableOfContent';
import Sidebar from '../Sidebar';
import ArticleListItem from '../ArticleListItem';
import WithArticleItem from '../WithArticleItem';
import { useEffect, useState } from 'react';
import './article.css';
import TagList from '../TagList';
import AdAlert from '../AdAlert';
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
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  HandThumbUpIcon,
  LinkIcon,
  FolderIcon,
} from '@heroicons/react/24/solid';

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  data: ArticleType;
  articles?: ArticleType[];
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

  const currentIndex = articles!.findIndex((article) => article.id === data.id);
  const prevArticle = currentIndex > 0 ? articles![currentIndex - 1] : null;
  const nextArticle = currentIndex < articles!.length - 1 ? articles![currentIndex + 1] : null;

  const relatedArticles = articles
    ?.filter(
      (article) =>
        article.id !== data.id &&
        article.tags?.some((tag) => data.tags?.some((dataTag) => dataTag.id === tag.id)),
    )
    .slice(0, 3);

  useEffect(() => {
    const highlightCode = (blocks: { rich_text2?: string }[]) => {
      blocks.forEach((block) => {
        if (block.rich_text2) {
          const $ = cheerio.load(block.rich_text2);
          $('pre code').each((_, elm) => {
            const result = hljs.highlightAuto($(elm).text());
            $(elm).html(result.value);
            $(elm).addClass('hljs');
          });
          block.rich_text2 = $.html();
        }
      });
    };

    highlightCode(data.introduction_blocks);
    highlightCode(data.content_blocks);
  }, [data.introduction_blocks, data.content_blocks]);

  return (
    <>
      <div className="hiddenBlock categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
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
                    alt="サムネイル"
                    className={styles.thumbnail}
                    width={960}
                    height={504}
                    loading="eager"
                  />
                </picture>
                <div className={styles.date}>
                  <FolderIcon className="h-5 w-5 mr-2 mt-3" aria-hidden="true" />
                  <TagList tags={data.tags} hasLink={true} />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <PublishedDate date={data.publishedAt || data.createdAt} />
                </div>
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
                                  width={100}
                                  height={100}
                                  alt="吹き出しのイメージ"
                                  className="bubble-image"
                                />
                                <p className="bubble-name text-center">{block.bubble_name}</p>
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
                          __html: formatRichText(block.rich_text2),
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
                  </div>
                ))}
                {headings.length > 0 && <TableOfContents headings={headings} />}
                <div>
                  {data.content_blocks.map((block, index) => (
                    <div key={index}>
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
                                    width={100}
                                    height={100}
                                    alt="吹き出しのイメージ"
                                    className="bubble-image"
                                  />
                                  <p className="bubble-name text-center">{block.bubble_name}</p>
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
                            __html: formatRichText(block.rich_text2),
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
                    </div>
                  ))}
                </div>
                <div className="pt-10">
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
                {relatedArticles && relatedArticles.length > 0 && (
                  <div className="related-articles mt-10">
                    <h1
                      className={`${styles.profile} text-2xl font-semibold flex justify-center pt-10`}
                    >
                      <ArrowPathIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                      関連記事
                    </h1>
                    <div className="mt-5">
                      {relatedArticles.map((article) => (
                        <ArticleListItem key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-10">
                  {prevArticle && (
                    <div className="">
                      <h1 className={`${styles.profile} text-2xl font-semibold flex pt-10 mb-5`}>
                        <ChevronDoubleLeftIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                        次の記事
                      </h1>
                      <ArticleListItem article={prevArticle} />
                    </div>
                  )}
                  {nextArticle && (
                    <div className="">
                      <h1
                        className={`${styles.profile} text-2xl font-semibold flex justify-end mb-5`}
                      >
                        前の記事
                        <ChevronDoubleRightIcon className="h-8 w-8 ml-2" aria-hidden="true" />
                      </h1>
                      <ArticleListItem article={nextArticle} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="articleSidebar">
            <Sidebar articles={articles} />
          </div>
        </div>
      </div>
    </>
  );
}
