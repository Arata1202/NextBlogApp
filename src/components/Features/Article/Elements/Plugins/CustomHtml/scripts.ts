import { CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE } from '@/constants/customHtml';

const CUSTOM_HTML_SELECTOR = '[data-custom-html]';
const EXECUTED_SCRIPT_ATTRIBUTE = 'data-custom-html-executed';
const MOSHIMO_SCRIPT_ID = 'msmaflink';
const MOSHIMO_SCRIPT_KEYWORD = 'MoshimoAffiliateEasyLink';
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

const isMoshimoScript = (script: HTMLScriptElement) => {
  return (
    script.textContent?.includes(MOSHIMO_SCRIPT_ID) ||
    script.textContent?.includes(MOSHIMO_SCRIPT_KEYWORD) ||
    script.src.includes('dn.msmstatic.com/site/cardlink/bundle.js')
  );
};

const hasMoshimoEasyLink = (html: string) => {
  return html.includes(MOSHIMO_SCRIPT_ID) || html.includes(MOSHIMO_SCRIPT_KEYWORD);
};

const extractMoshimoPayload = (scriptContent: string) => {
  const callStart = scriptContent.indexOf('msmaflink({');

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
          return JSON.parse(scriptContent.slice(objectStart, index + 1));
        } catch (error) {
          console.error('Failed to parse Moshimo EasyLink payload.', error);
          return null;
        }
      }
    }
  }

  return null;
};

const replaceWithExecutableScript = (script: HTMLScriptElement, src?: string) => {
  const parent = script.parentNode;

  if (!parent) {
    return null;
  }

  const executableScript = document.createElement('script');

  Array.from(script.attributes).forEach((attribute) => {
    if (
      attribute.name === CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE ||
      (src && attribute.name.toLowerCase() === 'type')
    ) {
      return;
    }

    executableScript.setAttribute(attribute.name, attribute.value);
  });

  if (src) {
    executableScript.src = src;
  }

  if (src || executableScript.src) {
    executableScript.async = false;
  }

  if (!src) {
    executableScript.text = script.textContent ?? '';
  }
  const marker = document.createTextNode('');

  parent.insertBefore(marker, script);
  script.remove();
  parent.insertBefore(executableScript, marker);
  marker.remove();

  return executableScript;
};

const runGenericScripts = (content: HTMLElement) => {
  const scripts = content.querySelectorAll('script');

  scripts.forEach((script) => {
    const scriptSrc = script.getAttribute(CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE) ?? script.src;

    if (isMoshimoScript(script) || script.dataset.customHtmlExecuted === 'true' || !scriptSrc) {
      return;
    }

    const executableScript = replaceWithExecutableScript(script, scriptSrc);
    executableScript?.setAttribute(EXECUTED_SCRIPT_ATTRIBUTE, 'true');
  });
};

const resetMoshimoEasyLink = () => {
  document.getElementById(MOSHIMO_SCRIPT_ID)?.remove();
  window.MoshimoAffiliateObject = undefined;
  window.msmaflink = undefined;
  delete window.MoshimoAffiliateObject;
  delete window.msmaflink;
};

const collectMoshimoQueue = () => {
  return Array.from(document.querySelectorAll<HTMLScriptElement>(`${CUSTOM_HTML_SELECTOR} script`))
    .filter(isMoshimoScript)
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

const loadMoshimoBundle = () => {
  const bundleScript = document.createElement('script');

  bundleScript.id = MOSHIMO_SCRIPT_ID;
  bundleScript.src = MOSHIMO_SCRIPT_SRC;
  bundleScript.async = true;
  bundleScript.addEventListener('load', () => {
    // Moshimo renders from its load handler, which has already passed after SPA navigation.
    window.dispatchEvent(new Event('load'));
  });
  document.body.appendChild(bundleScript);
};

const runMoshimoEasyLinks = () => {
  const queue = collectMoshimoQueue();

  if (queue.length === 0) {
    return;
  }

  resetMoshimoEasyLink();
  window.MoshimoAffiliateObject = MOSHIMO_SCRIPT_ID;
  window.msmaflink = createMoshimoAffiliateQueue(queue);
  loadMoshimoBundle();
};

const scheduleMoshimoEasyLinks = () => {
  window.clearTimeout(window.moshimoEasyLinkTimer);
  window.moshimoEasyLinkTimer = window.setTimeout(runMoshimoEasyLinks, MOSHIMO_RENDER_DELAY_MS);
};

export const runCustomHtmlScripts = (content: HTMLElement, html: string) => {
  runGenericScripts(content);

  if (hasMoshimoEasyLink(html)) {
    scheduleMoshimoEasyLinks();
  }
};
