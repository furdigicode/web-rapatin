# Perbaiki Preview Sosial untuk Halaman Blog

## Masalah

Saat URL artikel di-share ke Facebook (juga WhatsApp / LinkedIn / Twitter / Telegram), yang muncul adalah judul situs default (`Rapatin - Jadwalkan rapat Zoom tanpa langganan`), bukan judul artikel.

Sebab: meta tag `og:*` per-artikel di-inject `react-helmet-async` di sisi klien. Crawler sosial **tidak menjalankan JavaScript**, jadi hanya membaca `index.html` statis. Tag OG yang sudah kita tambah tetap berguna untuk Googlebot (yang menjalankan JS).

## Solusi

Buat edge function yang merender HTML berisi meta tag artikel. Nginx mengarahkan request dengan User-Agent crawler sosial ke function itu; user biasa tetap dilayani SPA seperti sekarang.

## Yang akan dibuat / diubah

### 1. Edge function baru: `supabase/functions/blog-meta/index.ts`

- Input: slug artikel (dari query `?slug=` atau path).
- Query `blog_posts` (status `published`) → ambil `title`, `meta_description` (fallback `excerpt`), `cover_image`, `published_at`, `updated_at`, `category`, `focus_keyword`, `author_name`.
- Render HTML lengkap dengan:
  - `<title>` = judul artikel
  - `<meta name="description">` = meta description / excerpt
  - `<link rel="canonical" href="https://rapatin.id/blog/{slug}">`
  - Open Graph: `og:type=article`, `og:title`, `og:description`, `og:url`, `og:image` (1200×630, fallback ke logo Rapatin di bucket `brands` jika `cover_image` kosong), `og:site_name=Rapatin`, `og:locale=id_ID`
  - `article:published_time`, `article:modified_time`, `article:section` (category), `article:tag` (dari `focus_keyword`)
  - Twitter Card: `summary_large_image` + title/description/image
  - JSON-LD `Article` schema
  - `<meta http-equiv="refresh" content="0; url=https://rapatin.id/blog/{slug}">` + link manual → kalau ada user (bukan crawler) yang nyasar ke endpoint ini, tetap diarahkan ke halaman SPA
- Slug tidak ketemu → 404 dengan meta fallback situs.
- Response headers: `Content-Type: text/html; charset=utf-8`, `Cache-Control: public, max-age=300, s-maxage=600`.

### 2. Nginx: route crawler sosial ke edge function

Tambahkan blok (sejajar dengan proxy `generate-sitemap` yang sudah ada):

```text
location ~ ^/blog/([^/]+)/?$ {
  if ($http_user_agent ~* "facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Pinterest|redditbot|SkypeUriPreview|Applebot|vkShare|W3C_Validator") {
    proxy_pass https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/blog-meta?slug=$1;
    proxy_set_header Authorization "Bearer <anon>";
    break;
  }
  try_files $uri /index.html;
}
```

### 3. Tidak ada perubahan di kode React

`SEO.tsx` dan `BlogPost.tsx` tetap. Helmet melayani Googlebot dan user biasa; edge function melayani crawler sosial.

## Konfigurasi (sudah dikonfirmasi user)

- Gambar OG: pakai `cover_image` artikel. Jika kosong → fallback ke **logo Rapatin** dari bucket `brands` (URL publik Supabase Storage).
- Canonical & og:url: `https://rapatin.id/blog/{slug}`.

## Catatan setelah deploy

- Facebook & WhatsApp **cache preview lama**. Force refresh: <https://developers.facebook.com/tools/debug/> → tempel URL artikel → **Scrape Again**. WhatsApp cache lebih agresif (~7 hari) — workaround: tambah query string dummy (`?v=2`) ketika test.
- Untuk artikel baru, pastikan `cover_image` minimal 1200×630 px supaya preview Facebook tampil sebagai "large image card", bukan thumbnail kecil.
