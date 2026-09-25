'use strict';

const careDemoLocations = {
  repair: [
    { id: 'repair-a', name: 'Penjahit contoh A', detail: 'Jahitan, kancing, dan penyesuaian ukuran.' },
    { id: 'repair-b', name: 'Penjahit contoh B', detail: 'Pilihan kedua untuk mencoba alur perbaikan.' }
  ],
  donasi: [
    { id: 'station-a', name: 'Stasiun donasi contoh A', detail: 'Titik penyerahan contoh. Penerimaan pakaian belum diverifikasi.' },
    { id: 'station-b', name: 'Stasiun donasi contoh B', detail: 'Titik penyerahan contoh. Penerimaan pakaian belum diverifikasi.' }
  ]
};
const careDemoServices = [
  { id: 'button', name: 'Ganti kancing', description: 'Ganti kancing yang hilang atau rusak.', amount: 25000 },
  { id: 'stitch', name: 'Perbaiki jahitan', description: 'Jahit ulang bagian yang sobek atau terbuka.', amount: 45000 },
  { id: 'alteration', name: 'Ubah ukuran', description: 'Penyesuaian potongan sesuai kebutuhan.', amount: 85000 }
];
let activeCareFlow = null;
const careRupiah = amount => `Rp${amount.toLocaleString('id-ID')}`;
const careLocalDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

function careFlowScreen(content) {
  if ($('#modal').open) $('#modal-content').innerHTML = `<div class="dialog-body care-flow">${content}</div>`;
  else openModal(`<div class="care-flow">${content}</div>`);
  const heading = $('#modal-content h2');
  if (heading) { heading.tabIndex = -1; heading.focus(); }
}

function careFlowHeader(step, title, intro) {
  const label = activeCareFlow?.kind === 'repair' ? 'Repair' : 'Donasi';
  return `<div class="flow-heading"><span class="flow-step">${label} · tahap ${step}</span><h2>${title}</h2><p>${intro}</p></div>`;
}

function startCareFlow(item, kind) {
  if (!item || !careDemoLocations[kind]) return;
  activeCareFlow = { itemId: item.id, kind, city: 'Jakarta Selatan', partner: null, service: null, note: '', paymentMethod: null, proof: null, handedAt: '', step: 'search', searchToken: 0 };
  renderCareSearch();
}

function clearCareChoice(flow) {
  flow.partner = null;
  flow.service = null;
  flow.note = '';
  flow.paymentMethod = null;
  flow.proof = null;
  flow.handedAt = '';
}

function renderCareSearch() {
  const flow = activeCareFlow;
  if (!flow) return;
  flow.step = 'search';
  const repair = flow.kind === 'repair';
  careFlowScreen(`${careFlowHeader(repair ? '1/3' : '1/2', repair ? 'Cari mitra perbaikan' : 'Cari stasiun donasi', repair ? 'Pilih area untuk melihat calon penjahit contoh.' : 'Pilih area untuk melihat stasiun penyerahan contoh.')}
    <div class="flow-location"><strong>Pencarian area demo</strong><p>Lokasi perangkat tidak dibaca. Daftar ini bukan hasil pencarian tempat terdekat.</p><label class="field">Area demo<select id="flow-city">${demoCities.map(city => `<option ${city === flow.city ? 'selected' : ''}>${esc(city)}</option>`).join('')}</select></label><button class="primary" type="button" data-flow="search">Cari ${repair ? 'mitra' : 'stasiun'} contoh</button></div>
    <div id="flow-results" class="flow-results" aria-live="polite"><p class="flow-empty">Pilih area, lalu mulai pencarian contoh.</p></div>
    <p class="flow-caveat">Nama dan area hanya untuk simulasi. Belum ada alamat, jarak, kontak, atau kerja sama mitra.</p>`);
}

