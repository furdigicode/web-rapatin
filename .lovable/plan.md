## Tujuan
Menampilkan nilai `MCP_ADMIN_API_KEY` langsung di halaman `/admin/mcp-server` agar admin bisa menyalinnya tanpa harus buka dashboard Supabase.

## Pendekatan
Nilai secret hanya tersedia di sisi server (Edge Function via `Deno.env.get`). Jadi kita buat edge function admin-only yang mengembalikan key, lalu halaman admin memanggilnya dan menampilkan dengan tombol show/hide + copy.

## Langkah

1. **Edge function baru: `get-mcp-admin-key`**
   - Path: `supabase/functions/get-mcp-admin-key/index.ts`
   - Verifikasi caller adalah admin aktif:
     - Ambil `Authorization: Bearer <user_jwt>` dari request.
     - Buat Supabase client dengan service role, panggil `auth.getUser(jwt)` untuk dapat email.
     - Cek email ada di `admin_users` (aktif) + sesi valid di `admin_sessions` (mengikuti pola `is_admin_user()` yang sudah ada).
   - Jika lolos, kembalikan `{ key: Deno.env.get('MCP_ADMIN_API_KEY') }`.
   - Jika tidak, `401`.
   - Set `verify_jwt = true` di `supabase/config.toml` untuk function ini (default aman), atau verifikasi manual — pilih verifikasi manual agar konsisten dengan pola admin lain.

2. **UI di `src/pages/admin/MCPServer.tsx`**
   - Tambah section "API Key" dengan:
     - Field readonly bertipe password (mask) + tombol mata untuk show/hide.
     - Tombol "Salin".
     - Tombol "Muat Ulang" untuk fetch ulang.
   - Panggil function via `supabase.functions.invoke('get-mcp-admin-key')` saat tombol "Tampilkan" ditekan (lazy — jangan fetch otomatis saat halaman dibuka).
   - Update contoh snippet Claude/Cursor agar otomatis menyisipkan key ketika sudah di-reveal (opsional, atau tetap placeholder).

## Catatan keamanan
- Endpoint dibatasi hanya admin aktif; user biasa dapat 401.
- Key tetap tidak pernah masuk ke bundle frontend — hanya dikirim on-demand ke admin yang terautentikasi.
- Tidak menyimpan key di localStorage; hanya di state React (hilang saat refresh).

Setuju untuk saya implementasi?
