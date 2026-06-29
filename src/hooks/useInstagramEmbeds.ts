import { RefObject, useEffect } from 'react';

const INSTAGRAM_SELECTOR = '.instagram-media';
const INSTAGRAM_SCRIPT_SRC = 'https://www.instagram.com/embed.js';
const INSTAGRAM_RELOAD_DELAY_MS = 100;
const INSTAGRAM_LOAD_RETRY_MS = 250;
const INSTAGRAM_LOAD_MAX_RETRIES = 12;

type InstagramApi = {
  Embeds?: {
    process?: () => void;
  };
};

declare global {
  interface Window {
    instgrm?: InstagramApi;
    instagramScriptLoading?: boolean;
  }
}

const hasInstagramEmbed = (html: string) => {
  return (
    html.includes('instagram-media') ||
    html.includes('instagram.com/p/') ||
    html.includes('instagram.com/reel/') ||
    html.includes('instagram.com/tv/')
  );
};

const loadInstagramScript = () => {
  if (window.instgrm || window.instagramScriptLoading) {
    return;
  }

  if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
    return;
  }

  window.instagramScriptLoading = true;

  const script = document.createElement('script');
  script.src = INSTAGRAM_SCRIPT_SRC;
  script.async = true;
  script.onload = () => {
    window.instagramScriptLoading = false;
    window.instgrm?.Embeds?.process?.();
  };
  script.onerror = () => {
    window.instagramScriptLoading = false;
  };
  document.body.appendChild(script);
};

const runInstagramProcess = (retries = INSTAGRAM_LOAD_MAX_RETRIES) => {
  if (window.instgrm?.Embeds?.process) {
    window.instgrm.Embeds.process();
    return;
  }

  if (retries <= 0) {
    return;
  }

  loadInstagramScript();
  window.setTimeout(() => runInstagramProcess(retries - 1), INSTAGRAM_LOAD_RETRY_MS);
};

export const useInstagramEmbeds = (ref: RefObject<HTMLElement | null>, html: string) => {
  useEffect(() => {
    const container = ref.current;

    if (!container || !hasInstagramEmbed(html)) {
      return;
    }

    let timer: number | undefined;

    const scheduleLoad = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (container.querySelector(INSTAGRAM_SELECTOR)) {
          runInstagramProcess();
        }
      }, INSTAGRAM_RELOAD_DELAY_MS);
    };

    const observer = new MutationObserver(scheduleLoad);
    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    scheduleLoad();

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [html, ref]);
};
