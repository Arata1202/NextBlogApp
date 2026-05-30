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
import { formatRichText } from '@/utils/formatRichText';
import { sanitizeCustomHtml } from '@/utils/sanitizeCustomHtml';

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
  const introductionBlocks = data.introduction_blocks.map((block) => ({
    block,
    richTextHtml: block.rich_text
      ? formatRichText(block.rich_text, {
          imageAltFallback: data.title,
        })
      : undefined,
    customHtml: block.custom_html ? sanitizeCustomHtml(block.custom_html) : undefined,
  }));
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
  const contentBlocks = data.content_blocks.map((block, index) => ({
    block,
    richTextHtml: block.rich_text
      ? formatRichText(block.rich_text, {
          insertAdsBeforeH2: contentBlockAdSlots[index].length > 0,
          imageAltFallback: data.title,
        })
      : undefined,
    customHtml: block.custom_html ? sanitizeCustomHtml(block.custom_html) : undefined,
  }));

  return (
    <>
      <h1 className={`${styles.title} text-3xl font-bold lg:text-3xl`}>{data.title}</h1>
      <WebpImage article={data} />
      <DoubleDate article={data} articleMode={true} />
      <AdAlert />
      {introductionBlocks.map(({ block, richTextHtml, customHtml }, index) => (
        <div className="mt-10" key={index}>
          {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
          {richTextHtml && <RichText html={richTextHtml} />}
          {customHtml && <CustomHtml html={customHtml} />}
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
      {contentBlocks.map(({ block, richTextHtml, customHtml }, index) => {
        return (
          <div key={index} className="mt-5">
            {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
            {richTextHtml && <RichText html={richTextHtml} adSlots={contentBlockAdSlots[index]} />}
            {customHtml && <CustomHtml html={customHtml} />}
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
