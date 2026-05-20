import { RefObject, useEffect } from 'react';

const IFRAMELY_SELECTOR = '.iframely-embed';
const IFRAMELY_SCRIPT_SRC = 'https://cdn.iframe.ly/embed.js';
const IFRAMELY_RELOAD_DELAY_MS = 100;
const IFRAMELY_LOAD_RETRY_MS = 250;
const IFRAMELY_LOAD_MAX_RETRIES = 12;

type IframelyApi = {
  load: () => void;
};

declare global {
  interface Window {
    iframely?: IframelyApi;
    iframelyScriptLoading?: boolean;
  }
}

const hasIframelyEmbed = (html: string) => {
  return html.includes('iframely-embed') || html.includes('data-iframely-url');
};

const collectIframelyHtml = (html: string) => {
  const template = document.createElement('div');
  template.innerHTML = html;
  return Array.from(template.querySelectorAll(IFRAMELY_SELECTOR)).map((embed) => embed.outerHTML);
};

const restoreBrokenIframelyEmbeds = (container: HTMLElement, snapshots: string[]) => {
  const embeds = Array.from(container.querySelectorAll<HTMLElement>(IFRAMELY_SELECTOR));

  embeds.forEach((embed, index) => {
    if (embed.querySelector('iframe') || embed.querySelector('[data-iframely-url]')) {
      return;
    }

    const snapshot = snapshots[index];

    if (snapshot) {
      embed.outerHTML = snapshot;
    }
  });
};

const loadIframelyScript = () => {
  if (window.iframely || window.iframelyScriptLoading) {
    return;
  }

  if (document.querySelector('script[src*="cdn.iframe.ly/embed.js"]')) {
    return;
  }

  window.iframelyScriptLoading = true;

  const script = document.createElement('script');
  script.src = IFRAMELY_SCRIPT_SRC;
  script.async = true;
  script.onload = () => {
    window.iframelyScriptLoading = false;
  };
  script.onerror = () => {
    window.iframelyScriptLoading = false;
  };
  document.body.appendChild(script);
};

const runIframelyLoad = (retries = IFRAMELY_LOAD_MAX_RETRIES) => {
  if (window.iframely?.load) {
    window.iframely.load();
    return;
  }

  if (retries <= 0) {
    return;
  }

  loadIframelyScript();
  window.setTimeout(() => runIframelyLoad(retries - 1), IFRAMELY_LOAD_RETRY_MS);
};

export const useIframelyEmbeds = (ref: RefObject<HTMLElement | null>, html: string) => {
  useEffect(() => {
    const container = ref.current;

    if (!container || !hasIframelyEmbed(html)) {
      return;
    }

    const snapshots = collectIframelyHtml(html);
    let timer: number | undefined;

    const scheduleLoad = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        restoreBrokenIframelyEmbeds(container, snapshots);

        if (container.querySelector(IFRAMELY_SELECTOR)) {
          runIframelyLoad();
        }
      }, IFRAMELY_RELOAD_DELAY_MS);
    };

    const themeObserver = new MutationObserver(scheduleLoad);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    scheduleLoad();

    return () => {
      window.clearTimeout(timer);
      themeObserver.disconnect();
    };
  }, [html, ref]);
};
