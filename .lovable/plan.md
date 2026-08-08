# Ganti URL PSE Badge ke Supabase Storage

## Tujuan
Menggunakan URL publik Supabase Storage untuk badge PSE dan dokumen PDF sertifikatnya, menggantikan CDN asset yang saat ini digunakan.

## Perubahan
1. Di `src/components/PseBadge.tsx`:
   - Ganti sumber gambar badge dari `pseBadge.url` (CDN asset) ke `https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/pse-rapatin.png`
   - Ganti sumber PDF dari `pseCertificate.url` (CDN asset) ke `https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/pse-rapatin.pdf`
2. Pertahankan semua perilaku interaksi: dialog internal, lazy loading, alt text, dan tautan unduh.

## Dampak
- Tidak ada perubahan struktur komponen atau UI.
- Badge dan pratinjau PDF kini diambil langsung dari Supabase Storage publik.

## Verifikasi
- Build lulus tanpa error.
- Klik badge di footer membuka dialog PDF dan tampilkan sertifikat dengan benar.
