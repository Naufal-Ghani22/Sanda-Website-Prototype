const { chromium } = require('C:/Users/Naufal Ghani/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Naufal Ghani/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://127.0.0.1:4173/#'+route);await page.locator('h1').waitFor();};
 const button=name=>page.getByRole('button',{name,exact:true});
 const link=name=>page.getByRole('link',{name,exact:true});
 await go('home');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'preview-desktop.png',fullPage:true});
 await link('Scan pakaian').click();await page.locator('#file').setInputFiles(path.join(__dirname,'dist/assets/hero.png'));
 await page.locator('#scan-form').waitFor();await page.getByLabel('Nama pakaian').fill('Kemeja tes pengguna');
 await button('Simpan ke lemari').click();await link('Lihat lemari saya').click();await page.reload();
 assert(await page.getByText('Kemeja tes pengguna',{exact:true}).isVisible());
 await page.locator('#search').fill('Kemeja tes pengguna');assert.equal(await page.locator('#wardrobe-results .garment').count(),1);
 await page.locator('#search').fill('TidakAdaPakaian');assert(await page.getByText('Belum ada pakaian di sini').isVisible());
 await link('Outfit').click();await button('Susun outfit').click();await button('Pakai outfit ini hari ini').click();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('sanda-demo-v1')).logs.filter(l=>l.type==='wear').length);
 await button('Pemakaian hari ini tercatat').click();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('sanda-demo-v1')).logs.filter(l=>l.type==='wear').length);
 assert.equal(before,2);assert.equal(before,after);await button('Coba kombinasi lain').click();
 await link('Cek belanja').click();await page.getByLabel('Nama pakaian').fill('Cardigan orange');await button('Bandingkan dengan lemari').click();assert(await page.getByText('Ada yang mirip di lemarimu.').isVisible());
 await link('Perawatan').click();await button('Rencanakan repair').click();await button('Simpan rencana repair').click();
 await link('Aktivitas').click();await page.getByText('Rencana repair:',{exact:false}).waitFor();await button('Mulai tantangan hari ini').click();
 for(const width of [390,320,768,1440]) {await page.setViewportSize({width,height:900});for(const route of ['home','wardrobe','scan','outfit','shop','care','analytics']){await go(route);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${width}: ${route} overflow`);}if(width===390){await go('home');await page.screenshot({path:'preview-mobile.png',fullPage:true});}}
 await go('scan');await page.locator('#file').setInputFiles({name:'bad.txt',mimeType:'text/plain',buffer:Buffer.from('bad')});assert(await page.locator('#scan-error').textContent());
 await page.locator('[data-action="sample"][data-id="cream"]').click();await page.getByLabel('Nama pakaian').fill('   ');await button('Simpan ke lemari').click();assert(await page.locator('#scan-form').isVisible());await page.getByLabel('Nama pakaian').fill('Contoh kedua');await button('Simpan ke lemari').click();
 await button('Atur ulang demo').click();await button('Batal').click();await button('Atur ulang demo').click();await page.locator('#modal').getByRole('button',{name:'Atur ulang demo',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('sanda-demo-v1')).items.length),6);
 await button('Panduan demo').click();await page.keyboard.press('Escape');assert(!await page.locator('#modal').isVisible());
 assert.deepEqual(errors,[]);
 console.log('PASS: upload, persistence, search, empty results, outfit, wear deduplication, purchase comparison, care plan, challenge, invalid file, sample, blank name, reset, Escape; 28 responsive checks; no page errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
