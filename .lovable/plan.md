# FAQ Structured Data Otomatis di Artikel Blog

## Tujuan
Artikel blog yang punya section FAQ otomatis menghasilkan JSON-LD `FAQPage` di `<head>`, agar berpeluang muncul sebagai rich result FAQ di Google.

## Kondisi saat ini
- `src/pages/BlogPost.tsx` merender HTML artikel dari Supabase (`blog_posts.content`).
- Artikel `panduan-zoom-bulanan-gratis-dan-berbayar` memakai pola `<h2>FAQ</h2>` diikuti pasangan `<h3>` (pertanyaan) dan `<p>` (jawaban) — terkonfirmasi 4 item.
- JSON-LD `Article` di halaman ini sekarang ditulis sebagai `<script>` di dalam body (JSX), yang tidak dieksekusi/terbaca sebagai structured data dengan benar.
- `src/components/SEO.tsx` (react-helmet-async) sudah menerima prop `structuredData` dan menaruh script di `<head>`.

## Yang akan dibuat
1. Util baru `src/utils/extractFaqFromHtml.ts`
   - Parse HTML artikel dengan `DOMParser`.
   - Cari heading (`h2`/`h3`) yang teksnya mengandung "FAQ" (case-insensitive, mis. "FAQ", "FAQ Seputar ...").
   - Dari heading itu, iterasi elemen berikutnya: setiap `h3` jadi pertanyaan; teks `p` (dan `ul/ol`) setelahnya sampai `h3`/`h2` berikutnya jadi jawaban.
   - Berhenti saat menemui `h2` baru (akhir section FAQ).
   - Jawaban di-strip semua tag HTML → plain text, whitespace dirapikan.
   - Skip item tanpa pertanyaan atau tanpa jawaban. Return `[]` bila tidak ada FAQ.

2. `src/pages/BlogPost.tsx`
   - Hitung FAQ items dari `post.content` (memoized).
   - Pindahkan JSON-LD `Article` yang sekarang ada di body ke prop `structuredData` pada `<SEO>`.
   - Jika ada minimal 1 FAQ item, kirim array `[Article, FAQPage]` ke `structuredData` sehingga keduanya ter-render di `<head>`. Jika tidak ada FAQ, hanya `Article`.
   - Hapus blok `<script type="application/ld+json">` di body.

Tidak ada perubahan pada tampilan artikel, meta title/description, maupun konten yang sudah terindeks.

## Catatan teknis
- Format FAQPage sesuai permintaan: `mainEntity[]` berisi `Question` dengan `acceptedAnswer.Answer.text` plain text.
- `SEO.tsx` menstringify prop `structuredData` apa adanya, jadi array (multiple schema) aman tanpa mengubah komponennya.
- Parsing dilakukan client-side; crawler Google mengeksekusi JS, dan meta statis per-rute yang sudah ada tetap tidak terganggu.

## Verifikasi
- Buka `/blog/panduan-zoom-bulanan-gratis-dan-berbayar`, cek `<head>` berisi FAQPage dengan 4 item dan jawaban tanpa tag HTML.
- Cek artikel tanpa FAQ: tidak ada FAQPage.
- Setelah publish, validasi di validator.schema.org / Rich Results Test.
