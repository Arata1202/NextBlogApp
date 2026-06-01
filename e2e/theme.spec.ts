import { expect, test } from './support/app';

test.describe('theme switching', () => {
  test('toggles the theme and persists the choice across reloads', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'ダークテーマに切り替え' }).click();
    await expect(page.locator('body')).toHaveClass(/DarkTheme/);
    await expect(page.getByRole('button', { name: 'ライトテーマに切り替え' })).toBeVisible();

    await page.reload();

    await expect(page.locator('body')).toHaveClass(/DarkTheme/);
    await expect(page.getByRole('button', { name: 'ライトテーマに切り替え' })).toBeVisible();
  });
});
