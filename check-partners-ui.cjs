const { chromium } = require('C:/Users/Naufal Ghani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Naufal Ghani/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/#care');
    await page.waitForLoadState('networkidle');
    const dialog = page.locator('#modal');

    await page.getByRole('button', { name: 'Cari mitra perbaikan' }).click();
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Bandung');
    await dialog.getByRole('button', { name: 'Cari mitra contoh' }).click();
    await dialog.getByText('Pilihan contoh untuk Bandung').waitFor();
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Surabaya');
    assert(!await dialog.getByText('Pilihan contoh untuk Bandung').isVisible(), 'old-city results disappear when area changes');
    await dialog.getByRole('button', { name: 'Cari mitra contoh' }).click();
    await dialog.getByText('Pilihan contoh untuk Surabaya').waitFor();
    await dialog.getByRole('button', { name: /Pilih Penjahit contoh A/ }).click();
    await dialog.getByRole('button', { name: 'Kembali ke pilihan mitra' }).click();
    assert.equal(await dialog.getByRole('combobox', { name: 'Area demo' }).inputValue(), 'Surabaya');
    await page.keyboard.press('Escape');
    assert(!await dialog.isVisible());

    await page.getByRole('button', { name: 'Cari stasiun donasi' }).click();
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    await dialog.locator('#donation-proof').setInputFiles({ name: 'bukan-foto.txt', mimeType: 'text/plain', buffer: Buffer.from('bukan gambar') });
    assert(await dialog.getByText('Pilih foto JPG, PNG, atau WebP.').isVisible());
    assert(await dialog.getByRole('button', { name: 'Buat nota donasi simulasi' }).isDisabled());
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Ide upcycle' }).click();
    assert(await dialog.getByRole('heading', { name: 'Rencana upcycle' }).isVisible());
    await dialog.getByRole('button', { name: 'Simpan rencana upcycle' }).click();
    await page.goto('http://127.0.0.1:4173/#analytics');
    assert(await page.getByText(/Rencana upcycle: Kemeja putih favorit/).isVisible());

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:4173/#care');
      await page.getByRole('button', { name: 'Cari mitra perbaikan' }).click();
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${width}px page overflow`);
      assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), `${width}px dialog overflow`);
      if (width === 390) await page.screenshot({ path: 'preview-partner-mobile.png' });
      if (width === 1440) await page.screenshot({ path: 'preview-partner-desktop.png' });
      await page.keyboard.press('Escape');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:4173/#care');
    await page.getByRole('button', { name: 'Cari mitra perbaikan' }).focus();
    await page.keyboard.press('Enter');
    assert(await dialog.getByRole('heading', { name: 'Cari mitra perbaikan' }).isVisible());
    await dialog.getByRole('combobox', { name: 'Area demo' }).focus();
    await page.keyboard.press('Tab');
    const searchButton = dialog.getByRole('button', { name: 'Cari mitra contoh' });
    assert(await searchButton.evaluate(element => element === document.activeElement), 'search follows area in keyboard order');
    await page.keyboard.press('Enter');
    await dialog.getByText('Pilihan contoh untuk Jakarta Selatan').waitFor();
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('http://127.0.0.1:4173/#care');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), 'care page reflows at 200% text size');
    await page.getByRole('button', { name: 'Cari stasiun donasi' }).click();
    assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), 'dialog reflows at 200% text size');
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log('PASS: area search refresh, partner step navigation, invalid proof, responsive dialogs and Escape.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
