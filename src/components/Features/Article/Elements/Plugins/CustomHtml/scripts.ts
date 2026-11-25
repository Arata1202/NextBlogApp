import { hasSafeUrlProtocol, SAFE_RESOURCE_PROTOCOLS } from '@/utils/urlSafety';
import { CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE } from '@/constants/customHtml';

const CUSTOM_HTML_SELECTOR = '[data-custom-html]';
const MOSHIMO_SCRIPT_ID = 'msmaflink';
const MOSHIMO_SCRIPT_SRC = 'https://dn.msmstatic.com/site/cardlink/bundle.js?20220329';
const MOSHIMO_RENDER_DELAY_MS = 200;

type MoshimoQueueItem = unknown[] & {
  currentScript?: HTMLScriptElement;
};

type MoshimoAffiliateFunction = ((...args: unknown[]) => void) & {
  q?: MoshimoQueueItem[];
};

declare global {
  interface Window {
    MoshimoAffiliateObject?: string;
    msmaflink?: MoshimoAffiliateFunction;
    moshimoEasyLinkTimer?: number;
  }
}

const isMoshimoScript = (script: HTMLScriptElement) =>
  script.hasAttribute(CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE);

// Without an affiliate ID the vendor copies u_url directly to anchor.href.
const hasSafeButtonUrls = (buttons: unknown) => {
  if (buttons === undefined) return true;
  if (!buttons || typeof buttons !== 'object') return false;
  return Object.values(buttons).every((button: unknown) => {
    if (!button || typeof button !== 'object') return false;
    if (!('u_url' in button)) return true;
    return (
      typeof button.u_url === 'string' && hasSafeUrlProtocol(button.u_url, SAFE_RESOURCE_PROTOCOLS)
    );
  });
};

const extractMoshimoPayload = (scriptContent: string) => {
  const callStart = scriptContent.search(/\bmsmaflink\s*\(\s*\{/);

  if (callStart === -1) {
    return null;
  }

  const objectStart = scriptContent.indexOf('{', callStart);
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = objectStart; index < scriptContent.length; index += 1) {
    const char = scriptContent[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;

      if (depth === 0) {
        try {
          const payload = JSON.parse(scriptContent.slice(objectStart, index + 1));
          return hasSafeButtonUrls(payload.b_l) ? payload : null;
        } catch (error) {
          console.error('Failed to parse Moshimo EasyLink payload.', error);
          return null;
        }
      }
    }
  }

  return null;
};

const renderedMoshimoScripts = new WeakSet<HTMLScriptElement>();

const collectMoshimoQueue = () => {
  return Array.from(document.querySelectorAll<HTMLScriptElement>(`${CUSTOM_HTML_SELECTOR} script`))
    .filter((script) => isMoshimoScript(script) && !renderedMoshimoScripts.has(script))
    .map((script) => {
      const payload = extractMoshimoPayload(script.textContent ?? '');

      if (!payload) {
        return null;
      }

      const queueItem = [payload] as MoshimoQueueItem;
      queueItem.currentScript = script;
      return queueItem;
    })
    .filter((item): item is MoshimoQueueItem => item !== null);
};

const createMoshimoAffiliateQueue = (queue: MoshimoQueueItem[]): MoshimoAffiliateFunction => {
  const moshimoAffiliate: MoshimoAffiliateFunction = (...args) => {
    const queueItem = args as MoshimoQueueItem;

    if (document.currentScript instanceof HTMLScriptElement) {
      queueItem.currentScript = document.currentScript;
    }

    moshimoAffiliate.q = moshimoAffiliate.q ?? [];
    moshimoAffiliate.q.push(queueItem);
  };

  moshimoAffiliate.q = queue;
  return moshimoAffiliate;
};

const finishMoshimoRender = () => {
  const queue = window.msmaflink?.q;
  if (!queue) return;
  for (const item of queue) {
    if (item.currentScript) renderedMoshimoScripts.add(item.currentScript);
  }
  queue.length = 0;
};

const renderMoshimoQueue = () => {
  // The vendor only consumes its queue from DOMContentLoaded and window.load listeners.
  if (document.readyState === 'complete') {
    window.dispatchEvent(new Event('load'));
    finishMoshimoRender();
  } else {
    window.addEventListener('load', finishMoshimoRender, { once: true });
  }
};

const runMoshimoEasyLinks = (retryOnFailure = true) => {
  const queue = collectMoshimoQueue();
  if (!queue.length) return;
  window.MoshimoAffiliateObject = MOSHIMO_SCRIPT_ID;
  window.msmaflink = createMoshimoAffiliateQueue(queue);
  const existing = document.getElementById(MOSHIMO_SCRIPT_ID);
  if (existing) {
    if (existing.dataset.loaded === 'true') renderMoshimoQueue();
    return;
  }

  const script = document.createElement('script');
  script.id = MOSHIMO_SCRIPT_ID;
  script.src = MOSHIMO_SCRIPT_SRC;
  script.async = true;
  script.addEventListener(
    'load',
    () => {
      script.dataset.loaded = 'true';
      // The page may have changed during the network request.
      if (window.msmaflink) window.msmaflink.q = collectMoshimoQueue();
      renderMoshimoQueue();
    },
    { once: true },
  );
  script.addEventListener(
    'error',
    () => {
      script.remove();
      if (retryOnFailure) {
        window.clearTimeout(window.moshimoEasyLinkTimer);
        window.moshimoEasyLinkTimer = window.setTimeout(() => runMoshimoEasyLinks(false), 1000);
      }
    },
    { once: true },
  );
  document.body.appendChild(script);
};

const scheduleMoshimoEasyLinks = () => {
  window.clearTimeout(window.moshimoEasyLinkTimer);
  window.moshimoEasyLinkTimer = window.setTimeout(runMoshimoEasyLinks, MOSHIMO_RENDER_DELAY_MS);
};

export const runCustomHtmlScripts = (content: HTMLElement) => {
  // Instagram and Iframely have dedicated loaders that also process dynamically mounted embeds.
  if (content.querySelector(`script[${CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE}]`)) {
    scheduleMoshimoEasyLinks();
  }
};
