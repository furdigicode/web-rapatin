## Tujuan

Admin bisa melihat kredensial koneksi MySQL Rapatin (host, port, database, username, password) langsung dari halaman `/admin/mysql-connect`, tanpa harus buka Supabase dashboard.

## Ringkasan perubahan

1. **Edge Function baru: `get-mysql-config`**
   - Verifikasi admin via `is_custom_admin_user()` (pola sama dengan `get-mcp-admin-key`).
   - Baca env: `RAPATIN_MYSQL_HOST`, `RAPATIN_MYSQL_PORT`, `RAPATIN_MYSQL_DATABASE`, `RAPATIN_MYSQL_USER`, `RAPATIN_MYSQL_PASSWORD`.
   - Return JSON berisi kelima nilai apa adanya (hanya admin terautentikasi yang bisa memanggil).

2. **UI di `src/pages/admin/MysqlConnect.tsx`**
   - Di tab **Koneksi**, tambah card "Detail Koneksi" berisi 5 field read-only:
     - Host, Port, Database, Username → tampil langsung dengan tombol **Copy**.
     - Password → tersembunyi (`••••••••`) dengan tombol **Show/Hide** (ikon Eye) dan tombol **Copy**.
   - Data di-fetch on mount via `supabase.functions.invoke('get-mysql-config')`.
   - Loading state pakai skeleton; kalau non-admin, tampilkan pesan error.
   - Tambah catatan kecil: "Nilai diambil dari Supabase Secrets. Untuk mengubah, gunakan tombol di bawah."
   - Tombol "Update Secret" per field membuka form update via link ke Supabase settings (opsional, tetap manual lewat kami).

## Catatan keamanan

- Password hanya dikirim ke klien setelah verifikasi admin di edge function; tidak disimpan di localStorage.
- Ditampilkan di UI dengan default masked + reveal on demand.
- Tidak ada perubahan pada `mysql-query` atau MCP.

## Detail teknis

- File baru: `supabase/functions/get-mysql-config/index.ts` (CORS, verify_jwt default, cek admin, return config).
- Update: `src/pages/admin/MysqlConnect.tsx` — tambah komponen kecil `ConnectionDetails` di tab Koneksi.
- Tidak ada migration DB.
