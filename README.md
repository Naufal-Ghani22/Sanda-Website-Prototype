# SANDA prototype

Prototipe browser untuk demo final BPC. Buka `dist/index.html` langsung, atau jalankan `python -m http.server 4173 --directory dist` dari folder ini dan buka http://127.0.0.1:4173. Tidak memerlukan instalasi paket atau build.

## Alur demonstrasi

1. Beranda → Scan pakaian → Pilih foto atau contoh → Konfirmasi detail → Simpan.
2. Outfit → kegiatan, gaya, cuaca → susun → catat pemakaian. Kamu bisa juga mencatat pemakaian satu item dari Lemari saya.
3. Cek belanja → kategori dan warna → lihat kesamaan dan calon pasangan. Hasil cek gratis tercatat di Aktivitas. Setelah itu, coba pratinjau SANDA Plus: isi harga, opsional unggah foto dan tautan produk, lalu lihat tiga padanan dari lemari serta simulasi biaya untuk 10, 20, dan 30 kali pakai.
4. Perawatan → pilih pakaian dan baca panduan. Untuk repair: cari penjahit contoh berdasarkan area, pilih layanan, tinjau estimasi serta metode bayar demo, lalu simpan ringkasan. Untuk donasi: cari stasiun contoh, catat tanggal penyerahan, unggah foto bukti, lalu buat nota simulasi. Upcycle tetap berupa rencana pribadi.
5. Aktivitas → buka kembali ringkasan repair atau nota donasi, lihat jejak penggunaan, dan mulai tantangan 7 hari. Setiap hari berbeda dengan pemakaian tercatat menambah progres.

Beranda menunjukkan progres empat langkah dan langkah berikutnya. Di HP, navigasi bawah menampilkan Beranda, Lemari, Scan, Outfit, dan Lainnya (Cek belanja, Perawatan, Aktivitas).

## Deploy melalui GitHub ke Vercel

Repositori ini sudah disiapkan sebagai situs statis. `vercel.json` menunjuk `dist` sebagai output. Setelah perubahan masuk ke branch GitHub yang akan dipakai, di Vercel pilih **Add New → Project**, impor `Naufal-Ghani22/Sanda-Website-Prototype`, lalu deploy. Gunakan root directory repositori (`./`); framework **Other** dan tidak perlu build command. Output Directory seharusnya terbaca `dist` dari `vercel.json`. Setiap push berikutnya ke branch produksi akan memperbarui situs.

## Batas demo

Unggahan foto berfungsi. Pengenalan AI dan pembacaan label melalui kamera belum tersambung; kategori serta warna dikonfirmasi manual. Komposisi bahan dibaca dari teks label yang disalin pengguna. Parser menerima nama serat dalam bahasa Indonesia atau Inggris, memeriksa jumlah persentase 100%, dan membedakan serat dari jenis kain seperti denim atau rajut. Data lama dan contoh tidak dianggap telah diverifikasi dari label. Instruksi cuci, kering, dan setrika pada label fisik selalu lebih utama daripada panduan umum situs. Rekomendasi outfit memakai aturan kategori, kegiatan, cuaca pilihan pengguna, dan frekuensi pemakaian. Pratinjau Plus memakai kategori dan frekuensi pemakaian untuk menyusun padanan; hasilnya bukan penilaian gaya otomatis. Biaya per pemakaian hanya harga dibagi jumlah pemakaian asumsi, bukan prediksi. Tautan produk tidak dibaca atau diimpor. Foto incaran di Plus hanya dipakai selama sesi analisis dan tidak disimpan. Penjahit dan stasiun donasi adalah data contoh per area yang dipilih manual: bukan hasil GPS atau pencarian lokasi terdekat, bukan alamat/kontak nyata, dan belum ada kemitraan atau pemesanan. Harga layanan dan metode bayar adalah simulasi; tidak ada dana yang berpindah. Nota donasi mencatat laporan pengguna dan foto yang diunggah, bukan konfirmasi penerimaan dari stasiun atau bukti resmi. Foto bukti diperkecil dan disimpan di browser/perangkat yang sama bersama data lemari. Tidak ada akun, pembayaran nyata, cuaca langsung, pengiriman foto ke server, atau perhitungan karbon. Foto katalog dan foto perawatan adalah aset ilustrasi AI.

Tombol Atur ulang demo menghapus data lokal sesudah konfirmasi. Browser dengan penyimpanan terbatas akan menampilkan pemberitahuan; data sesi tetap dapat dicoba.

## Arah visual

Identitas oranye dan logo asli SANDA, dengan elemen 3D yang diberikan pemilik sebagai fokus beranda. Halaman Perawatan memakai tiga foto editorial yang dibuat untuk demo: mencuci, mengeringkan, dan memperbaiki pakaian. Manrope untuk judul, DM Sans untuk label; Arial cadangan offline. Desktop menggunakan navigasi samping, HP menggunakan menu bawah. Produk langsung membuka lemari, dengan scan sebagai langkah utama.

Arah desain: prototipe lemari digital untuk juri dan pengguna muda, hangat-editorial, dengan ENERGY 2 / RHYTHM 2 / MOTION 1. Latar hijau tua pada hero memberi kontras bagi mark emas-oranye milik SANDA; foto perawatan menunjukkan tindakan nyata, bukan dekorasi abstrak. Manrope memberi judul yang ramah namun tegas, DM Sans menjaga formulir tetap mudah dibaca. Halaman Perawatan memakai satu foto utama dan dua cerita foto pendukung agar pilihan pengguna tetap menjadi fokus.

Alur baru memakai kartu repair oranye untuk menonjolkan keputusan berbiaya, kartu donasi hijau untuk tindakan meneruskan pakaian, dan tahap bernomor karena prosesnya benar-benar berurutan. Rincian biaya ditampilkan sebagai baris transaksi; garis putus pada nota menandai batas dokumen simulasi. Di HP, dialog menjadi layar penuh agar formulir, bukti, dan tombol tetap terbaca tanpa tertutup navigasi bawah. Tipografi tetap Manrope/DM Sans supaya alur baru terasa satu produk dengan halaman SANDA lain.

## Pemeriksaan

`check-demo.cjs` menguji perjalanan utama menggunakan Playwright pada server lokal. `check-material.cjs` menguji logika komposisi; `check-care-ui.cjs` menguji tampilan perawatan dan pengisian label. `check-plus.cjs` menguji logika padanan serta biaya per pemakaian; `check-plus-ui.cjs` menguji alur Plus dan lebar HP. `check-partners-ui.cjs` menguji pencarian area dan status unggahan yang salah. `check-care-transactions-ui.cjs` menguji rincian pembayaran demo, unggah bukti, nota, penyimpanan, serta tampilan HP. Berkas `preview-*.png` menyimpan hasil pemeriksaan tampilan.

Rujukan untuk pendekatan label-first: [FTC Apparel and Labeling](https://www.ftc.gov/news-events/topics/tools-consumers/apparel-labeling) dan [FTC Care Labeling Rule](https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule).
