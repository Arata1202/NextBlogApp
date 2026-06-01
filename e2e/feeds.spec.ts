import { expect, test } from './support/app';

test.describe('generated feeds', () => {
  test('serves RSS with fixture articles', async ({ request }) => {
    const response = await request.get('/rss.xml');
    const body = await response.text();

    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(/application\/(rss\+xml|xml)/);
    expect(body).toContain('<rss');
    expect(body).toContain('E2E Playwright 導入ガイド 01');
  });

  test('serves sitemap XML with fixed and article URLs', async ({ request, baseURL }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/xml');
    expect(body).toContain(`${baseURL}/profile`);
    expect(body).toContain(`${baseURL}/articles/e2e-article-1`);
  });
});
