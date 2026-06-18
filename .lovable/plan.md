## Tujuan
Lengkapi hero section halaman `/sewa-zoom-harian` agar setara dengan landing page lain (ada label badge + CTA), tanpa mengubah elemen SEO penting (H1, paragraf konten, struktur heading).

## Perubahan
File: `src/components/meeting/SewaZoomHarianSection.tsx`

1. **Tambah badge** di atas H1, mengikuti pola hero lain (`bg-accent/70 rounded-full` + teks primary kecil):
   - Teks: `Platform Zoom Harian Pay-as-you-go`

2. **Tambah dua tombol CTA** di bawah H1 (setelah dua paragraf intro, sebelum kartu "Kenapa Memilih Rapatin"):
   - Primary: `Lihat Harga` → scroll ke `#pricing` (section pricing sudah ada di `SewaZoomHarian.tsx` dengan `id="pricing"`)
   - Secondary (outline): `Pesan Sekarang` → membuka `OrderOptionModal` (reuse handler `handleRegistration` yang sudah ada) supaya CTA utama konversi tetap tersedia di atas fold

   Tombol "Lihat Harga" pakai `<a href="#pricing">` (native anchor) agar tetap crawl-friendly.

## Catatan SEO
- H1, urutan heading (H1 → H2), dan seluruh paragraf konten tidak diubah → tidak mempengaruhi indexing yang sudah baik.
- Badge hanya `<span>` dekoratif, bukan heading.
- CTA `Lihat Harga` adalah `<a>` internal anchor, aman untuk crawler.
- Tidak ada perubahan meta/SEO tag, tidak ada perubahan title/description.

## Validasi
Cek visual via preview di `/sewa-zoom-harian` (mobile + desktop): badge muncul di atas H1, dua CTA di bawah paragraf intro, klik "Lihat Harga" scroll ke section pricing, klik "Pesan Sekarang" membuka modal order.
