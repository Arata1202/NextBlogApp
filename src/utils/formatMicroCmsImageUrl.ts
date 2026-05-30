const MICROCMS_IMAGE_HOST = 'images.microcms-assets.io';

export const isMicroCmsImageUrl = (src: string) => {
  try {
    return new URL(src).hostname === MICROCMS_IMAGE_HOST;
  } catch {
    return false;
  }
};

export const formatMicroCmsImageUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'clip' | 'crop';
    devicePixelRatio?: number;
  } = {},
) => {
  try {
    const url = new URL(src);

    if (!isMicroCmsImageUrl(src)) {
      return src;
    }

    url.searchParams.set('fm', 'webp');
    url.searchParams.set('q', String(options.quality ?? 70));
    url.searchParams.set('fit', options.fit ?? 'clip');

    if (options.width) {
      url.searchParams.set('w', String(options.width));
    }

    if (options.height) {
      url.searchParams.set('h', String(options.height));
    }

    if (options.devicePixelRatio) {
      url.searchParams.set('dpr', String(options.devicePixelRatio));
    }

    return url.toString();
  } catch {
    return src;
  }
};
