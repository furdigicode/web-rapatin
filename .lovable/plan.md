## Apakah analisis Hermes salah?

**Sebagian besar salah, tapi ada satu poin valid.**

### Yang sudah benar di project (Hermes keliru):
1. ✅ `react-helmet-async` sudah terpasang, `HelmetProvider` aktif di `App.tsx`.
2. ✅ Komponen `<SEO>` (`src/components/SEO.tsx`) sudah generate `<title>`, `description`, canonical, OG, Twitter, JSON-LD per halaman.
3. ✅ `BlogPost.tsx` **sudah** render `<SEO>` dinamis (title, description, cover image, canonical, og:type=article, author, publishedTime).
4. ✅ Hampir semua halaman publik sudah pakai `<SEO>` (Index, Blog, BlogPost, Kontak, TentangKami, FAQ, MeetingScheduling, SewaZoomHarian, EventManagement, Feedback, MenjadiReseller, Kebijakan/Syarat, VotingDetail, semua `fitur/*`).

### Yang valid dari analisis Hermes (bug nyata):

**BlogPost.tsx mengabaikan field SEO yang admin isi.** Lihat baris 270–281:

```tsx
<SEO
  title={`${post.title} | Rapatin Blog`}        // ❌ pakai title, bukan seo_title
  description={metaDescription}                  // ❌ generate dari content, bukan meta_description
  keywords={keywords}                            // ❌ generate dari title+category, bukan focus_keyword
  ...
/>
```

Padahal tabel `blog_posts` punya kolom `seo_title`, `meta_description`, `focus_keyword` yang diisi admin lewat `SEOPanel.tsx`. Field-field itu **tidak pernah dipakai** saat render publik — sia-sia.

Halaman publik yang benar-benar belum punya `<SEO>` cuma 4: `Appointment`, `QuickOrder`, `QuickOrderDetail`, `NotFound`.

---

## Bagaimana `focus_keyword` bekerja sekarang

`focus_keyword` di `blog_posts` (tipe `text`, nullable) saat ini **hanya dipakai untuk scoring SEO di admin**, tidak pernah keluar ke HTML publik.

Alur di `src/components/admin/SEOPanel.tsx`:

1. Admin mengetik focus keyword di form artikel.
2. `checkSEO()` menghitung skor 0–100 berdasarkan:
   - keyword muncul di SEO title → +10
   - keyword muncul di meta description → +10
   - keyword muncul di body content → +10
   - keyword diisi sama sekali → +10
3. Skor ditampilkan sebagai progress bar + saran ("Focus keyword tidak ditemukan di…").
4. Nilai disimpan ke `blog_posts.focus_keyword`.
5. Saat artikel di-render di `/blog/:slug`, **field ini diabaikan** — `BlogPost.tsx` malah generate `keywords` sendiri dari `title + category`.

**Catatan SEO modern:** meta `keywords` sudah lama tidak dipakai Google sebagai ranking factor. Focus keyword tetap berguna sebagai **alat editorial internal** (memastikan judul/deskripsi/konten konsisten menyebut kata kunci utama) — bukan sesuatu yang harus muncul di `<meta name="keywords">`. Jadi cara terbaik memakai `focus_keyword` adalah: (a) tetap dipakai untuk scoring, dan (b) opsional dipakai sebagai input pertama ke meta `keywords` jika user mau, tapi prioritas utama justru `seo_title` dan `meta_description`.

---

## Rencana perbaikan

### 1. Perbaiki BlogPost.tsx — pakai field admin
Ubah props `<SEO>` agar prioritaskan kolom yang admin isi, dengan fallback ke nilai generated:

```tsx
title={post.seo_title || `${post.title} | Rapatin Blog`}
description={post.meta_description || generateMetaDescription(post.content, post.excerpt)}
keywords={post.focus_keyword || generateKeywords(post.title, post.category)}
```

Tambahkan `seo_title, meta_description, focus_keyword` ke `select()` query Supabase di file yang sama (saat ini hanya ambil sebagian kolom).

### 2. Tambah `<SEO>` ke 4 halaman publik yang belum punya

| Halaman | Title | Description |
|---|---|---|
| `Appointment.tsx` | Appointment Booking Online — Rapatin | Sistem booking janji temu online untuk konsultan, dokter, dan profesional. Kelola jadwal otomatis. |
| `QuickOrder.tsx` | Quick Order Zoom Meeting — Rapatin | Pesan Zoom instan tanpa daftar. Bayar sekali pakai, link dikirim ke WhatsApp & email. |
| `QuickOrderDetail.tsx` | Detail Pesanan #{order_number} — Rapatin | Status pembayaran dan detail meeting quick order. (canonical pakai `access_slug`, bukan UUID — sesuai core memory) |
| `NotFound.tsx` | Halaman Tidak Ditemukan — Rapatin | Halaman tidak ditemukan. Kembali ke beranda Rapatin. (set `noindex`) |

### 3. Tambah prop `noindex?: boolean` ke `SEO.tsx`
Default `index, follow`; bila `noindex=true` render `noindex, follow`. Dipakai oleh `NotFound`.

### 4. `index.html` tidak diubah
Tag statik di sana tetap berfungsi sebagai fallback untuk social crawler yang tidak eksekusi JS (LinkedIn, Slack). Best practice Lovable head-meta.

### Out of scope
- Tidak mengubah `Sitemap.tsx`/`SitemapXML.tsx` (utility route).
- Tidak install package, tidak migrasi DB, tidak edge function.

## Verifikasi
1. Buka 1 artikel blog, inspect `<head>`: konfirmasi `<title>` dan `<meta name="description">` cocok dengan `seo_title` / `meta_description` yang admin isi.
2. Buka `/appointment`, `/quick-order`, halaman 404 → cek title & description unik.
3. View source `/404` → cek `<meta name="robots" content="noindex, follow">`.