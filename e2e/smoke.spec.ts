import { expect, test } from './support/app';

const fixedPages = [
  { path: '/', heading: '最新記事' },
  { path: '/profile', heading: 'プロフィール' },
  { path: '/privacy', heading: 'プライバシーポリシー' },
  { path: '/disclaimer', heading: '免責事項' },
  { path: '/copyright', heading: '著作権' },
  { path: '/link', heading: 'リンク' },
  { path: '/sitemap-html', heading: 'サイトマップ' },
];

test.describe('static pages', () => {
  for (const { path, heading } of fixedPages) {
    test(`${path} renders`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.ok()).toBe(true);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    });
  }

  test('unknown routes render the static 404 page', async ({ page }) => {
    const response = await page.goto('/missing-e2e-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByText('ページが見つかりませんでした')).toBeVisible();
  });
});
