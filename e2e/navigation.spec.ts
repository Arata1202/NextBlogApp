import { expect, test } from './support/app';

test.describe('content navigation', () => {
  test('navigates from the latest article list to an article and its category', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: '最新記事' })).toBeVisible();
    await page.locator('a[href="/articles/e2e-article-1"]').first().click();

    await expect(page).toHaveURL(/\/articles\/e2e-article-1$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'E2E Playwright 導入ガイド 01' }),
    ).toBeVisible();
    await expect(page.getByRole('navigation', { name: '目次' }).first()).toContainText('主要導線');

    await page.getByRole('link', { name: 'プログラミング' }).first().click();

    await expect(page).toHaveURL(/\/category\/programming$/);
    await expect(page.getByRole('heading', { level: 1, name: 'プログラミング' })).toBeVisible();
  });

  test('renders tag, archive, and paginated article indexes', async ({ page }) => {
    await page.goto('/tag/playwright');

    await expect(page.getByRole('heading', { level: 1, name: 'Playwright' })).toBeVisible();
    await expect(page.locator('a[href="/articles/e2e-article-1"]').first()).toBeVisible();

    await page.goto('/archive/2026/05');
    await expect(page.getByRole('heading', { level: 1, name: '2026年5月' })).toBeVisible();
    await page.getByRole('link', { name: '2ページ目へ移動' }).click();

    await expect(page).toHaveURL(/\/archive\/2026\/05\/p\/2$/);
    await expect(page.locator('a[href="/articles/e2e-article-11"]').first()).toBeVisible();

    await page.goto('/p/2');
    await expect(page.getByRole('heading', { level: 1, name: '最新記事' })).toBeVisible();
    await expect(page.locator('a[href="/articles/e2e-article-12"]').first()).toBeVisible();
  });
});
