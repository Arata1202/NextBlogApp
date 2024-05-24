'use client';
import { formatRichText } from '@/libs/utils';
import { Article as ArticleType } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import Image from 'next/image';
import TableOfContents from '../../components/TableOfContent';
import Sidebar from '../Sidebar';
import ArticleListItem from '../ArticleListItem';
import WithArticleItem from '../WithArticleItem';
import { useEffect, useState, useMemo, useCallback } from 'react';
import './article.css';
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

function useExtractHeadings(htmlContent: string): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const extractedHeadings: Heading[] = Array.from(
      tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    ).map((el) => ({
      id: el.id,
      title: el.textContent || '',
      level: parseInt(el.tagName[1], 10),
    }));
    setHeadings(extractedHeadings);
  }, [htmlContent]);

  return headings;
}

export default function Article({ data, articles }: Props) {
  const headings = useExtractHeadings(data.content);

  const currentIndex = useMemo(
    () => articles?.findIndex((article) => article.id === data.id) || 0,
    [articles, data.id],
  );

  const prevArticle = useMemo(
    () => (currentIndex > 0 ? articles![currentIndex - 1] : null),
    [currentIndex, articles],
  );

  const nextArticle = useMemo(
    () => (currentIndex < articles!.length - 1 ? articles![currentIndex + 1] : null),
    [currentIndex, articles],
  );

  const relatedArticles = useMemo(() => {
    return articles
      ?.filter(
        (article) =>
          article.id !== data.id &&
          article.tags?.some((tag) => data.tags?.some((dataTag) => dataTag.id === tag.id)),
      )
      .slice(0, 3);
  }, [articles, data.id, data.tags]);

  const renderBlockContent = useCallback((block: any, index: number) => {
    return (
      <div key={index}>
        {block.rich_text && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: formatRichText(block.rich_text),
            }}
          />
        )}
        {block.custom_html && (
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: block.custom_html }} />
        )}
        {block.articleLink && typeof block.articleLink !== 'string' && (
          <div>
            <div className="flex mt-10">
              <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              <h1 className="text-2xl font-semibold mb-5">あわせて読みたい</h1>
            </div>
            <WithArticleItem article={block.articleLink as ArticleType} />
          </div>
        )}
        {block.articleLink2 && typeof block.articleLink2 !== 'string' && (
          <div>
            <div className="flex mt-10">
              <LinkIcon className="h-8 w-8 mr-2" aria-hidden="true" />
              <h1 className="text-2xl font-semibold mb-5">あわせて読みたい</h1>
            </div>
            <WithArticleItem article={block.articleLink2 as ArticleType} />
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <>
      <div className="hiddenBlock categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
              <div className="space-y-5 lg:space-y-8">
                <h1 className="text-3xl font-bold lg:text-3xl">{data.title}</h1>
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
                <div className="includeBanner flex justify-end gap-x-5">
                  <PublishedDate date={data.publishedAt || data.createdAt} />
                </div>
                <p className="includeBanner text-center border border-gray-300 p-3">
                  記事内に広告が含まれています。
                </p>
                {data.introduction_blocks.map(renderBlockContent)}
                {headings.length > 0 && <TableOfContents headings={headings} />}
                <div>{data.content_blocks.map(renderBlockContent)}</div>
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
                    url={data.url}
                    title={data.title}
                    className="m-1"
                  >
                    <TwitterIcon size={40} round={true} />
                  </TwitterShareButton>

                  <FacebookShareButton
                    aria-label="シェアボタン"
                    url={data.url}
                    title={data.title}
                    className="m-1"
                  >
                    <FacebookIcon size={40} round={true} />
                  </FacebookShareButton>

                  <LineShareButton
                    aria-label="シェアボタン"
                    url={data.url}
                    title={data.title}
                    className="m-1"
                  >
                    <LineIcon size={40} round={true} />
                  </LineShareButton>

                  <HatenaShareButton
                    aria-label="シェアボタン"
                    url={data.url}
                    title={data.title}
                    className="m-1"
                  >
                    <HatenaIcon size={40} round={true} />
                  </HatenaShareButton>

                  <PinterestShareButton
                    aria-label="シェアボタン"
                    url={data.url}
                    media={data.thumbnail?.url || ''}
                    description={data.title}
                    className="m-1"
                  >
                    <PinterestIcon size={40} round={true} />
                  </PinterestShareButton>

                  <RedditShareButton
                    aria-label="シェアボタン"
                    url={data.url}
                    title={data.title}
                    className="m-1"
                  >
                    <RedditIcon size={40} round={true} />
                  </RedditShareButton>

                  <LinkedinShareButton
                    aria-label="シェアボタン"
                    url={data.url}
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
