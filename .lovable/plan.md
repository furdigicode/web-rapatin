
## Tujuan

Menambah fitur **MySQL Connect** agar server kita (Supabase Edge Functions) bisa membaca database MySQL aplikasi Rapatin secara **read-only**, dengan UI admin untuk mengelola koneksi + menjalankan query, lalu tahap 2 mengekspos akses ini sebagai **MCP tools** agar agent AI (ClickUp / Claude / Cursor) bisa memakainya.

## Feasibility

Bisa. Deno di Supabase Edge Functions mendukung koneksi MySQL langsung via driver `npm:mysql2` (TCP + TLS). Syarat dari sisi Rapatin:
- MySQL bisa dijangkau dari internet (host + port terbuka untuk IP Supabase).
- Ada user MySQL khusus dengan grant **SELECT saja** (`GRANT SELECT ON rapatin.* TO 'lovable_ro'@'%'`).
- Idealnya TLS aktif (`require_secure_transport`).

Kalau salah satu tidak terpenuhi kita akan sampaikan blocker-nya, bukan bikin workaround.

---

## Tahap 1 — MySQL Connect (read-only)

### 1.1 Secrets
Tambah 5 secret Supabase:
- `RAPATIN_MYSQL_HOST`
- `RAPATIN_MYSQL_PORT` (default 3306)
- `RAPATIN_MYSQL_USER` (user read-only)
- `RAPATIN_MYSQL_PASSWORD`
- `RAPATIN_MYSQL_DATABASE`

Diminta lewat `add_secret` sekaligus.

### 1.2 Edge Function `mysql-query` (private, admin only)
`supabase/functions/mysql-query/index.ts`:
- Verifikasi admin token (pola sama dengan `get-mcp-admin-key`: cek `admin_sessions` + `admin_users.is_active`).
- Body: `{ token, action, sql?, params?, table? }`.
  - `action: "ping"` → SELECT 1.
  - `action: "list_tables"` → `SHOW TABLES`.
  - `action: "describe_table"` → `DESCRIBE ??`.
  - `action: "query"` → jalankan `sql` + `params` (prepared statement).
- **Guard read-only**:
  - Regex whitelist: query harus diawali `SELECT`/`SHOW`/`DESCRIBE`/`EXPLAIN` (setelah dinormalisasi, buang komentar).
  - Blacklist keyword: `INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|RENAME|REPLACE|CALL|LOAD|HANDLER|LOCK`.
  - Tambah `LIMIT` otomatis kalau tidak ada, max 1000 baris.
  - Timeout query 15 detik.
- Koneksi pakai `npm:mysql2/promise` dengan `ssl: { rejectUnauthorized: false }` bila server pakai TLS self-signed. Connection dibuat per request (Edge Function stateless), close di `finally`.
- Log tiap query ke tabel `mysql_query_log` (lihat 1.3).
- Response: `{ ok, rows, fields, rowCount, durationMs }` atau `{ ok:false, error }`.

### 1.3 Migrasi DB (audit log)
Tabel `mysql_query_log`:
- `id uuid pk`
- `admin_id uuid`, `admin_email text`
- `action text` — 'ping'|'list_tables'|'describe_table'|'query'
- `sql text`, `params jsonb`
- `status text` — 'success'|'blocked'|'error'
- `row_count int`, `duration_ms int`, `error_message text`
- `created_at timestamptz default now()`

RLS: SELECT untuk `is_custom_admin_user()`; INSERT hanya `service_role`. Grants standar.

### 1.4 UI Admin `/admin/mysql-connect`
Route + submenu sidebar. Tab-based:

**Tab "Koneksi"**
- Tombol "Test Koneksi" (memanggil `action: ping`), menampilkan versi server + latency.
- Ringkas info secret mana saja yang sudah terisi (tanpa nilai).

**Tab "Skema"**
- Panggil `list_tables`, tampilkan sebagai list.
- Klik nama tabel → `describe_table` → tampilkan kolom + tipe.

**Tab "Query Runner"**
- Textarea SQL + tombol Run.
- Hasil ditampilkan sebagai tabel (kolom dinamis), max 1000 baris, dengan info `duration_ms`.
- Panel "Riwayat" (dari `mysql_query_log`) 50 terbaru, klik untuk load ulang ke editor.

Semua request UI → `supabase.functions.invoke('mysql-query', { body: { token: adminToken, ... } })`.

---

## Tahap 2 — MCP Tools untuk Agent AI

Tambahkan tools baru ke MCP server yang sudah ada (`supabase/functions/mcp-blog/index.ts`) — atau bikin server terpisah `mcp-rapatin` bila diinginkan. Rencana default: **tambahkan ke `mcp-blog` yang sudah dipakai ClickUp**, ganti namanya jadi `mcp-rapatin` di manifest tapi endpoint tetap agar tidak memutus koneksi ClickUp yang sudah ada. (Kalau ingin server terpisah, ini poin yang bisa diminta ubah.)

Tools baru (guard read-only sama seperti Tahap 1):

- `mysql_list_tables` — no args.
- `mysql_describe_table` — args `{ table: string }`.
- `mysql_run_query` — args `{ sql: string, params?: any[], limit?: number }`, hanya SELECT/SHOW/DESCRIBE/EXPLAIN.

Auth pakai `MCP_ADMIN_API_KEY` yang sudah ada (Bearer / X-API-Key). Semua eksekusi tetap masuk `mysql_query_log` dengan `admin_email = 'mcp:<key-suffix>'` untuk pembeda.

---

## Teknis singkat

- Driver: `import mysql from "npm:mysql2/promise"` — sudah support Deno lewat `npm:` specifier.
- Guard SQL: satu helper `assertReadOnly(sql)` dipakai di edge function dan handler MCP.
- Auto-`LIMIT`: kalau regex tidak menemukan `\blimit\s+\d+\b`, wrap → `SELECT * FROM ( <sql> ) _sub LIMIT 1000`.
- Tidak ada perubahan di sisi Rapatin selain user MySQL read-only + izin IP; ini di luar codebase kita — akan ditulis di UI sebagai instruksi setup.

## Yang tidak berubah

- Fitur MCP blog (`list_articles` dst.) tetap berjalan.
- Fitur admin lain tidak disentuh.
- Tidak ada write ke MySQL Rapatin dari sisi kita, sekarang maupun via MCP.