function renderCareResults() {
  const flow = activeCareFlow;
  if (!flow || flow.step !== 'search') return;
  const target = $('#flow-results');
  if (!target) return;
  target.innerHTML = `<h3>Pilihan contoh untuk ${esc(flow.city)}</h3><div class="flow-location-list">${careDemoLocations[flow.kind].map(partner => `<article class="flow-location-card"><div><strong>${esc(partner.name)}</strong><p>${esc(partner.detail)}</p><small>Area demo: ${esc(flow.city)}</small></div><button class="secondary" type="button" data-flow="choose-location" data-id="${partner.id}">Pilih ${esc(partner.name)}</button></article>`).join('')}</div>`;
}

function renderRepairService() {
  const flow = activeCareFlow;
  const item = state.items.find(entry => entry.id === flow?.itemId);
  if (!flow || !item || !flow.partner) return;
  flow.step = 'service';
  careFlowScreen(`${careFlowHeader('2/3', 'Pilih layanan perbaikan', 'Tentukan kebutuhan pakaianmu. Harga di bawah hanya contoh untuk menguji alur.')}
    <div class="flow-item">${art(item)}<div><small>Pakaian dan mitra contoh</small><strong>${esc(item.name)}</strong><span>${esc(flow.partner.name)} · ${esc(flow.city)}</span></div></div>
    <form id="repair-service-form"><fieldset class="flow-choice-list"><legend>Jenis layanan</legend>${careDemoServices.map(service => `<label class="flow-choice"><input type="radio" name="service" value="${service.id}" required ${flow.service?.id === service.id ? 'checked' : ''}><span><strong>${service.name}</strong><small>${service.description}</small></span><b>${careRupiah(service.amount)}</b></label>`).join('')}</fieldset>
      <label class="field">Catatan untuk penjahit<textarea name="note" maxlength="180" rows="3" placeholder="Contoh: Jahitan sisi kiri terbuka">${esc(flow.note)}</textarea></label>
      <p class="flow-caveat">Harga contoh, bukan penawaran mitra. Biaya akhir baru dapat ditentukan oleh mitra nyata setelah memeriksa pakaian.</p>
      <div class="flow-actions"><button class="text-button" type="button" data-flow="back-search">Kembali ke pilihan mitra</button><button class="primary" type="submit">Tinjau pembayaran</button></div></form>`);
}

function renderRepairPayment() {
  const flow = activeCareFlow;
  const item = state.items.find(entry => entry.id === flow?.itemId);
  if (!flow || !item || !flow.service) return;
  flow.step = 'payment';
  careFlowScreen(`${careFlowHeader('3/3', 'Tinjau pembayaran', 'Periksa rincian sebelum mengakhiri simulasi. Tidak ada pembayaran sungguhan.')}
    <div class="flow-review"><div><span>Pakaian</span><strong>${esc(item.name)}</strong></div><div><span>Mitra contoh</span><strong>${esc(flow.partner.name)}, ${esc(flow.city)}</strong></div><div><span>Layanan</span><strong>${esc(flow.service.name)}</strong></div><div><span>Harga layanan contoh</span><strong>${careRupiah(flow.service.amount)}</strong></div><div><span>Biaya platform demo</span><strong>Rp0</strong></div><div class="flow-total"><span>Total estimasi</span><strong>${careRupiah(flow.service.amount)}</strong></div></div>
    <form id="repair-payment-form"><fieldset class="flow-choice-list"><legend>Metode pembayaran demo</legend><label class="flow-choice"><input type="radio" name="payment" value="qris-demo" required><span><strong>QRIS demo</strong><small>Tidak ada kode QR atau pembayaran nyata.</small></span></label><label class="flow-choice"><input type="radio" name="payment" value="transfer-demo" required><span><strong>Transfer demo</strong><small>Tidak ada nomor rekening atau pembayaran nyata.</small></span></label></fieldset>
      <p class="flow-caveat">Harga contoh, bukan penawaran mitra. Konfirmasi ini tidak membuat janji dan tidak memindahkan dana.</p>
      <div class="flow-actions"><button class="text-button" type="button" data-flow="back-service">Ubah layanan</button><button class="primary" type="submit">Konfirmasi pembayaran demo</button></div></form>`);
}

