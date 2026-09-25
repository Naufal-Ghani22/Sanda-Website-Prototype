# SANDA prototype

Prototipe browser untuk demo final BPC. Buka `dist/index.html` langsung, atau jalankan `python -m http.server 4173 --directory dist` dari folder ini dan buka http://127.0.0.1:4173. Tidak memerlukan instalasi paket atau build.

## Alur demonstrasi

1. Beranda → Scan pakaian → Pilih foto atau contoh → Konfirmasi detail → Simpan.
2. Outfit → kegiatan, gaya, cuaca → susun → catat pemakaian. Kamu bisa juga mencatat pemakaian satu item dari Lemari saya.
3. Cek belanja → kategori dan warna → lihat kesamaan dan calon pasangan. Hasil cek tercatat di Aktivitas.
4. Perawatan → pilih pakaian, baca panduan → simpan rencana repair, upcycle, atau donasi.
5. Aktivitas → lihat jejak empat langkah di atas atau mulai tantangan 7 hari. Setiap hari berbeda dengan pemakaian tercatat menambah progres.

Beranda menunjukkan progres empat langkah dan langkah berikutnya. Di HP, navigasi bawah menampilkan Beranda, Lemari, Scan, Outfit, dan Lainnya (Cek belanja, Perawatan, Aktivitas).

## Deploy melalui GitHub ke Vercel

Repositori ini sudah disiapkan sebagai situs statis. `vercel.json` menunjuk `dist` sebagai output. Setelah perubahan masuk ke branch GitHub yang akan dipakai, di Vercel pilih **Add New → Project**, impor `Naufal-Ghani22/Sanda-Website-Prototype`, lalu deploy. Gunakan root directory repositori (`./`); framework **Other** dan tidak perlu build command. Output Directory seharusnya terbaca `dist` dari `vercel.json`. Setiap push berikutnya ke branch produksi akan memperbarui situs.

## Batas demo

Unggahan foto berfungsi. Pengenalan AI belum tersambung; kategori, warna, bahan dikonfirmasi manual. Rekomendasi memakai aturan kategori, kegiatan, cuaca pilihan pengguna, dan frekuensi pemakaian. Foto dan data hanya tersimpan pada browser/perangkat yang sama. Tidak ada akun, pembayaran, cuaca langsung, pengiriman foto ke server, pemesanan mitra, atau perhitungan karbon. Foto katalog dan foto pengguna adalah aset ilustrasi AI.

Tombol Atur ulang demo menghapus data lokal sesudah konfirmasi. Browser dengan penyimpanan terbatas akan menampilkan pemberitahuan; data sesi tetap dapat dicoba.

## Arah visual

Identitas oranye dan logo asli SANDA, latar putih dan abu kehijauan untuk fokus pada pakaian. Manrope untuk judul, DM Sans untuk label; Arial cadangan offline. Desktop menggunakan navigasi samping, HP menggunakan menu bawah. Produk langsung membuka lemari, dengan scan sebagai langkah utama. Gambar katalog menjadi isi koleksi, bukan dekorasi.

## Pemeriksaan

`check-demo.cjs` menguji perjalanan utama menggunakan Playwright pada server lokal. `preview-desktop.png` dan `preview-mobile.png` menyimpan hasil pemeriksaan tampilan.
