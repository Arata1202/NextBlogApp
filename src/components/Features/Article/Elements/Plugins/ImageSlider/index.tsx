'use client';

import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { ContentBlock, IntroductionBlock } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  block: ContentBlock | IntroductionBlock;
};

export default function ImageSlider({ block }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const images = block.image_slider?.filter((image) => image.url) ?? [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (images.length === 0) {
    return null;
  }

  const isMultiple = images.length > 1;
  const renderImage = (image: (typeof images)[number], index: number) => (
    <img
      src={`${image.url}?fm=webp&q=70&fit=clip&w=960`}
      srcSet={`${image.url}?fm=webp&q=70&fit=clip&w=640 640w, ${image.url}?fm=webp&q=70&fit=clip&w=960 960w, ${image.url}?fm=webp&q=70&fit=clip&w=1200 1200w`}
      sizes="(max-width: 768px) 100vw, 960px"
      alt={`スライダー画像 ${index + 1}`}
      width={image.width}
      height={image.height}
      loading={index === 0 ? 'eager' : 'lazy'}
      className={styles.image}
    />
  );

  if (!isMultiple || !isMounted) {
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
        autoplay={isMultiple}
        autoplaySpeed={4500}
        pauseOnHover
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
