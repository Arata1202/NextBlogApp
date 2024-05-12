//最適化済み

'use client';

import { formatRichText } from '@/libs/utils';
import { type Article } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import Image from 'next/image';
import TableOfContents from '../../components/TableOfContent';
import Sidebar from '../Sidebar';
import { useMemo } from 'react';
import './article.css';

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  data: Article;
  articles?: Article[];
};

function useExtractHeadings(htmlContent: string): Heading[] {
  return useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const headings: Heading[] = Array.from(tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
      (el) => ({
        id: el.id,
        title: el.textContent || '',
        level: parseInt(el.tagName[1], 10),
      }),
    );
    return headings;
  }, [htmlContent]);
}

export default function Article({ data }: Props) {
  //目次
  const headings = useExtractHeadings(data.content);

  return (
    <div className="categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
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
                  alt=""
                  className={styles.thumbnail}
                  width={960}
                  height={504}
                  loading="lazy"
                />
              </picture>
              <div className="includeBanner flex justify-end gap-x-5">
                {/* <TagList tags={data.tags} /> */}
                <PublishedDate date={data.publishedAt || data.createdAt} />
              </div>
              <p className="includeBanner text-center border border-gray-300 p-3">
                記事内に広告が含まれています。
              </p>
              {data.introduction && (
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: `${formatRichText(data.introduction)}`,
                  }}
                />
              )}
              <div>{headings.length > 0 && <TableOfContents headings={headings} />}</div>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: `${formatRichText(data.content)}`,
                }}
              />
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
