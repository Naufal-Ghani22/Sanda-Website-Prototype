const { chromium } = require('C:/Users/Naufal Ghani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const base = 'http://127.0.0.1:4173/';
const png = readFileSync('dist/assets/care-repair.png');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Naufal Ghani/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}#care`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.removeItem('sanda-demo-v1'));
    await page.reload();

    await page.getByRole('button', { name: 'Cari mitra perbaikan' }).click();
    const dialog = page.locator('#modal');
    assert(await dialog.getByRole('heading', { name: 'Cari mitra perbaikan' }).isVisible());
    assert(await dialog.getByText(/lokasi perangkat tidak dibaca/i).isVisible());
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Bandung');
    await dialog.getByRole('button', { name: 'Cari mitra contoh' }).click();
    await dialog.getByText('Pilihan contoh untuk Bandung').waitFor();
    assert(await dialog.getByText('Pilihan contoh untuk Bandung').isVisible());
    await dialog.getByRole('button', { name: /Pilih Penjahit contoh A/ }).click();
    assert(await dialog.getByRole('heading', { name: 'Pilih layanan perbaikan' }).isVisible());
    await page.evaluate(async () => { const image = new Image(); image.src = 'assets/garments.png'; await image.decode(); });
    await page.screenshot({ path: 'preview-repair-service-mobile.png' });
    await dialog.getByRole('radio', { name: /Perbaiki jahitan/ }).check();
    await dialog.getByRole('textbox', { name: 'Catatan untuk penjahit' }).fill('Jahitan sisi kiri terbuka');
    await dialog.getByRole('button', { name: 'Tinjau pembayaran' }).click();
    assert(await dialog.getByRole('heading', { name: 'Tinjau pembayaran' }).isVisible());
    assert(await dialog.getByText('Rp45.000').first().isVisible());
    assert(await dialog.getByText(/harga contoh, bukan penawaran mitra/i).isVisible());
    await dialog.getByRole('button', { name: 'Ubah layanan' }).click();
    assert(await dialog.getByRole('radio', { name: /Perbaiki jahitan/ }).isChecked());
    await dialog.getByRole('button', { name: 'Tinjau pembayaran' }).click();
    await dialog.getByRole('radio', { name: /QRIS demo/ }).check();
    await dialog.getByRole('button', { name: 'Konfirmasi pembayaran demo' }).click();
    assert(await dialog.getByRole('heading', { name: 'Ringkasan repair' }).isVisible());
    assert(await dialog.getByText(/tidak ada dana yang berpindah/i).isVisible());
    assert(await dialog.getByText(/Jahitan sisi kiri terbuka/i).isVisible());
    await page.screenshot({ path: 'preview-repair-transaction-mobile.png' });
    const repairLog = await page.evaluate(() => JSON.parse(localStorage.getItem('sanda-demo-v1')).logs.find(log => log.type === 'repair_transaction'));
    assert.equal(repairLog.serviceId, 'stitch');
    assert.equal(repairLog.amount, 45000);
    assert.equal(repairLog.paymentMethod, 'qris-demo');
    assert.equal(repairLog.city, 'Bandung');
    assert.equal(repairLog.isDemo, true);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Cari stasiun donasi' }).click();
    assert(await dialog.getByRole('heading', { name: 'Cari stasiun donasi' }).isVisible());
    assert(await dialog.getByText('Donasi · tahap 1/2').isVisible());
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Surabaya');
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByText('Pilihan contoh untuk Surabaya').waitFor();
    assert(await dialog.getByText('Pilihan contoh untuk Surabaya').isVisible());
    await page.screenshot({ path: 'preview-donation-station-mobile.png' });
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    assert(await dialog.getByRole('heading', { name: 'Catat penyerahan donasi' }).isVisible());
    const createReceipt = dialog.getByRole('button', { name: 'Buat nota donasi simulasi' });
    assert(await createReceipt.isDisabled(), 'receipt requires proof image');
    await dialog.getByRole('textbox', { name: 'Tanggal penyerahan' }).fill('2026-01-01');
    await dialog.locator('#donation-proof').setInputFiles({ name: 'bukti.png', mimeType: 'image/png', buffer: png });
    await dialog.getByText('bukti.png').waitFor();
    assert(await dialog.getByText('bukti.png').isVisible());
    assert(await createReceipt.isEnabled());
    await dialog.getByRole('button', { name: 'Ubah stasiun' }).click();
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Bandung');
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    assert(await dialog.getByRole('button', { name: 'Buat nota donasi simulasi' }).isDisabled(), 'new area requires a new proof');
    await dialog.getByRole('button', { name: 'Ubah stasiun' }).click();
    await dialog.getByRole('combobox', { name: 'Area demo' }).selectOption('Surabaya');
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    await dialog.getByRole('textbox', { name: 'Tanggal penyerahan' }).fill('2026-01-01');
    await dialog.locator('#donation-proof').setInputFiles({ name: 'bukti.png', mimeType: 'image/png', buffer: png });
    await dialog.getByText('bukti.png').waitFor();
    await dialog.getByRole('button', { name: 'Ubah stasiun' }).click();
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh B/ }).click();
    assert(await dialog.getByRole('button', { name: 'Buat nota donasi simulasi' }).isDisabled(), 'new station requires a new proof');
    await dialog.getByRole('button', { name: 'Ubah stasiun' }).click();
    await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    await dialog.getByRole('textbox', { name: 'Tanggal penyerahan' }).fill('2026-01-01');
    await dialog.locator('#donation-proof').setInputFiles({ name: 'bukti.png', mimeType: 'image/png', buffer: png });
    await dialog.getByText('bukti.png').waitFor();
    await dialog.locator('#donation-proof').setInputFiles({ name: 'salah.txt', mimeType: 'text/plain', buffer: Buffer.from('bukan gambar') });
    assert(await createReceipt.isDisabled(), 'invalid replacement removes the previous valid proof');
    await dialog.locator('#donation-proof').setInputFiles({ name: 'bukti.png', mimeType: 'image/png', buffer: png });
    await dialog.getByText('bukti.png').waitFor();
    await createReceipt.click();
    assert(await dialog.getByRole('heading', { name: 'Nota donasi' }).isVisible());
    assert(await dialog.getByText(/dilaporkan pengguna, belum diverifikasi/i).isVisible());
    assert(await dialog.locator('img[alt="Bukti donasi yang diunggah"]').isVisible());
    const donationLog = await page.evaluate(() => JSON.parse(localStorage.getItem('sanda-demo-v1')).logs.find(log => log.type === 'donation_receipt'));
    assert.equal(donationLog.stationName, 'Stasiun donasi contoh A');
    assert.equal(donationLog.city, 'Surabaya');
    assert.equal(donationLog.handedAt, '2026-01-01');
    assert(donationLog.proofImage.startsWith('data:image/'));
    assert.equal(donationLog.isDemo, true);
    await page.screenshot({ path: 'preview-donation-receipt-mobile.png' });
    await dialog.getByRole('link', { name: 'Lihat di Aktivitas' }).click();
    await page.waitForURL('**/#analytics');
    assert(!await dialog.isVisible());

    await page.getByText(/Repair simulasi: Kemeja putih favorit/).waitFor();
    assert(await page.getByText(/Repair simulasi: Kemeja putih favorit/).isVisible());
    assert(await page.getByText(/Nota donasi: Kemeja putih favorit/).isVisible());
    await page.reload();
    await page.getByRole('button', { name: /Lihat nota donasi/ }).click();
    assert(await dialog.getByRole('heading', { name: 'Nota donasi' }).isVisible());
    assert(await dialog.locator('img[alt="Bukti donasi yang diunggah"]').isVisible());
    await page.keyboard.press('Escape');

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}#care`);
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Cari stasiun donasi' }).click();
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${width}px page overflow`);
      assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), `${width}px dialog overflow`);
      if (width === 1440) await page.screenshot({ path: 'preview-donation-station-desktop.png' });
      await dialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
      await dialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
      assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), `${width}px handover overflow`);
      await dialog.getByRole('button', { name: 'Buat nota donasi simulasi' }).scrollIntoViewIfNeeded();
      await page.keyboard.press('Escape');
      assert(!await dialog.isVisible());
      await page.goto(`${base}#analytics`);
      await page.getByRole('button', { name: /Lihat nota donasi/ }).click();
      assert(!await dialog.evaluate(element => element.scrollWidth > element.clientWidth + 1), `${width}px receipt overflow`);
      await page.keyboard.press('Escape');
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}#care`);
    await page.getByRole('button', { name: 'Cari mitra perbaikan' }).click();
    await dialog.getByRole('button', { name: 'Cari mitra contoh' }).click();
    await dialog.getByRole('button', { name: /Pilih Penjahit contoh A/ }).click();
    await dialog.getByRole('radio', { name: /Ganti kancing/ }).check();
    await dialog.getByRole('button', { name: 'Tinjau pembayaran' }).click();
    await dialog.getByRole('radio', { name: /Transfer demo/ }).check();
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('quota'); }; });
    await dialog.getByRole('button', { name: 'Konfirmasi pembayaran demo' }).click();
    assert(await dialog.getByText(/penyimpanan browser gagal/i).isVisible(), 'failed storage must be visible on the receipt');

    const jakarta = await browser.newContext({ timezoneId: 'Asia/Jakarta', viewport: { width: 390, height: 844 } });
    await jakarta.addInitScript(() => {
      const NativeDate = Date;
      const fixed = NativeDate.parse('2026-09-24T18:00:00.000Z');
      window.Date = class extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [fixed])); }
        static now() { return fixed; }
      };
    });
    const jakartaPage = await jakarta.newPage();
    await jakartaPage.goto(`${base}#care`);
    await jakartaPage.getByRole('button', { name: 'Cari stasiun donasi' }).click();
    const jakartaDialog = jakartaPage.locator('#modal');
    await jakartaDialog.getByRole('button', { name: 'Cari stasiun contoh' }).click();
    await jakartaDialog.getByRole('button', { name: /Pilih Stasiun donasi contoh A/ }).click();
    assert.equal(await jakartaDialog.getByRole('textbox', { name: 'Tanggal penyerahan' }).getAttribute('max'), '2026-09-25', 'date limit follows the local day in Jakarta');
    await jakarta.close();

    assert.deepEqual(errors, []);
    console.log('PASS: repair payment simulation, donation station search, proof upload, receipt persistence, responsive flow and no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
