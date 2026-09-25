# SANDA prototype

Prototipe browser untuk demo final BPC. Buka `dist/index.html` langsung, atau jalankan `python -m http.server 4173 --directory dist` dari folder ini dan buka http://127.0.0.1:4173. Tidak memerlukan instalasi paket atau build.

## Alur demonstrasi

1. Beranda → Scan pakaian → Pilih foto atau contoh → Konfirmasi detail → Simpan.
2. Outfit → kegiatan, gaya, cuaca → susun → catat pemakaian. Kamu bisa juga mencatat pemakaian satu item dari Lemari saya.
3. Cek belanja → kategori dan warna → lihat kesamaan dan calon pasangan. Hasil cek tercatat di Aktivitas.
4. Perawatan → pilih pakaian, salin komposisi serat dari label, baca panduan → simpan rencana repair, upcycle, atau donasi.
5. Aktivitas → lihat jejak empat langkah di atas atau mulai tantangan 7 hari. Setiap hari berbeda dengan pemakaian tercatat menambah progres.

Beranda menunjukkan progres empat langkah dan langkah berikutnya. Di HP, navigasi bawah menampilkan Beranda, Lemari, Scan, Outfit, dan Lainnya (Cek belanja, Perawatan, Aktivitas).

## Deploy melalui GitHub ke Vercel

Repositori ini sudah disiapkan sebagai situs statis. `vercel.json` menunjuk `dist` sebagai output. Setelah perubahan masuk ke branch GitHub yang akan dipakai, di Vercel pilih **Add New → Project**, impor `Naufal-Ghani22/Sanda-Website-Prototype`, lalu deploy. Gunakan root directory repositori (`./`); framework **Other** dan tidak perlu build command. Output Directory seharusnya terbaca `dist` dari `vercel.json`. Setiap push berikutnya ke branch produksi akan memperbarui situs.

## Batas demo

Unggahan foto berfungsi. Pengenalan AI dan pembacaan label melalui kamera belum tersambung; kategori serta warna dikonfirmasi manual. Komposisi bahan dibaca dari teks label yang disalin pengguna. Parser menerima nama serat dalam bahasa Indonesia atau Inggris, memeriksa jumlah persentase 100%, dan membedakan serat dari jenis kain seperti denim atau rajut. Data lama dan contoh tidak dianggap telah diverifikasi dari label. Instruksi cuci, kering, dan setrika pada label fisik selalu lebih utama daripada panduan umum situs. Rekomendasi outfit memakai aturan kategori, kegiatan, cuaca pilihan pengguna, dan frekuensi pemakaian. Foto dan data hanya tersimpan pada browser/perangkat yang sama. Tidak ada akun, pembayaran, cuaca langsung, pengiriman foto ke server, pemesanan mitra, atau perhitungan karbon. Foto katalog dan foto perawatan adalah aset ilustrasi AI.

Tombol Atur ulang demo menghapus data lokal sesudah konfirmasi. Browser dengan penyimpanan terbatas akan menampilkan pemberitahuan; data sesi tetap dapat dicoba.

## Arah visual

Identitas oranye dan logo asli SANDA, dengan elemen 3D yang diberikan pemilik sebagai fokus beranda. Halaman Perawatan memakai tiga foto editorial yang dibuat untuk demo: mencuci, mengeringkan, dan memperbaiki pakaian. Manrope untuk judul, DM Sans untuk label; Arial cadangan offline. Desktop menggunakan navigasi samping, HP menggunakan menu bawah. Produk langsung membuka lemari, dengan scan sebagai langkah utama.

Arah desain: prototipe lemari digital untuk juri dan pengguna muda, hangat-editorial, dengan ENERGY 2 / RHYTHM 2 / MOTION 1. Latar hijau tua pada hero memberi kontras bagi mark emas-oranye milik SANDA; foto perawatan menunjukkan tindakan nyata, bukan dekorasi abstrak. Manrope memberi judul yang ramah namun tegas, DM Sans menjaga formulir tetap mudah dibaca. Halaman Perawatan memakai satu foto utama dan dua cerita foto pendukung agar pilihan pengguna tetap menjadi fokus.

## Pemeriksaan

`check-demo.cjs` menguji perjalanan utama menggunakan Playwright pada server lokal. `check-material.cjs` menguji logika komposisi; `check-care-ui.cjs` menguji tampilan perawatan dan pengisian label. `preview-desktop.png`, `preview-mobile.png`, `preview-care-desktop.png`, dan `preview-care-mobile.png` menyimpan hasil pemeriksaan tampilan.

Rujukan untuk pendekatan label-first: [FTC Apparel and Labeling](https://www.ftc.gov/news-events/topics/tools-consumers/apparel-labeling) dan [FTC Care Labeling Rule](https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule).
