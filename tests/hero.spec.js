import { test, expect } from '@playwright/test';
test('intro completes, persists, replays and skips', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/is-intro/);
  await expect(page.locator('#handwriting [data-word]')).toHaveCount(2);
  await expect(page.locator('html')).not.toHaveClass(/is-intro/, { timeout: 8000 });
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

test('pen draws Resep before Nurolanda and food overshoots before settling', async ({ page }) => {
  await page.goto('/');
  const secondWord = page.locator('[data-word="Nurolanda"] path');
  expect(await secondWord.evaluateAll(paths => paths.every(path =>
    parseFloat(path.style.strokeDashoffset) >= parseFloat(path.style.strokeDasharray)
  ))).toBe(true);
  await expect.poll(() => secondWord.evaluateAll(paths => paths.some(path =>
    parseFloat(path.style.strokeDashoffset) < parseFloat(path.style.strokeDasharray)
  ))).toBe(true);
  expect(await page.locator('[data-word="Resep"] path').evaluateAll(paths =>
    paths.every(path => parseFloat(path.style.strokeDashoffset) === 0 && path.getAttribute('fill') === 'none')
  )).toBe(true);
  await expect(page.locator('html')).toHaveClass(/is-revealing/);
  const bounce = await page.locator('.food-main').evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause();
    const yAt = progress => {
      animation.currentTime = 600 + 1350 * progress;
      return new DOMMatrix(getComputedStyle(element).transform).m42;
    };
    return [yAt(.58), yAt(.82), yAt(1)];
  });
  expect(bounce[0]).toBeCloseTo(-30, 0);
  expect(bounce[1]).toBeCloseTo(7, 0);
  expect(bounce[2]).toBeCloseTo(0, 0);
});

test('skipping cancels handwriting and does not trigger a stale reveal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Lewati intro' }).click();
  await page.waitForTimeout(3000);
  await expect(page.locator('html')).not.toHaveClass(/is-intro|is-revealing/);
  await page.getByRole('button', { name: 'Putar ulang animasi intro' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.intro')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Putar ulang animasi intro' })).toBeFocused();
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
