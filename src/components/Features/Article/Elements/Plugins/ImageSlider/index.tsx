'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Slider, { type CustomArrowProps } from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { ContentBlock, IntroductionBlock } from '@/types/microcms';
import { useIsClient } from '@/hooks/useIsClient';
import styles from './index.module.css';

type Props = {
  block: ContentBlock | IntroductionBlock;
  imageAltFallback?: string;
};

type SliderArrowProps = CustomArrowProps & {
  direction: 'previous' | 'next';
};

function SliderArrow({ className, direction, onClick, style }: SliderArrowProps) {
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
  const directionClassName = direction === 'previous' ? styles.previousArrow : styles.nextArrow;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.detail > 0) {
      event.currentTarget.blur();
    }
  };

  return (
    <button
      type="button"
      className={`${className ?? ''} ${styles.arrow} ${directionClassName}`}
      style={style}
      onClick={handleClick}
      aria-label={direction === 'previous' ? '前の画像を表示' : '次の画像を表示'}
    >
      <Icon className={styles.arrowIcon} aria-hidden="true" />
    </button>
  );
}

export default function ImageSlider({ block, imageAltFallback }: Props) {
  const isClient = useIsClient();
  const sliderRootRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = block.image_slider?.filter((image) => image.url) ?? [];
  const isMultiple = images.length > 1;

  useEffect(() => {
    const sliderRoot = sliderRootRef.current;

    if (!sliderRoot || !isMultiple || !isClient) {
      return;
    }

    const disableGeneratedFocus = () => {
      sliderRoot.querySelectorAll<HTMLElement>('.slick-slide[tabindex]').forEach((slide) => {
        slide.removeAttribute('tabindex');
      });
      sliderRoot.querySelectorAll<HTMLImageElement>(`.${styles.image}`).forEach((image) => {
        image.onclick = null;
      });
    };
    const mutationObserver = new MutationObserver(disableGeneratedFocus);

    disableGeneratedFocus();
    mutationObserver.observe(sliderRoot, {
      attributeFilter: ['tabindex'],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [images.length, isClient, isMultiple]);

  if (images.length === 0) {
    return null;
  }

  const sliderLabel = imageAltFallback ? `${imageAltFallback}の画像スライダー` : '画像スライダー';
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
      tabIndex={-1}
      draggable={false}
    />
  );

  if (!isMultiple || !isClient) {
    return (
      <div ref={sliderRootRef} className={styles.wrapper}>
        <div className={styles.slide}>{renderImage(images[0], 0)}</div>
      </div>
    );
  }

  return (
    <div
      ref={sliderRootRef}
      className={styles.wrapper}
      role="region"
      aria-roledescription="carousel"
      aria-label={sliderLabel}
    >
      <Slider
        dots={isMultiple}
        arrows={isMultiple}
        infinite={isMultiple}
        accessibility
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        variableWidth={false}
        centerMode={false}
        autoplay={false}
        adaptiveHeight
        className={styles.slider}
        prevArrow={<SliderArrow direction="previous" />}
        nextArrow={<SliderArrow direction="next" />}
        afterChange={setCurrentSlide}
        customPaging={(index) => (
          <button
            type="button"
            aria-label={
              index === currentSlide
                ? `${index + 1}枚目の画像を表示中`
                : `${index + 1}枚目の画像を表示`
            }
            aria-current={index === currentSlide ? 'true' : undefined}
          >
            {index + 1}
          </button>
        )}
      >
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1}枚目 / 全${images.length}枚`}
          >
            {renderImage(image, index)}
          </div>
        ))}
      </Slider>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`${currentSlide + 1}枚目 / 全${images.length}枚`}
      </p>
    </div>
  );
}
