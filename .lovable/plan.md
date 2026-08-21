# Tambah Hyperlink di Editor Ketentuan Hadiah

Editor ketentuan hadiah (Survey Builder) mendapat tombol tautan, sehingga teks bisa disematkan hyperlink.

## Perilaku

- Toolbar editor dapat tombol ikon rantai (Link) dan ikon lepas-tautan (Unlink).
- Pilih teks lalu klik Link → muncul prompt kecil untuk mengisi URL (default `https://`); kosongkan untuk menghapus tautan.
- Tautan tersimpan dengan `target="_blank"` dan `rel="noopener noreferrer nofollow"`.
- Tombol Unlink aktif hanya saat kursor berada di dalam tautan.
- Di halaman publik `/survei/:slug`, tautan pada ketentuan tampil dan bisa diklik (tag `a` dan atribut `href`/`target`/`rel` sudah diizinkan oleh sanitasi yang ada), dengan gaya underline warna primary.

## Detail teknis

- Paket baru: `@tiptap/extension-link`.
- `src/components/admin/RichTextField.tsx`: tambah extension `Link` (autolink aktif, `openOnClick: false`, `protocols: ['http','https','mailto']`, HTMLAttributes target/rel), plus dua tombol toolbar memakai `setLink`/`unsetLink`.
- `src/pages/SurveyDetail.tsx`: tambah styling kelas untuk `a` di blok ketentuan (`[&_a]:text-primary [&_a]:underline`). Sanitasi DOMPurify tidak perlu diubah.
