import type { MicroCMSImage } from 'microcms-js-sdk';
import styles from './index.module.css';
import { formatMicroCmsImageUrl } from '@/utils/formatMicroCmsImageUrl';

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
  const imageUrl = formatMicroCmsImageUrl(article.thumbnail.url, {
    width,
    height,
    quality: 60,
    fit: 'crop',
  });
  const imageUrl2x = formatMicroCmsImageUrl(article.thumbnail.url, {
    width,
    height,
    quality: 60,
    fit: 'crop',
    devicePixelRatio: 2,
  });
  const srcSet = `${imageUrl} 1x, ${imageUrl2x} 2x`;

  return (
    <picture>
      <source type="image/webp" media="(max-width: 640px)" srcSet={srcSet} />
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
