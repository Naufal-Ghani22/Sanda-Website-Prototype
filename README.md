# SANDA prototype

Prototipe browser untuk demo final BPC. Buka `dist/index.html` langsung, atau jalankan `python -m http.server 4173 --directory dist` dari folder ini dan buka http://127.0.0.1:4173.

## Alur demonstrasi

1. Beranda → Scan pakaian → Pilih foto atau contoh → Konfirmasi detail → Simpan.
2. Lemari saya → detail pakaian → catat dipakai atau buka perawatan.
3. Outfit → kegiatan, gaya, cuaca → susun → catat pemakaian.
4. Cek belanja → kategori dan warna → lihat kesamaan dan calon pasangan.
5. Perawatan → rencana repair, upcycle, donasi → tersimpan di Aktivitas.
6. Aktivitas → mulai tantangan 7 hari. Setiap hari berbeda dengan pemakaian tercatat menambah progres.

## Batas demo

Unggahan foto berfungsi. Pengenalan AI belum tersambung; kategori, warna, bahan dikonfirmasi manual. Rekomendasi memakai aturan kategori, kegiatan, cuaca pilihan pengguna, dan frekuensi pemakaian. Foto dan data hanya tersimpan pada browser/perangkat yang sama. Tidak ada akun, pembayaran, cuaca langsung, pengiriman foto ke server, pemesanan mitra, atau perhitungan karbon. Foto katalog dan foto pengguna adalah aset ilustrasi AI.

Tombol Atur ulang demo menghapus data lokal sesudah konfirmasi. Browser dengan penyimpanan terbatas akan menampilkan pemberitahuan; data sesi tetap dapat dicoba.

## Arah visual

Identitas oranye dan logo asli SANDA, latar putih dan abu kehijauan untuk fokus pada pakaian. Manrope untuk judul, DM Sans untuk label; Arial cadangan offline. Desktop menggunakan navigasi samping, HP menggunakan menu bawah. Produk langsung membuka lemari, dengan scan sebagai langkah utama. Gambar katalog menjadi isi koleksi, bukan dekorasi.

## Pemeriksaan

`check-demo.cjs` menguji perjalanan utama menggunakan Playwright pada server lokal. `preview-desktop.png` dan `preview-mobile.png` menyimpan hasil pemeriksaan tampilan.
