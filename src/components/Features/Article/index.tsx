import * as cheerio from 'cheerio';
import { Article } from '@/types/microcms';
import styles from './index.module.css';
import '../../../styles/plugin.css';
import DoubleDate from '@/components/Common/DoubleDate';
import TableOfContents from '@/components/Common/TableOfContent';
import AdAlert from '@/components/Common/AdAlert';
import WebpImage from '@/components/Common/Elements/WebpImage';
import SpeechBubble from './Elements/Plugins/SpeechBubble';
import CustomHtml from './Elements/Plugins/CustomHtml';
import RichText from './Elements/Plugins/RichText';
import WantToRead from './Elements/Plugins/WantToRead';
import TabBox from './Elements/Plugins/TabBox';
import ImageSlider from './Elements/Plugins/ImageSlider';
import RelatedArticle from './Elements/RelatedArticle';
import { useExtractHeadings } from '@/hooks/useExtractHeadings';

type Props = {
  data: Article;
  relatedArticles: Article[];
};

const ARTICLE_CONTENT_AD_SLOTS = [
  '3862359702',
  '4134656590',
  '1508493258',
  '7122329314',
  '5809247647',
  '6569248246',
  '2630003238',
  '8243839293',
];

const countH2Elements = (richText: string) => {
  const $ = cheerio.load(richText);

  return $('h2').length;
};

export default function ArticleFeature({ data, relatedArticles }: Props) {
  const headings = useExtractHeadings(data.content_blocks);
  const contentBlockAdSlots = data.content_blocks.reduce(
    (result, block) => {
      const h2Count = block.rich_text ? countH2Elements(block.rich_text) : 0;
      const adSlots = ARTICLE_CONTENT_AD_SLOTS.slice(
        result.usedSlotCount,
        result.usedSlotCount + h2Count,
      );

      return {
        usedSlotCount: result.usedSlotCount + h2Count,
        adSlotsByBlock: [...result.adSlotsByBlock, adSlots],
      };
    },
    { usedSlotCount: 0, adSlotsByBlock: [] as string[][] },
  ).adSlotsByBlock;

  return (
    <>
      <h1 className={`${styles.title} text-3xl font-bold lg:text-3xl`}>{data.title}</h1>
      <WebpImage article={data} />
      <DoubleDate article={data} articleMode={true} />
      <AdAlert />
      {data.introduction_blocks.map((block, index) => (
        <div className="mt-10" key={index}>
          {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
          {block.rich_text && <RichText block={block} articleTitle={data.title} />}
          {block.custom_html && <CustomHtml block={block} />}
          {block.image_slider && block.image_slider.length > 0 && (
            <ImageSlider block={block} imageAltFallback={data.title} />
          )}
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
      {data.content_blocks.map((block, index) => {
        return (
          <div key={index} className="mt-5">
            {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
            {block.rich_text && (
              <RichText
                block={block}
                adSlots={contentBlockAdSlots[index]}
                articleTitle={data.title}
              />
            )}
            {block.custom_html && <CustomHtml block={block} />}
            {block.image_slider && block.image_slider.length > 0 && (
              <ImageSlider block={block} imageAltFallback={data.title} />
            )}
            {block.article_link && typeof block.article_link !== 'string' && (
              <WantToRead block={block} />
            )}
            {block.box_merit && <TabBox block={block} merit={true} />}
            {block.box_demerit && <TabBox block={block} demerit={true} />}
            {block.box_point && <TabBox block={block} point={true} />}
            {block.box_common && <TabBox block={block} common={true} />}
          </div>
        );
      })}
      <RelatedArticle relatedArticles={relatedArticles} />
    </>
  );
}
