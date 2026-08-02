import { expect, test } from '@playwright/test';

test('discloses sponsored articles and marks only sponsor links', async ({ page }) => {
  await page.goto('/');

  const sponsoredCard = page.locator('a[href="/articles/e2e-article-1"]').first();
  await expect(sponsoredCard.getByText('PR')).toBeVisible();

  await sponsoredCard.click();

  await expect(page.getByText('PR', { exact: true })).toBeVisible();
  await expect(page.getByText('本記事は、広告主から依頼を受けて制作した広告です。')).toBeVisible();
  await expect(page.getByRole('link', { name: 'スポンサーリンク' })).toHaveAttribute(
    'rel',
    'sponsored',
  );
  await expect(page.getByRole('link', { name: '参考リンク' })).not.toHaveAttribute(
    'rel',
    /sponsored/,
  );
});
