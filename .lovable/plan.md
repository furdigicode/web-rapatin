## Tambah field "URL Gambar Header" pada KirimChat Rules

Menambahkan opsi gambar header untuk rule yang mengirim template berformat gambar (mis. `promo_with_image`).

### 1. Database
Migration baru menambah kolom di `kirimchat_rules`:

```sql
ALTER TABLE public.kirimchat_rules
  ADD COLUMN IF NOT EXISTS header_image_url text;
```

Nullable — hanya diisi bila template punya header gambar.

### 2. Form Admin (`src/pages/admin/KirimchatRules.tsx`)
- Tambah field opsional **URL Gambar Header (opsional)** di dialog Tambah/Edit, di bawah baris Template Name / Language.
- Validasi zod: `header_image_url: z.string().trim().url("URL tidak valid").max(2000).optional().or(z.literal(""))`.
- Kirim `null` ke DB bila kosong.
- Tampilkan kolom kecil di tabel? Tidak — cukup indikator ikon gambar bila terisi agar tabel tetap ringkas (badge "img" pada kolom Template).

### 3. Edge function `kirimchat-webhook` — builder payload template
Update `sendTemplate(...)` agar menerima `headerImageUrl?: string` dan membangun body sesuai contoh user:

```ts
const components: any[] = [];
if (headerImageUrl) {
  components.push({
    type: "header",
    parameters: [{ type: "image", image: { link: headerImageUrl } }],
  });
}
// body parameters tetap kosong/diisi nanti jika ada fitur variable
const body = {
  phone_number: phone,
  channel: "whatsapp",
  message_type: "template",
  template: {
    name: template_name,
    language: { code: template_language },
    ...(components.length ? { components } : {}),
  },
};
```

Caller meneruskan `matched.header_image_url` ke helper.

### 4. Types
Regenerasi `src/integrations/supabase/types.ts` otomatis ikut migration; interface `Rule` di halaman ditambah `header_image_url: string | null`.

### 5. Verifikasi
- Buat/edit rule, isi URL gambar → tersimpan.
- Trigger webhook cocok → edge function mengirim payload template dengan `components.header.image.link` sesuai input.
- Rule tanpa URL tetap berjalan seperti sebelumnya (tanpa `components`).
