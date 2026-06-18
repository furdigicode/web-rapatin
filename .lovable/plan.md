## KirimChat: Restruktur Sidebar + Fitur Rules Otomatisasi

### 1. Sidebar — grupkan menu KirimChat
Ubah `src/components/admin/AdminLayout.tsx`:
- Buat menu utama **KirimChat** (icon `MessageCircle`/`Webhook`) dengan dua submenu:
  - **Webhook** → `/admin/kirimchat-webhooks` (rute lama, tidak berubah)
  - **Rules** → `/admin/kirimchat-rules` (baru)
- Pola: ikuti struktur grup "Content" / "Voting" yang sudah ada (`SidebarMenuButton` + `SidebarMenuSub`).
- Group tetap terbuka jika `pathname` cocok dengan salah satu submenu.

### 2. Database — tabel `kirimchat_rules`
Migration baru:

```sql
CREATE TABLE public.kirimchat_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  event_type text NOT NULL,          -- mis. message_received, message_delivered, *
  match_mode text NOT NULL,           -- 'contains' | 'exact' | 'starts_with' | 'ends_with' | 'regex' | 'any'
  keyword text,                       -- nullable bila match_mode='any'
  case_sensitive boolean NOT NULL DEFAULT false,
  delay_seconds integer NOT NULL DEFAULT 0,
  template_name text NOT NULL,        -- nama template KirimChat yang dikirim
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kirimchat_rules TO authenticated;
GRANT ALL ON public.kirimchat_rules TO service_role;
ALTER TABLE public.kirimchat_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage kirimchat_rules"
  ON public.kirimchat_rules FOR ALL TO authenticated
  USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
```

Tambah juga kolom log pada event webhook agar bisa dilacak rule mana yang ter-trigger:

```sql
ALTER TABLE public.kirimchat_webhook_events
  ADD COLUMN IF NOT EXISTS matched_rule_id uuid REFERENCES public.kirimchat_rules(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rule_action text;   -- 'sent' | 'failed' | 'skipped'
```

### 3. Eksekusi rule di edge function `kirimchat-webhook`
Setelah baris event berhasil diinsert:
1. Ambil teks pesan dari payload (`pick` paths baru: `message`, `text`, `data.message`, `data.text`, `message.text`, `payload.message`, `payload.text`).
2. Query rules `is_active=true AND event_type IN (event_type, '*')` urut `priority DESC, created_at ASC`.
3. Untuk rule pertama yang cocok (sesuai `match_mode` + `case_sensitive`), kirim event ke kanal asinkron via `pg_net` atau pakai pendekatan sederhana: panggil edge function baru `kirimchat-send-template` setelah `delay_seconds` via `setTimeout` di dalam edge function (acceptable karena delay user-defined; kalau panjang akan diskedul lewat `pg_cron`/`pg_net.http_post` dengan `EdgeRuntime.waitUntil`).
   - **Pilihan implementasi**: pakai `EdgeRuntime.waitUntil(new Promise(r => setTimeout(r, delayMs)).then(sendTemplate))` agar respons 200 langsung balik ke KirimChat sementara pengiriman tetap berjalan. Cap delay di sisi UI/server (mis. maks 300 detik).
3. Update baris event dengan `matched_rule_id` dan `rule_action`.

### 4. Edge function baru `kirimchat-send-template`
- Input: `{ phone, template_name, variables? }`.
- Header `Authorization` internal: dipanggil dari `kirimchat-webhook` dengan service role; tetap aman karena CORS dibatasi dan secret hanya server-side.
- Body POST ke endpoint KirimChat (`https://api.kirim.chat/...` — pakai endpoint yang sudah dipakai modul WA existing; akan dicek di `supabase/functions/send-whatsapp-notification/index.ts` saat implement).
- Auth pakai `KIRIMCHAT_API_KEY` (sudah ada di secrets).
- Log error ke console.

### 5. Halaman admin baru `src/pages/admin/KirimchatRules.tsx`
- Tabel daftar rules: Name, Event, Match, Keyword, Delay, Template, Active toggle, Actions (Edit/Delete).
- Dialog form Tambah/Edit:
  - Name (text, required)
  - Aktif (Switch)
  - Event Type (Select: `*` Semua, `message_received`, `message_sent`, `message_delivered`, `message_read`, `message_failed`)
  - Match Mode (Select: Any/Contains/Exact/Starts With/Ends With/Regex)
  - Keyword (text, disabled bila Any)
  - Case sensitive (Switch)
  - Delay (number detik, 0–300)
  - Template Name (text, manual)
  - Priority (number)
- Validasi via zod.
- Daftarkan route di `src/App.tsx` dengan `ProtectedRoute`.

### 6. Verifikasi
- Sidebar memunculkan menu KirimChat dengan submenu Webhook & Rules; submenu aktif sesuai route.
- CRUD rules berjalan; rule aktif dengan event `message_received` + keyword "halo" memicu pengiriman template setelah delay yang ditentukan.
- Log webhook menampilkan `matched_rule_id` (opsional ditampilkan di kolom baru atau detail dialog — akan ditambahkan ringkas di detail dialog).

### Catatan teknis
- Untuk delay >60s sebaiknya pakai pg_cron, tapi MVP cap di 300s pakai `EdgeRuntime.waitUntil` agar tidak menambah infrastruktur.
- Endpoint pengiriman KirimChat akan diverifikasi dari fungsi WA yang sudah ada saat build.
