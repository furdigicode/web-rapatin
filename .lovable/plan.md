## Perbaikan `supabase/functions/_shared/mysql.ts`

Terapkan tiga perbaikan berikut, sesuai rekomendasi:

### 1. `createConn` — hapus SSL paksa, tambah error log detail
- Hapus opsi `ssl: { rejectUnauthorized: false }`.
- Tambah `enableKeepAlive: true`, `keepAliveInitialDelay: 0`.
- Trim `host`, `user`, `database`.
- Bungkus dengan try/catch: `console.error` dengan `{ message, code, errno, sqlState, syscall, address, port }`, lalu rethrow `MySQL connection failed: <code> - <message>` agar tampil di kolom SQL/Error pada tab Riwayat.

### 2. `runQuery` — timeout benar-benar menghentikan query
Ganti `AbortController` (tidak dibaca mysql2) dengan `Promise.race` antara `c.execute()` dan timer `QUERY_TIMEOUT_MS` yang memanggil `c.destroy()` saat trigger.

### 3. `ensureLimit` — jangan bungkus non-SELECT
Ubah menjadi:
- Bila bukan `SELECT`/`WITH`: kembalikan `stripped` apa adanya (SHOW/DESCRIBE/EXPLAIN tidak diubah).
- Bila sudah ada `LIMIT n`: kembalikan apa adanya.
- Selain itu: `${stripped} LIMIT ${max}` (tanpa subquery).

### Deploy & uji
- Auto-deploy `mysql-query` (impor `_shared/mysql.ts`).
- Klik **Test Koneksi** di `/admin/mysql-connect`; cek tab Riwayat untuk pesan error baru bila masih gagal.

### Catatan keamanan (di luar kode)
Setelah koneksi berhasil, user disarankan me-`ALTER USER` password MySQL karena kredensial sudah pernah tampil di UI/chat. Ini tindakan di sisi Rapatin, bukan perubahan kode.

### File yang diubah
- `supabase/functions/_shared/mysql.ts` — hanya file ini.
