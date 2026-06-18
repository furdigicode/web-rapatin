## Tujuan

1. Tambah submenu **Templates** di KirimChat: sinkron daftar template dari API KirimChat dan simpan ke DB sebagai sumber tunggal.
2. Di Rules, kolom **Template** berubah jadi **dropdown** (bukan input teks). Field **variabel body** menyesuaikan otomatis sesuai jumlah `{{n}}` pada template terpilih.
3. Variabel mendukung **placeholder dinamis** (`{{customer_name}}`, dll.) yang disubstitusi saat runtime — fix root cause error `(#131008) Required parameter is missing`.

## 1. Database

Migration baru:
```sql
CREATE TABLE public.kirimchat_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL,                 -- id dari KirimChat (tmpl_xxx)
  template_name text NOT NULL,
  language text NOT NULL DEFAULT 'id',
  status text,
  category text,
  header_type text,
  header_content text,
  body_content text,                          -- "content" dari API
  footer_content text,
  buttons jsonb NOT NULL DEFAULT '[]'::jsonb,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  has_variables boolean NOT NULL DEFAULT false,
  variable_count integer NOT NULL DEFAULT 0,  -- dihitung dari {{n}} body
  raw jsonb,                                  -- payload mentah utk audit
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_name, language)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kirimchat_templates TO authenticated;
GRANT ALL ON public.kirimchat_templates TO service_role;
ALTER TABLE public.kirimchat_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage templates"
  ON public.kirimchat_templates FOR ALL
  USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE TRIGGER update_kirimchat_templates_updated_at
  BEFORE UPDATE ON public.kirimchat_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.kirimchat_rules
  ADD COLUMN IF NOT EXISTS body_variables jsonb NOT NULL DEFAULT '[]'::jsonb;
```

`variable_count` dihitung dari `body_content` dengan regex `/\{\{(\d+)\}\}/g` (max index).

## 2. Edge function `kirimchat-templates-sync`

Path: `supabase/functions/kirimchat-templates-sync/index.ts`

- `POST` (admin-only, verifikasi via `admin_sessions`+`is_admin_user`-style check, mirip edge function lain).
- Fetch `https://api-prod.kirim.chat/api/v1/public/templates?limit=200` dengan `Authorization: Bearer ${KIRIMCHAT_API_KEY}`.
- Iterasi `data[]`, hitung `variable_count`, upsert by `(template_name, language)`.
- Return `{ synced: n }`.

Tidak perlu fungsi list-from-API terpisah — UI baca dari tabel.

## 3. Halaman Templates `src/pages/admin/KirimchatTemplates.tsx`

- Header: tombol **Sinkron dari KirimChat** (invoke `kirimchat-templates-sync`).
- Table read-only: Nama, Bahasa, Kategori, Status, Header type, Jumlah Variabel, Diperbarui.
- Klik baris → dialog detail: header_content, body_content, footer_content, buttons (JSON), variables (JSON).
- Tidak ada create/edit manual — sumber kebenaran selalu KirimChat.

## 4. Routing & sidebar

- `src/App.tsx`: route `/admin/kirimchat-templates`.
- `src/components/admin/AdminLayout.tsx`: submenu KirimChat urutan **Webhook, Rules, Templates**.

## 5. Rules — template jadi dropdown + variabel dinamis

File: `src/pages/admin/KirimchatRules.tsx`

- Load `kirimchat_templates` saat dialog dibuka.
- Field lama `template_name` + `template_language` (2 input teks) → **1 Select** berisi `template_name (language) — category`. Value menyimpan `{template_name, template_language}` di state.
- Setelah pilih template, baca `variable_count`:
  - Render N input "Variabel `{{1}}`", "Variabel `{{2}}`", …
  - Tiap input bebas isi literal atau placeholder seperti `{{customer_name}}`.
  - Tampilkan helper text daftar placeholder yang tersedia.
- Tampilkan preview body template (`body_content`) di bawah Select, dengan token `{{n}}` di-highlight.
- Validasi zod:
  - `template_name`, `template_language` tetap di schema (diisi dari pilihan).
  - `body_variables: z.array(z.string().max(500)).max(20)` — panjangnya harus `>= variable_count` saat submit.
- DB tetap menyimpan `template_name` + `template_language` agar edge function tidak perlu join (cukup ringan untuk skala saat ini).

Migrasi rule lama: kolom `body_variables` default `[]` → rule existing tetap jalan; admin perlu edit untuk mengisi variabel sesuai template.

## 6. Edge function `kirimchat-webhook` — kirim variabel

File: `supabase/functions/kirimchat-webhook/index.ts`

- Bangun context dari payload:
  ```ts
  const ctx = {
    customer_name: pick(body, ["data.customer_name", "data.contacts.0.profile.name"]) ?? "",
    customer_phone: phone_number ?? "",
    customer_id: pick(body, ["data.customer_id"]) ?? "",
    channel: channel ?? "",
    message_text,
    event_type,
  };
  ```
- `substitute(template, ctx)` mengganti token `{{key}}` yang ada di whitelist; non-whitelist dibiarkan.
- `sendTemplate(...)` menerima `bodyVariables: string[]`:
  ```ts
  if (bodyVariables.length > 0) {
    components.push({
      type: "body",
      parameters: bodyVariables.map(text => ({ type: "text", text: text || " " })),
    });
  }
  ```
- Caller: `const resolved = (matched.body_variables ?? []).map(v => substitute(v, ctx));` lalu lewatkan ke `sendTemplate`.

## 7. Verifikasi

1. **Templates**: klik Sinkron → tabel terisi, jumlah variabel akurat (mis. `order_confirmation` = 2).
2. **Rules**: edit rule `quick_order`, pilih dari dropdown → input variabel otomatis muncul sesuai jumlah `{{n}}`. Isi `{{1}}=Halo {{customer_name}}`.
3. Trigger ulang `123#` → log edge function menampilkan payload `components` berisi `body.parameters[0].text = "Halo a"`. Tidak ada error `131008`. Row `kirimchat_webhook_events` ber-`rule_action = sent`.
