import { expect, test as base } from '@playwright/test';
import { searchURL, contactURL } from '../../scripts/e2e/config';
import { getArticles } from '../fixtures/content.mjs';

const e2eArticles = getArticles();
const expectedNotFoundPaths = new Set(['/missing-e2e-page']);

const searchArticles = (query: string, limit: number, offset: number) => {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = e2eArticles.filter((article) => {
    const searchableText = `${article.title} ${article.description}`.toLowerCase();
    return !!normalizedQuery && searchableText.includes(normalizedQuery);
  });

  return {
    contents: matches.slice(offset, offset + limit),
    totalCount: matches.length,
    limit,
    offset,
  };
};

const recaptchaApiScript = `
(() => {
  const params = new URL(document.currentScript.src).searchParams;
  const onload = params.get('onload');
  let token = "";
  window.grecaptcha = {
    render(container, options = {}) {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'reCAPTCHA E2E';
      button.setAttribute('aria-label', 'reCAPTCHAを完了');
      button.addEventListener('click', () => {
        token = 'e2e-recaptcha-token';
        if (typeof options.callback === 'function') {
          options.callback(token);
        }
      });
      element?.appendChild(button);
      return 1;
    },
    reset() { token = ""; },
    getResponse() {
      return token;
    }
  };
  if (onload && typeof window[onload] === 'function') {
    setTimeout(() => window[onload](), 0);
  }
})();
`;

export const test = base.extend({
  page: async ({ baseURL, page }, continueTest) => {
    const unexpectedErrors: string[] = [];
    const baseOrigin = baseURL ? new URL(baseURL).origin : undefined;

    page.on('pageerror', (error) => {
      unexpectedErrors.push(error.message);
    });

    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
        unexpectedErrors.push(message.text());
      }
    });

    page.on('requestfailed', (request) => {
      const reason = request.failure()?.errorText;
      const url = new URL(request.url());
      if (url.origin === baseOrigin && reason !== 'net::ERR_ABORTED') {
        unexpectedErrors.push(`${reason} ${url.pathname}`);
      }
    });

    page.on('response', (response) => {
      const status = response.status();
      if (status < 400) {
        return;
      }

      const url = new URL(response.url());
      if (baseOrigin && url.origin !== baseOrigin) {
        return;
      }

      if (status === 404 && expectedNotFoundPaths.has(url.pathname)) {
        return;
      }

      unexpectedErrors.push(`${status} ${url.pathname}`);
    });

    const endpoint = (configured: string) => {
      const target = new URL(configured, baseURL);
      return (url: URL) => url.origin === target.origin && url.pathname === target.pathname;
    };
    await page.route(endpoint(searchURL), async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q') ?? '';
      const integer = (name: string, fallback: number, min: number, max: number) => {
        const raw = url.searchParams.get(name) ?? '';
        return /^[+-]?\d+$/.test(raw) ? Math.min(max, Math.max(min, Number(raw))) : fallback;
      };
      const limit = integer('limit', 10, 1, 50);
      const offset = integer('offset', 0, 0, 10000);

      await route.fulfill({
        contentType: 'application/json',
        json: searchArticles(query, limit, offset),
      });
    });

    await page.route(endpoint(contactURL), async (route) => {
      const body = route.request().postDataJSON();
      if (
        route.request().method() !== 'POST' ||
        !body?.message ||
        !body?.email ||
        !body?.title ||
        !body?.['g-recaptcha-response']
      ) {
        await route.fulfill({ status: 400, json: { success: false } });
        return;
      }
      await route.fulfill({
        contentType: 'application/json',
        json: { success: true },
      });
    });

    await page.route(
      /https:\/\/(?:www\.)?(?:google\.com|recaptcha\.net)\/recaptcha\/api\.js.*/,
      async (route) => {
        await route.fulfill({
          contentType: 'text/javascript; charset=utf-8',
          body: recaptchaApiScript,
        });
      },
    );

    await page.route(/https:\/\/www\.gstatic\.com\/recaptcha\/.*/, async (route) => {
      await route.fulfill({
        contentType: 'text/javascript; charset=utf-8',
        body: '',
      });
    });

    await continueTest(page);

    expect(unexpectedErrors).toEqual([]);
  },
});

export { expect };
