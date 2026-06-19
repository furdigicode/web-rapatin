# Fix: Meta description dari editor blog tidak ter-apply

## Akar masalah

Inspect DOM live blog post menunjukkan 2 tag `<meta name="description">`:
- Tag pertama dari `index.html` (statis): `"Bayar hanya untuk yang kamu gunakan..."`
- Tag kedua dari Helmet (`data-rh="true"`): `"Pelajari cara membuat landing page webinar..."` ← yang benar dari editor

`react-helmet-async` hanya **append** meta tag baru dan tidak menghapus tag statis yang sudah ada di `index.html`. Browser/Google membaca tag pertama, jadi meta description dari editor diabaikan. Tag `<title>` ter-replace dengan benar karena `<title>` unik di `<head>`.

Masalah yang sama terjadi pada `og:title` dan `og:description`.

## Yang akan diubah

**File: `index.html`** — Hapus meta tag berikut yang sudah di-handle per-route oleh komponen `SEO`:
- `<meta name="description">` (line 8)
- `<meta property="og:title">` (line 61)
- `<meta property="og:description">` (line 62)
- `<meta property="og:type">` (line 63)
- `<meta property="og:image">` (line 64)
- `<meta name="twitter:card">` (line 66)
- `<meta name="twitter:site">` (line 67)
- `<meta name="twitter:image">` (line 68)

## Yang dipertahankan di `index.html`

- `<title>` (sebagai fallback sebelum Helmet hydrate; tetap di-replace dengan benar karena unik)
- `<meta charset>`, `<meta name="viewport">`
- `<meta name="author">`
- JSON-LD WebSite schema
- Preconnect/dns-prefetch, font links, GTM, GA, favicon, cache headers

## Dampak

- Per-route `meta description`, `og:title`, `og:description`, `og:image`, `twitter:*` dari komponen `<SEO>` menjadi satu-satunya sumber → editor SEO blog (`meta_description`, `seo_title`, `focus_keyword`) ter-apply dengan benar.
- Social crawler non-JS (LinkedIn/Facebook) akan tetap mendapat `<title>` statis sebagai fallback, tapi tidak akan dapat `og:image` default. Trade-off ini wajar karena setiap halaman publik sudah punya `<SEO>` sendiri (Index, Blog, BlogPost, dll).

## Verifikasi

Setelah edit, jalankan ulang inspeksi DOM pada blog post target — hanya boleh ada satu `<meta name="description">` dan isinya harus dari `meta_description` editor.
