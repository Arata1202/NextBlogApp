'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/libs/Microcms';
import styles from './index.module.css';
import './plugin.css';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import DoubleDate from '@/components/Common/DoubleDate';
import TableOfContents from '@/components/Common/TableOfContent';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import AdAlert from '@/components/Common/AdAlert';
import Share from '@/components/Common/Share';
import BreadCrumb from '@/components/Common/BreadCrumb';
import WebpImage from '@/components/Common/Elements/WebpImage';
import SpeechBubble from './Elements/Plugins/SpeechBubble';
import CustomHtml from './Elements/Plugins/CustomHtml';
import RichText from './Elements/Plugins/RichText';
import WantToRead from './Elements/Plugins/WantToRead';
import TabBox from './Elements/Plugins/TabBox';
import RelatedArticle from './Elements/RelatedArticle';

interface Heading {
  id: string;
  title: string;
  level: number;
}

type Props = {
  data: Article;
  articles: Article[];
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
                {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
                {block.rich_text && <RichText block={block} />}
                {block.custom_html && <CustomHtml block={block} />}
                {block.article_link && typeof block.article_link !== 'string' && (
                  <WantToRead block={block} />
                )}
                {block.box_merit && <TabBox block={block} merit={true} />}
                {block.box_demerit && <TabBox block={block} demerit={true} />}
                {block.box_point && <TabBox block={block} point={true} />}
                {block.box_common && <TabBox block={block} common={true} />}
              </div>
            ))}
            {headings.length > 0 && <TableOfContents headings={headings} />}
            {data.content_blocks.map((block, index) => (
              <div key={index}>
                {block.google_adsense && <AdUnit slot={block.google_adsense} />}
                {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
                {block.rich_text && <RichText block={block} />}
                {block.custom_html && <CustomHtml block={block} />}
                {block.article_link && typeof block.article_link !== 'string' && (
                  <WantToRead block={block} />
                )}
                {block.box_merit && <TabBox block={block} merit={true} />}
                {block.box_demerit && <TabBox block={block} demerit={true} />}
                {block.box_point && <TabBox block={block} point={true} />}
                {block.box_common && <TabBox block={block} common={true} />}
              </div>
            ))}
            <AdUnit slot="1831092739" />
            <RelatedArticle data={data} />
            <Share data={data} />
          </div>
        </ContentContainer>
        <Sidebar recentArticles={articles} contentBlocks={data.content_blocks} article={true} />
      </MainContainer>
    </>
  );
}
