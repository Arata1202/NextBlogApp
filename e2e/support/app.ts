import { expect, test as base } from '@playwright/test';
import { getArticles } from '../fixtures/content.mjs';

const e2eArticles = getArticles();
const expectedNotFoundPaths = new Set(['/missing-e2e-page']);

const searchArticles = (query: string, limit: number, offset: number) => {
  const normalizedQuery = query.toLowerCase();
  const matches = e2eArticles.filter((article) => {
    const searchableText = `${article.title} ${article.description}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });

  return {
    contents: matches.slice(offset, offset + limit),
    totalCount: matches.length,
  };
};

const recaptchaApiScript = `
(() => {
  const params = new URL(document.currentScript.src).searchParams;
  const onload = params.get('onload');
  window.grecaptcha = {
    render(container, options = {}) {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'reCAPTCHA E2E';
      button.setAttribute('aria-label', 'reCAPTCHAを完了');
      button.addEventListener('click', () => {
        if (typeof options.callback === 'function') {
          options.callback('e2e-recaptcha-token');
        }
      });
      element?.appendChild(button);
      return 1;
    },
    reset() {},
    getResponse() {
      return 'e2e-recaptcha-token';
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

    page.on('response', (response) => {
      const status = response.status();
      if (status < 400) {
        return;
      }

      const url = new URL(response.url());
      if (baseOrigin && url.origin !== baseOrigin) {
        return;
      }

      if (expectedNotFoundPaths.has(url.pathname)) {
        return;
      }

      unexpectedErrors.push(`${status} ${url.pathname}`);
    });

    await page.route('**/api/search?**', async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q') ?? '';
      const limit = Number(url.searchParams.get('limit') ?? 10);
      const offset = Number(url.searchParams.get('offset') ?? 0);

      await route.fulfill({
        contentType: 'application/json',
        json: searchArticles(query, limit, offset),
      });
    });

    await page.route('**/api/sendemail', async (route) => {
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
