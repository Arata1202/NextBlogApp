import { ARTICLE_CONTENT_AD_MARKER } from '@/constants/articleContent';
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
import SponsoredDisclosure from '@/components/Common/SponsoredDisclosure';

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

export default function ArticleFeature({ data, relatedArticles }: Props) {
  const sponsorUrl = data.isSponsored ? data.sponsorUrl : undefined;
  const headings = useExtractHeadings(data.content_blocks);
  const introductionBlocks = data.introduction_blocks.map((block) => ({
    block,
    richTextHtml: block.rich_text
      ? formatRichText(block.rich_text, {
          imageAltFallback: data.title,
          sponsorUrl,
        })
      : undefined,
    customHtml: block.custom_html ? sanitizeCustomHtml(block.custom_html, sponsorUrl) : undefined,
  }));
  const availableSlots = [...ARTICLE_CONTENT_AD_SLOTS];
  const contentBlocks = data.content_blocks.map((block) => {
    const remainingSlots = availableSlots.length;
    const richTextHtml = block.rich_text
      ? formatRichText(block.rich_text, {
          insertAdsBeforeH2: remainingSlots > 0,
          maxAdSlots: remainingSlots,
          imageAltFallback: data.title,
          sponsorUrl,
        })
      : undefined;
    const count =
      remainingSlots && richTextHtml ? richTextHtml.split(ARTICLE_CONTENT_AD_MARKER).length - 1 : 0;
    const adSlots = availableSlots.splice(0, count);
    return {
      block,
      richTextHtml,
      adSlots,
      customHtml: block.custom_html ? sanitizeCustomHtml(block.custom_html, sponsorUrl) : undefined,
    };
  });

  return (
    <>
      <h1 className={styles.title} data-article-title>
        {data.title}
      </h1>
      {data.isSponsored && <SponsoredDisclosure />}
      <WebpImage article={data} priority />
      <DoubleDate article={data} articleMode={true} />
      <AdAlert />
      {introductionBlocks.map(({ block, richTextHtml, customHtml }, index) => (
        <div className="mt-10" key={index}>
          {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
          {richTextHtml && <RichText html={richTextHtml} />}
          {customHtml && <CustomHtml html={customHtml} sponsorUrl={sponsorUrl} />}
          {block.image_slider && block.image_slider.length > 0 && (
            <ImageSlider block={block} imageAltFallback={data.title} />
          )}
          {block.article_link && typeof block.article_link !== 'string' && (
            <WantToRead block={block} />
          )}
          {block.box_merit && <TabBox block={block} variant="merit" sponsorUrl={sponsorUrl} />}
          {block.box_demerit && <TabBox block={block} variant="demerit" sponsorUrl={sponsorUrl} />}
          {block.box_point && <TabBox block={block} variant="point" sponsorUrl={sponsorUrl} />}
          {block.box_common && <TabBox block={block} variant="common" sponsorUrl={sponsorUrl} />}
        </div>
      ))}
      {headings.length > 0 && <TableOfContents headings={headings} />}
      {contentBlocks.map(({ block, richTextHtml, customHtml, adSlots }, index) => {
        return (
          <div key={index} className="mt-5">
            {block.bubble_text && block.bubble_image && <SpeechBubble block={block} />}
            {richTextHtml && <RichText html={richTextHtml} adSlots={adSlots} />}
            {customHtml && <CustomHtml html={customHtml} sponsorUrl={sponsorUrl} />}
            {block.image_slider && block.image_slider.length > 0 && (
              <ImageSlider block={block} imageAltFallback={data.title} />
            )}
            {block.article_link && typeof block.article_link !== 'string' && (
              <WantToRead block={block} />
            )}
            {block.box_merit && <TabBox block={block} variant="merit" sponsorUrl={sponsorUrl} />}
            {block.box_demerit && (
              <TabBox block={block} variant="demerit" sponsorUrl={sponsorUrl} />
            )}
            {block.box_point && <TabBox block={block} variant="point" sponsorUrl={sponsorUrl} />}
            {block.box_common && <TabBox block={block} variant="common" sponsorUrl={sponsorUrl} />}
          </div>
        );
      })}
      <RelatedArticle relatedArticles={relatedArticles} />
    </>
  );
}
