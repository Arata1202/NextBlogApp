import { expect, test } from './support/app';

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the mobile menu and navigates to a fixed page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await expect(page.getByRole('dialog').getByText('Menu')).toBeVisible();
    await page
      .getByRole('dialog')
      .getByRole('link', { name: /プロフィール/ })
      .click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { level: 1, name: 'プロフィール' })).toBeVisible();
  });
});
