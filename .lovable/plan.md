## Konteks

Di `src/pages/BlogPost.tsx` sebenarnya **sudah ada tombol social sharing** (Email, WhatsApp, Telegram, Facebook, Twitter, Copy Link) di header artikel. Tapi implementasinya masih minimal dan **belum dioptimalkan untuk SEO/social crawler**. Yang akan kita tingkatkan:

1. Memperkuat sinyal social sharing yang dibaca crawler (Open Graph + Twitter Card lengkap).
2. Memastikan link yang dibagikan menampilkan preview kaya (judul, deskripsi, gambar, author).
3. Menambah opsi share yang relevan + UX yang lebih baik (toast feedback, share count area, sticky share bar opsional).
4. Menambah structured data `SocialMediaPosting` / memperkuat `Article` schema dengan `sharedContent`.

> Catatan penting: Social share button **tidak langsung** menaikkan ranking Google (social signals bukan ranking factor langsung). Yang berdampak ke SEO adalah:
> - Distribusi → potensi backlink & traffic referral
> - Rich preview yang akurat → CTR lebih tinggi saat dibagikan
> - Structured data yang lengkap → eligibility untuk rich results

## Rencana Perubahan

### 1. Lengkapi meta tags untuk social sharing (`src/components/SEO.tsx`)
Pastikan setiap artikel mengirim:
- `og:title`, `og:description`, `og:image` (dengan dimensi `og:image:width=1200`, `og:image:height=630`, `og:image:alt`)
- `og:type=article`, `og:site_name=Rapatin`, `og:locale=id_ID`
- `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag` (dari `focus_keyword`)
- `twitter:card=summary_large_image`, `twitter:site=@rapatin`, `twitter:creator`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`

### 2. Refactor tombol share jadi komponen baru: `src/components/blog/SocialShareBar.tsx`
- Pindahkan tombol-tombol share dari `BlogPost.tsx` ke komponen sendiri.
- Tambah platform: **LinkedIn** (penting untuk konten B2B/SEO), **Threads** (sudah ada handler tapi belum ada tombol).
- Setiap link share menggunakan URL canonical artikel (bukan `window.location.href`) supaya parameter tracking tidak ikut.
- Tambahkan `aria-label` deskriptif untuk accessibility (juga sinyal SEO).
- Toast notification saat copy link berhasil (pakai `sonner` yang sudah terpasang).
- Opsi: sticky floating share bar di sisi kiri untuk desktop (umum di blog SEO-friendly seperti Medium/HubSpot).

### 3. Tambahkan structured data tambahan di `BlogPost.tsx`
Perkuat JSON-LD `Article` yang sudah ada dengan:
- `keywords` dari `focus_keyword`
- `inLanguage: "id-ID"`
- `wordCount` (dihitung dari content)
- `potentialAction` tipe `ShareAction` (memberi tahu crawler bahwa artikel ini shareable)

### 4. Tracking share (opsional, butuh konfirmasi)
Jika diinginkan: kirim event ke analytics/Meta Pixel saat user klik share — berguna untuk mengukur konten mana yang paling banyak dishare. Tidak menyentuh database.

## File yang Disentuh

- `src/components/SEO.tsx` — tambah OG image dimensions, locale, twitter handle, article:tag
- `src/components/blog/SocialShareBar.tsx` — file baru (komponen share bar)
- `src/pages/BlogPost.tsx` — pakai `SocialShareBar`, perkuat JSON-LD, kirim `focus_keyword` sebagai `article:tag`

## Yang Perlu Dikonfirmasi

1. **Sticky floating share bar di desktop** (selain tombol di header) — tambah atau cukup tombol di header saja?
2. **Tambah LinkedIn & Threads** sebagai platform share?
3. **Twitter handle Rapatin** — apa handle resminya (untuk `twitter:site` & `twitter:creator`)?
4. **Tracking klik share** ke Meta Pixel — perlu atau skip dulu?