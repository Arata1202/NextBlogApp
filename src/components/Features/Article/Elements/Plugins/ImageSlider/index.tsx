'use client';

import Slider from 'react-slick';
import { ContentBlock, IntroductionBlock } from '@/types/microcms';
import { useIsClient } from '@/hooks/useIsClient';
import styles from './index.module.css';

type Props = {
  block: ContentBlock | IntroductionBlock;
  imageAltFallback?: string;
};

export default function ImageSlider({ block, imageAltFallback }: Props) {
  const isClient = useIsClient();
  const images = block.image_slider?.filter((image) => image.url) ?? [];

  if (images.length === 0) {
    return null;
  }

  const isMultiple = images.length > 1;
  const getAlt = (index: number) => {
    if (!imageAltFallback) {
      return '';
    }

    return images.length === 1
      ? `${imageAltFallback}の画像`
      : `${imageAltFallback}の画像 ${index + 1}`;
  };
  const renderImage = (image: (typeof images)[number], index: number) => (
    <img
      src={`${image.url}?fm=webp&q=70&fit=clip&w=960`}
      srcSet={`${image.url}?fm=webp&q=70&fit=clip&w=640 640w, ${image.url}?fm=webp&q=70&fit=clip&w=960 960w, ${image.url}?fm=webp&q=70&fit=clip&w=1200 1200w`}
      sizes="(max-width: 768px) 100vw, 960px"
      alt={getAlt(index)}
      width={image.width}
      height={image.height}
      loading={index === 0 ? 'eager' : 'lazy'}
      className={styles.image}
    />
  );

  if (!isMultiple || !isClient) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.slide}>{renderImage(images[0], 0)}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Slider
        dots={isMultiple}
        arrows={isMultiple}
        infinite={isMultiple}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        variableWidth={false}
        centerMode={false}
        autoplay={false}
        adaptiveHeight
        className={styles.slider}
      >
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className={styles.slide}>
            {renderImage(image, index)}
          </div>
        ))}
      </Slider>
    </div>
  );
}
