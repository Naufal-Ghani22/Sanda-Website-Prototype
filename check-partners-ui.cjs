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
    await page.evaluate(() => localStorage.removeItem('sanda-demo-v1'));
    await page.reload();

    await page.getByRole('button', { name: 'Rencanakan repair' }).click();
    const dialog = page.locator('#modal');
    assert(await dialog.getByRole('heading', { name: 'Pilih calon penjahit' }).isVisible());
    assert(await dialog.getByText(/daftar mitra contoh, bukan hasil pencarian lokasi langsung/i).isVisible());
    const saveRepair = dialog.getByRole('button', { name: 'Simpan pilihan repair' });
    assert(await saveRepair.isDisabled());
    const saveBox = await saveRepair.boundingBox();
    const dialogBox = await dialog.boundingBox();
    assert(saveBox.y + saveBox.height <= dialogBox.y + dialogBox.height + 1, 'save action stays visible in mobile dialog');
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Bandung');
    assert(await dialog.getByText('Pilihan contoh untuk Bandung').isVisible());
    await dialog.getByRole('radio', { name: /Penjahit contoh A/ }).check();
    assert(await saveRepair.isEnabled());
    await saveRepair.click();
    assert(!await dialog.isVisible());
    assert(await page.locator('#care-content').getByText(/Penjahit contoh A/).isVisible());

    await page.getByRole('button', { name: 'Siapkan donasi' }).click();
    assert(await dialog.getByRole('heading', { name: 'Pilih calon tujuan donasi' }).isVisible());
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Surabaya');
    await dialog.getByRole('radio', { name: /Panti asuhan contoh A/ }).check();
    assert(await dialog.getByText(/hubungi lembaga untuk memastikan kebutuhan/i).isVisible());
    await dialog.getByRole('button', { name: 'Simpan pilihan donasi' }).click();

    await page.goto('http://127.0.0.1:4173/#analytics');
    await page.waitForLoadState('networkidle');
    assert(await page.locator('.activity small').filter({ hasText: 'Penjahit contoh A' }).isVisible());
    assert(await page.locator('.activity small').filter({ hasText: 'Panti asuhan contoh A' }).isVisible());
    const logs = await page.evaluate(() => JSON.parse(localStorage.getItem('sanda-demo-v1')).logs);
    assert(logs.some(log => log.kind === 'repair' && log.partnerId === 'repair-a' && log.city === 'Bandung' && log.isDemo === true));
    assert(logs.some(log => log.kind === 'donasi' && log.partnerId === 'donasi-a' && log.city === 'Surabaya' && log.isDemo === true));
    await page.reload();
    assert(await page.locator('.activity small').filter({ hasText: 'Panti asuhan contoh A' }).isVisible());

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:4173/#care');
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Rencanakan repair' }).click();
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${width} page overflow`);
      assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), `${width} dialog overflow`);
      if (width === 390) await page.screenshot({ path: 'preview-partner-mobile.png' });
      if (width === 1440) await page.screenshot({ path: 'preview-partner-desktop.png' });
      await page.keyboard.press('Escape');
      assert(!await dialog.isVisible());
    }
    assert.deepEqual(errors, []);
    console.log('PASS: repair and donation partner simulation, city selection, choice validation, saved activity, persistence, responsive dialogs, Escape.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
