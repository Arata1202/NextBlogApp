import { SAFE_RESOURCE_PROTOCOLS } from '@/utils/urlSafety';

const EASY_LINK_ARROW_SELECTOR = '.easyLink-arrow-left, .easyLink-arrow-right';

type MoshimoEasyLinkState = {
  arrow: HTMLAnchorElement;
  images: HTMLImageElement[];
  activeIndex: number;
};

export const syncMoshimoEasyLinkArrows = (content: HTMLElement) => {
  content.querySelectorAll<HTMLAnchorElement>(EASY_LINK_ARROW_SELECTOR).forEach((arrow) => {
    arrow.setAttribute('role', 'button');

    if (!arrow.getAttribute('aria-label')) {
      arrow.setAttribute(
        'aria-label',
        arrow.classList.contains('easyLink-arrow-left') ? '前の画像を表示' : '次の画像を表示',
      );
    }
  });
};

const getMoshimoEasyLinkImageBox = (arrow: HTMLAnchorElement) => {
  const imageBox = arrow.closest('.easyLink-img-box');

  if (imageBox) {
    return imageBox;
  }

  const imageArea = arrow.closest('.easyLink-img') ?? arrow.closest('.easyLink-box');

  return imageArea?.querySelector('.easyLink-img-box') ?? imageArea;
};

const getMoshimoEasyLinkImages = (arrow: HTMLAnchorElement) => {
  const imageBox = getMoshimoEasyLinkImageBox(arrow);

  if (!imageBox) {
    return [];
  }

  const images = imageBox.querySelectorAll<HTMLImageElement>(
    'img.easyLink-img-pht, img.js-item-image, img[data-img_src]',
  );

  return Array.from(new Set(images));
};

const isVisibleMoshimoImage = (image: HTMLImageElement) => {
  return (
    image.style.display !== 'none' &&
    !image.hidden &&
    !image.closest('[hidden]') &&
    window.getComputedStyle(image).display !== 'none'
  );
};

const getMoshimoEasyLinkImageContainer = (image: HTMLImageElement) => {
  if (
    image.parentElement instanceof HTMLElement &&
    image.parentElement.tagName.toLowerCase() === 'span'
  ) {
    return image.parentElement;
  }

  return image;
};

const getActiveMoshimoEasyLinkImageIndex = (images: HTMLImageElement[]) => {
  const activeClassIndex = images.findIndex((image) => {
    return image.classList.contains('easyLink-img-pht');
  });

  if (activeClassIndex !== -1) {
    return activeClassIndex;
  }

  return Math.max(images.findIndex(isVisibleMoshimoImage), 0);
};

const getMoshimoEasyLinkState = (arrow: HTMLAnchorElement): MoshimoEasyLinkState => {
  const images = getMoshimoEasyLinkImages(arrow);

  return {
    arrow,
    images,
    activeIndex: getActiveMoshimoEasyLinkImageIndex(images),
  };
};

const didMoshimoEasyLinkMove = (state: MoshimoEasyLinkState) => {
  const currentImages = getMoshimoEasyLinkImages(state.arrow);

  if (currentImages.length !== state.images.length) {
    return true;
  }

  return getActiveMoshimoEasyLinkImageIndex(currentImages) !== state.activeIndex;
};

const showMoshimoEasyLinkImage = (images: HTMLImageElement[], activeIndex: number) => {
  images.forEach((image, index) => {
    const isActive = index === activeIndex;
    const container = getMoshimoEasyLinkImageContainer(image);

    image.classList.remove(
      'msm_left_slideOut',
      'msm_left_slideIn',
      'msm_right_slideOut',
      'msm_right_slideIn',
    );
    image.classList.add('js-item-image');

    if (isActive) {
      const imageSrc = image.getAttribute('data-img_src');

      if (imageSrc) {
        try {
          const parsedUrl = new URL(imageSrc, window.location.href);

          if (SAFE_RESOURCE_PROTOCOLS.has(parsedUrl.protocol)) {
            image.src = parsedUrl.href;
          }
        } catch {
          // Keep unsafe or malformed lazy image URLs unloaded.
        }

        image.removeAttribute('data-img_src');
      }

      image.classList.add('easyLink-img-pht');
      image.style.display = 'unset';
      container.classList.remove('waiting');
    } else {
      image.classList.remove('easyLink-img-pht');
      image.style.display = 'none';
    }

    container.setAttribute('aria-hidden', String(!isActive));
  });
};

const moveMoshimoEasyLinkImage = (arrow: HTMLAnchorElement) => {
  const images = getMoshimoEasyLinkImages(arrow);

  if (images.length <= 1) {
    return false;
  }

  const currentIndex = getActiveMoshimoEasyLinkImageIndex(images);
  const direction = arrow.classList.contains('easyLink-arrow-left') ? -1 : 1;
  const nextIndex = (currentIndex + direction + images.length) % images.length;

  showMoshimoEasyLinkImage(images, nextIndex);

  return true;
};

const getMoshimoEasyLinkArrow = (content: HTMLElement, target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null;
  }

  const arrow = target.closest<HTMLAnchorElement>(EASY_LINK_ARROW_SELECTOR);

  if (!arrow || !content.contains(arrow)) {
    return null;
  }

  return arrow;
};

export const setupMoshimoEasyLinkFallback = (content: HTMLElement) => {
  const handleContentClickCapture = (event: MouseEvent) => {
    const arrow = getMoshimoEasyLinkArrow(content, event.target);

    if (!arrow) {
      return;
    }

    const startState = getMoshimoEasyLinkState(arrow);

    event.preventDefault();

    window.setTimeout(() => {
      if (content.contains(arrow) && !didMoshimoEasyLinkMove(startState)) {
        moveMoshimoEasyLinkImage(arrow);
      }
    }, 0);
  };

  const handleContentKeyDown = (event: KeyboardEvent) => {
    if (event.key !== ' ' && event.key !== 'Spacebar' && event.key !== 'Enter') {
      return;
    }

    const arrow = getMoshimoEasyLinkArrow(content, event.target);

    if (!arrow) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    moveMoshimoEasyLinkImage(arrow);
  };

  content.addEventListener('click', handleContentClickCapture, true);
  content.addEventListener('keydown', handleContentKeyDown);

  return () => {
    content.removeEventListener('click', handleContentClickCapture, true);
    content.removeEventListener('keydown', handleContentKeyDown);
  };
};
