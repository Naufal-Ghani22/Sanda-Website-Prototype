const { chromium } = require('C:/Users/Naufal Ghani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Naufal Ghani/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/#home');
    await page.evaluate(() => localStorage.removeItem('sanda-demo-v1'));
    await page.reload();
    assert(await page.getByRole('img', { name: 'Logo 3D SANDA' }).isVisible());
    await page.goto('http://127.0.0.1:4173/#care');
    assert.equal(await page.locator('.care-photo').count(), 3);
    await page.locator('.care-photo').last().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.care-photo')].every(image => image.complete && image.naturalWidth > 0));
    assert(await page.locator('.care-photo').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
    await page.locator('#care-select').selectOption('rust');
    await page.getByLabel('Komposisi pada label pakaian').fill('80% cotton, 20% polyester');
    await page.getByRole('button', { name: 'Simpan komposisi' }).click();
    assert(await page.getByText('Katun 80% · Poliester 20%').isVisible());
    assert(await page.getByText('Berdasarkan label yang kamu isi').isVisible());
    await page.getByLabel('Komposisi pada label pakaian').fill('70% Katun, 40% Poliester');
    await page.getByRole('button', { name: 'Simpan komposisi' }).click();
    assert(await page.locator('#label-error').getByText(/100%/).isVisible());
    await page.reload();
    await page.locator('#care-select').selectOption('rust');
    assert(await page.getByText('Katun 80% · Poliester 20%').isVisible());
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: 'preview-care-mobile.png', fullPage: true });
    await page.goto('http://127.0.0.1:4173/#scan');
    await page.locator('[data-action="sample"][data-id="cream"]').click();
    await page.getByLabel('Komposisi pada label pakaian').fill('100% Denim');
    await page.getByRole('button', { name: 'Simpan ke lemari' }).click();
    assert(await page.locator('#label-error').getByText(/Denim/).isVisible());
    await page.getByLabel('Komposisi pada label pakaian').fill('100% Katun');
    await page.getByRole('button', { name: 'Simpan ke lemari' }).click();
    assert(await page.getByText('Satu pakaian, peluang baru.').isVisible());
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['home', 'care', 'scan']) {
        await page.goto('http://127.0.0.1:4173/#' + route);
        assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${width} ${route} overflow`);
      }
    }
    await page.goto('http://127.0.0.1:4173/#care');
    await page.screenshot({ path: 'preview-care-desktop.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: 3D logo, care photos, label composition, invalid totals, persisted material, scan validation, responsive layouts.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
