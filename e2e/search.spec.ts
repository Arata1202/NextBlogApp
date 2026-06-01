import { expect, test } from './support/app';

test.describe('search', () => {
  test('fetches query results and paginates through the mocked search API', async ({ page }) => {
    await page.goto('/search?q=Playwright');

    await expect(
      page.getByRole('heading', { level: 1, name: '「Playwright」の検索結果' }),
    ).toBeVisible();
    await expect(page.locator('a[href="/articles/e2e-article-1"]').first()).toBeVisible();

    await page.getByRole('link', { name: '2ページ目へ移動' }).click();

    await expect(page).toHaveURL(/\/search\?q=Playwright&page=2$/);
    await expect(page.locator('a[href="/articles/e2e-article-11"]').first()).toBeVisible();
  });

  test('shows an empty result state without calling external services', async ({ page }) => {
    await page.goto('/search?q=no-match-keyword');

    await expect(
      page.getByRole('heading', { level: 1, name: '「no-match-keyword」の検索結果' }),
    ).toBeVisible();
    await expect(page.getByText('記事はまだありません')).toBeVisible();
  });
});
