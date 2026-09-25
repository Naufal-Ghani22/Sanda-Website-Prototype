const { chromium } = require('C:/Users/Naufal Ghani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Naufal Ghani/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/#shop');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.removeItem('sanda-demo-v1'));
    await page.reload();
    assert.equal(await page.getByRole('button', { name: 'Coba analisis Plus' }).count(), 0);
    await page.getByLabel('Nama pakaian').fill('Cardigan baru');
    await page.getByRole('button', { name: 'Bandingkan dengan lemari' }).click();
    assert(await page.getByText('Ada yang mirip di lemarimu.').isVisible());
    await page.setViewportSize({ width: 320, height: 900 });
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), '320 teaser overflow');
    await page.getByRole('button', { name: 'Coba analisis Plus' }).click();
    assert(await page.getByText('Mode demo, tanpa pembayaran').isVisible());
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), '320 form overflow');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel('Harga pakaian incaran').fill('300000');
    await page.locator('#shop-plus-file').setInputFiles({ name: 'catatan.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    assert(await page.getByText('Format belum didukung. Pilih foto JPG, PNG, atau WebP.').isVisible());
    await page.getByLabel('Tautan produk (opsional)').fill('javascript:alert(1)');
    await page.getByRole('button', { name: 'Buat analisis Plus' }).click();
    assert(await page.getByText('Tautan produk harus diawali https:// atau http://.').isVisible());
    await page.getByLabel('Tautan produk (opsional)').fill('https://example.com/cardigan');
    await page.locator('#shop-plus-file').setInputFiles(path.join(__dirname, 'dist/assets/logo.png'));
    assert(await page.locator('#plus-photo-preview img').isVisible());
    await page.getByRole('button', { name: 'Buat analisis Plus' }).click();
    assert.equal(await page.locator('#plus-outfits .plus-outfit').count(), 3);
    assert(await page.getByText('Rp15.000').isVisible());
    assert(await page.getByText(/simulasi, bukan prediksi/i).isVisible());
    assert(await page.getByRole('link', { name: 'Lihat perawatan' }).isVisible());
    await page.screenshot({ path: 'preview-plus-mobile.png', fullPage: true });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${width} plus overflow`);
    }
    await page.screenshot({ path: 'preview-plus-desktop.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: free comparison, Plus preview, photo, product link, three pairings, cost-per-wear scenario, mobile/desktop layouts.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
