## Tujuan

Admin bisa mengedit langsung host/port/database/username/password MySQL dari halaman `/admin/mysql-connect`, lalu nilai baru langsung dipakai oleh `mysql-query` dan tools MCP.

## Kendala & pendekatan

Supabase Secrets tidak bisa di-update dari edge function (butuh Management API + PAT). Jadi kita pindahkan sumber kredensial dari env → tabel database (single-row config), dan tetap enkripsi password.

## Perubahan

1. **Migration baru: tabel `mysql_connection_config`**
   - Kolom: `id` (fixed singleton), `host`, `port`, `database`, `username`, `password`, `updated_at`, `updated_by`.
   - RLS: hanya `service_role`. Tidak ada policy untuk anon/authenticated (semua akses lewat edge function pakai service role setelah verifikasi admin session).
   - Seed row awal diisi dari nilai secret lama supaya tidak ada downtime (dilakukan lewat migration `INSERT ... ON CONFLICT DO NOTHING` — nilai secret di-copy manual di UI setelah deploy; migration hanya buat placeholder row).

2. **Edge Function `get-mysql-config`**
   - Ganti sumber dari `Deno.env.get(...)` menjadi query ke `mysql_connection_config`.

3. **Edge Function baru: `update-mysql-config`**
   - Verifikasi admin session (pola sama).
   - Terima body: `{ host, port, database, user, password }`.
   - Validasi (host non-empty, port angka 1–65535, dsb).
   - Upsert ke `mysql_connection_config` dan set `updated_by` = admin email.

4. **Edge Function `mysql-query` & shared `_shared/mysql.ts`**
   - Ubah `getMysqlConfig()` untuk membaca dari tabel (via service-role client) alih-alih env.
   - Fallback ke env vars jika row belum ada (kompatibilitas awal).

5. **UI `src/pages/admin/MysqlConnect.tsx`**
   - Card "Detail Koneksi" diubah dari read-only jadi editable:
     - Field host/port/database/username/password bisa diedit.
     - Tombol **Simpan** (disable saat tidak ada perubahan) + **Batal** (revert ke nilai server).
     - Password tetap punya toggle show/hide + copy.
     - Setelah simpan sukses → refresh + toast, dan sarankan klik **Test Koneksi**.
   - Tambah info "Terakhir diubah: … oleh …".

## Catatan keamanan

- Password disimpan plaintext di tabel (sama seperti di secrets sebelumnya) tapi hanya bisa dibaca lewat edge function ber-auth admin (RLS deny-all, hanya service_role).
- Audit log: setiap update tercatat via `updated_by` + `updated_at`. Opsional: tambah baris ke `mysql_query_log` dengan action `config_update`.
- Secret env lama (`RAPATIN_MYSQL_*`) tetap boleh ada sebagai fallback, tapi setelah row pertama diisi, tabel yang jadi sumber utama.

## Detail teknis

- File baru: `supabase/functions/update-mysql-config/index.ts`.
- Modifikasi: `supabase/functions/get-mysql-config/index.ts`, `supabase/functions/_shared/mysql.ts`, `src/pages/admin/MysqlConnect.tsx`.
- Migration singleton pattern: `CHECK (id = 'singleton')` dengan `id text primary key default 'singleton'`.