function renderDonationHandover() {
  const flow = activeCareFlow;
  const item = state.items.find(entry => entry.id === flow?.itemId);
  if (!flow || !item || !flow.partner) return;
  flow.step = 'handover';
  careFlowScreen(`${careFlowHeader('2/2', 'Catat penyerahan donasi', 'Serahkan pakaian ke tempat yang benar-benar menerima donasi. Di demo ini, unggah bukti untuk mencoba pencatatannya.')}
    <div class="flow-item">${art(item)}<div><small>Rencana penyerahan</small><strong>${esc(item.name)}</strong><span>${esc(flow.partner.name)} · ${esc(flow.city)}</span></div></div>
    <ol class="flow-instructions"><li>Pastikan pakaian bersih dan layak pakai.</li><li>Hubungi tempat tujuan nyata untuk memeriksa kebutuhan dan jam penerimaan.</li><li>Sesudah menyerahkan, unggah foto bukti milikmu.</li></ol>
    <form id="donation-form"><label class="field">Tanggal penyerahan<input name="handedAt" type="date" max="${careLocalDate()}" value="${esc(flow.handedAt)}" required></label><label class="field">Foto bukti penyerahan<input id="donation-proof" type="file" accept="image/jpeg,image/png,image/webp"></label><p class="fine">JPG, PNG, atau WebP · maksimal 8 MB. Foto diperkecil dan disimpan hanya di browser ini.</p><div id="donation-proof-preview" class="flow-proof-preview">${flow.proof ? `<img src="${flow.proof.image}" alt="Pratinjau bukti donasi"><span>${esc(flow.proof.name)}</span>` : '<span>Belum ada foto bukti.</span>'}</div><p id="donation-error" class="error" role="alert"></p><p class="flow-caveat">Nota akan berstatus dilaporkan pengguna, belum diverifikasi oleh stasiun atau penerima.</p><div class="flow-actions"><button class="text-button" type="button" data-flow="back-search">Ubah stasiun</button><button class="primary" type="submit" ${flow.proof ? '' : 'disabled'}>Buat nota donasi simulasi</button></div></form>`);
}

