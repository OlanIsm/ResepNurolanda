import { test, expect } from '@playwright/test';
test('intro completes, persists, replays and skips', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass('is-intro');
  await expect(page.locator('.signature-letter')).toHaveCount(14);
  await expect(page.locator('html')).not.toHaveClass('is-intro', { timeout: 6000 });
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass('is-intro');
  await page.getByRole('button', { name: 'Putar ulang animasi intro' }).click();
  await expect(page.locator('html')).toHaveClass('is-intro');
  await page.getByRole('button', { name: 'Lewati intro' }).click();
  await expect(page.locator('html')).not.toHaveClass('is-intro');
  await page.getByRole('button', { name: 'Pesan via WhatsApp' }).click();
  await expect(page.getByRole('status')).toContainText('belum ditambahkan');
});
test('reduced motion and blocked storage keep hero usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto('/');
  await expect(page.locator('.intro')).toBeHidden();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.getByRole('button', { name: 'Putar ulang animasi intro' }).click();
  await expect(page.locator('.intro')).toBeHidden();
});
test('layout fits viewport widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const copy = await page.locator('.hero-cta').boundingBox();
    const food = await page.locator('.food-main').boundingBox();
    expect(food.y).toBeGreaterThan(copy.y + copy.height);
  }
});
test('hero visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173');
  await expect(page.getByRole('heading', { name: 'text holder' })).toBeVisible();
  await expect(page.locator('.intro')).toBeHidden();
  await context.close();
});
