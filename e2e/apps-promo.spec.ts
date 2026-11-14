import { expect, test } from './support/app';

test('App Store link fits its badge and keeps a usable target at each breakpoint', async ({ page }) => {
  await page.goto('/');

  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 800 });
    const link = page.getByRole('link', { name: 'App Storeからダウンロード' });
    const badge = link.getByRole('img', { name: 'App Storeからダウンロード' });
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await expect(link).toBeFocused();
    const linkBox = await link.boundingBox();
    const badgeBox = await badge.boundingBox();
    expect(linkBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(Math.abs(linkBox!.width - badgeBox!.width)).toBeLessThanOrEqual(1);
    expect(linkBox!.height).toBeGreaterThanOrEqual(44);
  }
});