function careReceiptId(kind) {
  const code = kind === 'repair' ? 'R' : 'D';
  const suffix = typeof crypto.randomUUID === 'function' ? crypto.randomUUID().slice(0, 8).toUpperCase() : `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  return `SND-${code}-${suffix}`;
}

function renderCareReceipt(log, saved = true) {
  const repair = log.type === 'repair_transaction';
  const safeProof = typeof log.proofImage === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(log.proofImage);
  careFlowScreen(`<div class="flow-receipt"><span class="flow-step">${repair ? 'Ringkasan transaksi' : 'Pencatatan donasi'} · simulasi</span><h2>${repair ? 'Ringkasan repair' : 'Nota donasi'}</h2><p class="flow-receipt-id">Nomor simulasi: <strong>${esc(log.id)}</strong></p>${saved ? '' : '<p class="flow-save-error" role="alert">Penyimpanan browser gagal. Ringkasan ini hanya tersedia selama sesi ini; jangan anggap sebagai nota yang tersimpan.</p>'}<div class="flow-receipt-status"><strong>${repair ? 'Pembayaran demo selesai' : 'Dilaporkan pengguna, belum diverifikasi'}</strong><p>${repair ? 'Tidak ada dana yang berpindah dan belum ada janji dengan mitra.' : 'Nota ini hanya mencatat isianmu. Stasiun belum mengonfirmasi penerimaan.'}</p></div><dl><div><dt>Pakaian</dt><dd>${esc(log.name)}</dd></div><div><dt>${repair ? 'Penjahit contoh' : 'Stasiun contoh'}</dt><dd>${esc(repair ? log.partnerName : log.stationName)} · ${esc(log.city)}</dd></div>${repair ? `<div><dt>Layanan</dt><dd>${esc(log.serviceName)}</dd></div><div><dt>Metode demo</dt><dd>${log.paymentMethod === 'qris-demo' ? 'QRIS demo' : 'Transfer demo'}</dd></div><div><dt>Total estimasi</dt><dd>${careRupiah(Number(log.amount) || 0)}</dd></div>${log.note ? `<div><dt>Catatan</dt><dd>${esc(log.note)}</dd></div>` : ''}` : `<div><dt>Tanggal yang kamu laporkan</dt><dd>${esc(log.handedAt)}</dd></div><div><dt>Nama berkas bukti</dt><dd>${esc(log.proofName)}</dd></div>`}<div><dt>Dicatat pada</dt><dd>${new Date(log.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</dd></div></dl>${!repair && safeProof ? `<div class="flow-receipt-proof"><span>Foto bukti yang kamu unggah</span><img src="${log.proofImage}" alt="Bukti donasi yang diunggah"></div>` : ''}<p class="flow-caveat">Dokumen simulasi SANDA. Bukan bukti pembayaran atau tanda terima resmi.</p><a class="primary" href="#analytics" data-flow="close-to-activity">Lihat di Aktivitas</a></div>`);
}

function careFlowActivity(log) {
  if (log.type !== 'repair_transaction' && log.type !== 'donation_receipt') return '';
  const repair = log.type === 'repair_transaction';
  return `<div class="activity flow-activity"><span>${repair ? 'Repair simulasi' : 'Nota donasi'}: <strong>${esc(log.name)}</strong><small>${esc(repair ? log.partnerName : log.stationName)} · ${esc(log.city)} · ${repair ? 'Tidak ada pembayaran nyata' : 'Belum diverifikasi'}</small><button class="text-button" type="button" data-flow="view-receipt" data-id="${esc(log.id)}">Lihat ${repair ? 'ringkasan repair' : 'nota donasi'}</button></span><time>${new Date(log.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time></div>`;
}

async function acceptDonationProof(file) {
  const flow = activeCareFlow;
  if (!flow || flow.step !== 'handover' || !file) return;
  const error = $('#donation-error');
  flow.proof = null;
  $('#donation-form button[type="submit"]').disabled = true;
  $('#donation-proof-preview').textContent = 'Belum ada foto bukti.';
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { error.textContent = 'Pilih foto JPG, PNG, atau WebP.'; return; }
  if (file.size > 8 * 1024 * 1024) { error.textContent = 'Foto terlalu besar. Batas unggahan 8 MB.'; return; }
  error.textContent = '';
  $('#donation-proof-preview').textContent = 'Menyiapkan foto bukti...';
  try {
    const bitmap = await createImageBitmap(file);
    if (activeCareFlow !== flow || flow.step !== 'handover') { bitmap.close(); return; }
    const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const image = canvas.toDataURL('image/jpeg', 0.72);
    if (image.length > 750000) throw new Error('proof-too-large');
    flow.proof = { name: file.name, image };
    $('#donation-proof-preview').innerHTML = `<img src="${image}" alt="Pratinjau bukti donasi"><span>${esc(file.name)}</span>`;
    $('#donation-form button[type="submit"]').disabled = false;
  } catch {
    flow.proof = null;
    $('#donation-proof-preview').textContent = 'Belum ada foto bukti.';
    error.textContent = 'Foto tidak bisa diproses. Pilih foto lain yang lebih kecil.';
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-flow]');
  if (!button) return;
  const action = button.dataset.flow;
  if (action === 'view-receipt') {
    const log = state.logs.find(entry => entry.id === button.dataset.id && ['repair_transaction', 'donation_receipt'].includes(entry.type));
    if (log) renderCareReceipt(log);
    return;
  }
  if (action === 'close-to-activity') { $('#modal').close(); navigate('analytics'); return; }
  const flow = activeCareFlow;
  if (!flow) return;
  if (action === 'search' && flow.step === 'search') {
    const city = $('#flow-city').value;
    if (!demoCities.includes(city)) return;
    if (flow.city !== city) clearCareChoice(flow);
    flow.city = city;
    const token = ++flow.searchToken;
    $('#flow-results').innerHTML = '<div class="flow-searching" role="status"><span class="spinner"></span>Menyiapkan lokasi contoh...</div>';
    setTimeout(() => { if (activeCareFlow === flow && flow.searchToken === token) renderCareResults(); }, 300);
  }
  if (action === 'choose-location' && flow.step === 'search') {
    const partner = careDemoLocations[flow.kind].find(entry => entry.id === button.dataset.id);
    if (!partner) return;
    if (flow.partner?.id !== partner.id) clearCareChoice(flow);
    flow.partner = partner;
    if (flow.kind === 'repair') renderRepairService(); else renderDonationHandover();
  }
  if (action === 'back-search') renderCareSearch();
  if (action === 'back-service' && flow.kind === 'repair') renderRepairService();
});

document.addEventListener('submit', event => {
  const form = event.target;
  if (!['repair-service-form', 'repair-payment-form', 'donation-form'].includes(form.id)) return;
  event.preventDefault();
  const flow = activeCareFlow;
  if (!flow) return;
  const item = state.items.find(entry => entry.id === flow.itemId);
  if (!item) return;
  if (form.id === 'repair-service-form' && flow.step === 'service') {
    const data = new FormData(form);
    const service = careDemoServices.find(entry => entry.id === data.get('service'));
    if (!service) return;
    flow.service = service;
    flow.note = String(data.get('note') || '').trim().slice(0, 180);
    renderRepairPayment();
  }
  if (form.id === 'repair-payment-form' && flow.step === 'payment') {
    const method = new FormData(form).get('payment');
    if (!['qris-demo', 'transfer-demo'].includes(method)) return;
    const log = { id: careReceiptId('repair'), type: 'repair_transaction', itemId: item.id, name: item.name, partnerId: flow.partner.id, partnerName: flow.partner.name, city: flow.city, serviceId: flow.service.id, serviceName: flow.service.name, amount: flow.service.amount, note: flow.note, paymentMethod: method, isDemo: true, time: Date.now() };
    state.logs.unshift(log);
    const saved = persist();
    renderCareReceipt(log, saved);
    if (saved) toast('Ringkasan repair simulasi tersimpan di Aktivitas.');
  }
  if (form.id === 'donation-form' && flow.step === 'handover') {
    const date = String(new FormData(form).get('handedAt') || '');
    if (!flow.proof || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date > careLocalDate()) {
      $('#donation-error').textContent = 'Isi tanggal yang valid dan unggah foto bukti terlebih dahulu.';
      return;
    }
    flow.handedAt = date;
    const log = { id: careReceiptId('donasi'), type: 'donation_receipt', itemId: item.id, name: item.name, stationId: flow.partner.id, stationName: flow.partner.name, city: flow.city, handedAt: date, proofName: flow.proof.name, proofImage: flow.proof.image, isDemo: true, time: Date.now() };
    state.logs.unshift(log);
    const saved = persist();
    renderCareReceipt(log, saved);
    if (saved) toast('Nota donasi simulasi tersimpan di Aktivitas.');
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'flow-city' && activeCareFlow?.step === 'search') {
    activeCareFlow.searchToken++;
    $('#flow-results').innerHTML = '<p class="flow-empty">Area berubah. Jalankan pencarian contoh lagi.</p>';
  }
  if (event.target.id === 'donation-proof') acceptDonationProof(event.target.files[0]);
});
