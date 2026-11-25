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

const collectIframelyHtml = (container: HTMLElement, html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  const originals = template.content.querySelectorAll(IFRAMELY_SELECTOR);
  const snapshots = new WeakMap<Element, string>();
  container.querySelectorAll(IFRAMELY_SELECTOR).forEach((element, index) => {
    if (originals[index]) snapshots.set(element, originals[index].innerHTML);
  });
  return snapshots;
};

const restoreBrokenIframelyEmbeds = (
  container: HTMLElement,
  snapshots: WeakMap<Element, string>,
) => {
  const embeds = Array.from(container.querySelectorAll<HTMLElement>(IFRAMELY_SELECTOR));

  embeds.forEach((embed) => {
    if (embed.querySelector('iframe') || embed.querySelector('[data-iframely-url]')) {
      return;
    }

    const snapshot = snapshots.get(embed);

    if (snapshot) {
      embed.innerHTML = snapshot;
    }
  });
};

const loadIframelyScript = () => {
  if (window.iframely || window.iframelyScriptLoading) {
    return;
  }

  if (document.querySelector('script[data-iframely-loader]')) {
    return;
  }

  window.iframelyScriptLoading = true;

  const script = document.createElement('script');
  script.src = IFRAMELY_SCRIPT_SRC;
  script.dataset.iframelyLoader = 'true';
  script.async = true;
  script.onload = () => {
    window.iframelyScriptLoading = false;
  };
  script.onerror = () => {
    script.remove();
    window.iframelyScriptLoading = false;
  };
  document.body.appendChild(script);
};

export const useIframelyEmbeds = (ref: RefObject<HTMLElement | null>, html: string) => {
  useEffect(() => {
    const container = ref.current;

    if (!container || !hasIframelyEmbed(html)) {
      return;
    }

    const snapshots = collectIframelyHtml(container, html);
    let timer: number | undefined;
    const runIframelyLoad = (retries = IFRAMELY_LOAD_MAX_RETRIES) => {
      if (window.iframely?.load) {
        window.iframely.load();
        return;
      }

      if (retries <= 0) {
        return;
      }

      loadIframelyScript();
      timer = window.setTimeout(() => runIframelyLoad(retries - 1), IFRAMELY_LOAD_RETRY_MS);
    };

    const scheduleLoad = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        restoreBrokenIframelyEmbeds(container, snapshots);

        if (container.querySelector('.iframely-embed, [data-iframely-url]')) {
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
