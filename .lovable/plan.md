# Hilangkan Tiptap agar `npm run build` di server sukses

Penyebab gagalnya build: `@tiptap/react` (dan `dompurify`) sudah ada di `package.json` tapi belum terpasang di server — `git pull` tidak menginstal dependensi baru. Sesuai pilihan Anda, editor ketentuan hadiah dipindah ke editor yang sudah dipakai blog, sehingga tidak ada paket baru sama sekali dan build server tidak perlu install apa pun.

## Perubahan

- Ketentuan hadiah di Survey Builder memakai `RichTextEditor` (textarea HTML seperti editor blog): admin menulis HTML `<strong>`, `<em>`, `<u>`, `<ul>/<ol><li>`, dan `<a href="...">` untuk hyperlink.
- Hapus komponen `RichTextField.tsx` (berbasis Tiptap).
- Hapus paket `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-link`, dan `dompurify` dari `package.json`.
- Halaman publik `/survei/:slug` tetap menampilkan ketentuan hadiah dengan aman: sanitasi HTML diganti utilitas kecil tanpa dependensi (whitelist tag `p, br, strong, b, em, i, u, ul, ol, li, a, span`, atribut `href/target/rel` saja, buang `script`/`on*`/`javascript:`), styling tautan tetap `text-primary underline`.
- Tampilan kode voucher + tombol Salin tidak berubah.

## Detail teknis

- Baru: `src/utils/sanitizeHtml.ts` — sanitasi via `DOMParser` + whitelist, memaksa `target="_blank" rel="noopener noreferrer nofollow"` pada `a`.
- `src/pages/SurveyDetail.tsx` — ganti import `DOMPurify` dengan `sanitizeHtml`.
- `src/components/admin/SurveyBuilder.tsx` — ganti `RichTextField` dengan `RichTextEditor` + label bantuan tag HTML yang didukung.
- `rm src/components/admin/RichTextField.tsx`, lalu `bun remove` paket Tiptap + dompurify (lockfile ikut diperbarui).
- Catatan deploy: agar aman ke depan, jalankan `npm install` sebelum `npm run build` di server saat ada perubahan dependensi.
