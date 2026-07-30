## Tujuan

Agar `<title>`, `meta description`, canonical, dan Open Graph setiap halaman marketing benar-benar ada di **HTML mentah** (bukan hanya di-inject JS lewat Helmet), sehingga Google dan crawler sosial selalu membaca judul yang benar — termasuk `/sewa-zoom-harian` yang sempat tampil dengan judul homepage.

Arsitektur tetap SPA (Vite + React Router). Tidak ada migrasi framework, risiko regresi minimal.

## Cara kerja

Saat build, sebuah script menghasilkan satu file HTML per rute marketing dari `dist/index.html`, dengan blok `<head>` yang sudah diganti sesuai halaman:

```text
dist/index.html                      -> meta homepage
dist/sewa-zoom-harian/index.html     -> meta "Sewa Zoom Harian ..."
dist/fitur/bayar-sesuai-pakai/index.html
dist/fitur/dashboard/index.html
dist/fitur/rekaman-cloud/index.html
dist/fitur/laporan-peserta/index.html
```

Semua file memuat bundle JS yang sama, jadi aplikasi tetap berjalan normal; hanya bagian `<head>` yang berbeda per URL. Crawler yang tidak menjalankan JS langsung melihat meta yang benar; browser pengguna tetap mendapat SPA penuh.

## Langkah implementasi

1. **Sumber data meta terpusat** — buat `scripts/seo-routes.ts` berisi daftar rute marketing beserta `title`, `description`, `canonical`, `ogTitle/ogDescription`, dan `ogImage`. Nilainya disalin dari komponen `<SEO>` yang sudah ada di tiap halaman agar tidak berubah dari kondisi yang sudah ranking.
2. **Script prerender** — `scripts/prerender-meta.ts` membaca `dist/index.html`, mengganti tag head (title, description, canonical, og:*, twitter:*) per rute, lalu menulis `dist/<path>/index.html`. Ada konstanta batas jumlah halaman agar output build tetap kecil.
3. **Wiring build** — tambahkan `postbuild` di `package.json` supaya script berjalan otomatis setelah `vite build`.
4. **Sinkronisasi Helmet** — komponen `<SEO>` tetap dipakai (untuk navigasi client-side), tapi nilai title/description halaman marketing diambil dari sumber yang sama agar tidak ada perbedaan antara HTML statis dan hasil render JS (perbedaan bisa memicu Google menampilkan judul lain).
5. **Canonical & og:url self-referencing** — pastikan setiap halaman menunjuk URL-nya sendiri (`https://rapatin.id/sewa-zoom-harian`), bukan homepage. Ini penyebab umum Google memilih judul homepage.
6. **Sitemap** — pastikan seluruh rute yang di-prerender ada di sitemap.
7. **Verifikasi** — setelah build, cek `curl` HTML mentah tiap rute untuk memastikan title/description sudah benar tanpa JS.

## Catatan teknis

- Halaman dinamis (`/blog/:slug`, `/quick-order/:slug`, `/voting/:slug`) **tidak** termasuk cakupan ini sesuai pilihan Anda; halaman tersebut tetap mengandalkan Helmet (Googlebot merender JS, tapi preview Facebook/LinkedIn masih memakai meta default). Bisa ditangani terpisah nanti.
- Tidak ada dependency berat baru (tanpa headless browser); hanya script Node kecil.
- Setelah deploy, hasil di Google butuh waktu — minta re-crawl lewat URL Inspection di Search Console untuk mempercepat.
