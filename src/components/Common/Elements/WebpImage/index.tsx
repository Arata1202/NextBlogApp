import type { MicroCMSImage } from 'microcms-js-sdk';
import styles from './index.module.css';
import { formatMicroCmsImageUrl, isMicroCmsImageUrl } from '@/utils/formatMicroCmsImageUrl';

type Props = {
  article: {
    title: string;
    thumbnail?: MicroCMSImage;
  };
  card?: boolean;
  recent?: boolean;
  priority?: boolean;
};

export default function WebpImage({
  article,
  card = false,
  recent = false,
  priority = false,
}: Props) {
  if (!article.thumbnail?.url) {
    return null;
  }

  const alt = card || recent ? '' : article.title;
  const width = card ? 300 : 960;
  const height = card ? 158 : 504;
  const thumbnailUrl = article.thumbnail.url;
  const imageOptions = { width, height, quality: 60, fit: 'crop' } as const;
  const imageUrl = formatMicroCmsImageUrl(thumbnailUrl, imageOptions);
  const imageUrl2x = formatMicroCmsImageUrl(thumbnailUrl, { ...imageOptions, devicePixelRatio: 2 });
  const mobileCardSrcSet =
    card && isMicroCmsImageUrl(thumbnailUrl)
      ? [320, 480, 640, 800, 960, 1280]
          .map((candidateWidth) => {
            const url = formatMicroCmsImageUrl(thumbnailUrl, {
              ...imageOptions,
              width: candidateWidth,
              height: Math.round((candidateWidth * height) / width),
              devicePixelRatio: 1,
            });
            return `${url} ${candidateWidth}w`;
          })
          .join(', ')
      : undefined;
  const srcSet = `${imageUrl} 1x, ${imageUrl2x} 2x`;
  const pictureClassName =
    (card && styles.cardPicture) || (recent && styles.recentPicture) || undefined;

  return (
    <picture className={pictureClassName}>
      {mobileCardSrcSet && (
        <source
          type="image/webp"
          media="(max-width: 640px)"
          sizes="100vw"
          srcSet={mobileCardSrcSet}
        />
      )}
      <source type="image/webp" srcSet={srcSet} />
      <img
        src={imageUrl}
        alt={alt}
        className={(card && styles.image) || (recent && styles.recent) || styles.thumbnail}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
