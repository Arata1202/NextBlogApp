import { expect, test } from './support/app';

test.describe('contact form', () => {
  test('validates required fields before opening the confirmation modal', async ({ page }) => {
    await page.goto('/contact');

    await page.getByRole('button', { name: '送信' }).click();

    await expect(
      page.getByRole('alert').filter({ hasText: 'メールアドレスを入力してください' }),
    ).toBeVisible();
    await expect(
      page.getByRole('alert').filter({ hasText: '件名を入力してください' }),
    ).toBeVisible();
    await expect(
      page.getByRole('alert').filter({ hasText: '内容を入力してください' }),
    ).toBeVisible();
  });

  test('submits through mocked reCAPTCHA and send-email API', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('メールアドレス').fill('e2e@example.com');
    await page.getByLabel('件名').fill('Playwright E2E');
    await page.getByLabel('内容').fill('お問い合わせフォームのE2Eテストです。');
    await page.getByRole('button', { name: 'reCAPTCHAを完了' }).click();
    await page.getByRole('button', { name: '送信' }).click();

    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: 'お問い合わせを送信しますか？' }),
    ).toBeVisible();
    await dialog.getByRole('button', { name: '送信' }).click();

    await expect(page.getByRole('status')).toContainText('お問い合わせありがとうございます');
  });
});
