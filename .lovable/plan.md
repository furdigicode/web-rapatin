## Tujuan

Rename total `mcp-blog` → `mcp-rapatin`. Tidak ada kata "blog" tersisa di mana pun — termasuk path file. Klien lama yang masih menggunakan URL `mcp-blog` **akan berhenti bekerja** dan wajib diupdate ke URL baru.

## Perubahan

### 1. Buat `supabase/functions/mcp-rapatin/index.ts`
- Salin isi `supabase/functions/mcp-blog/index.ts` sepenuhnya.
- Ganti:
  - `serverInfo.name`: `"rapatin-blog-mcp"` → `"rapatin-mcp"`
  - Log prefix `[mcp]` → `[mcp-rapatin]`
  - `WWW-Authenticate realm`: `"Rapatin Blog MCP"` → `"Rapatin MCP"`
- Tools, logic, auth, dan protokol Streamable HTTP tidak berubah.

### 2. Hapus function lama
- Hapus folder `supabase/functions/mcp-blog/` (via `rm`).
- Panggil `supabase--delete_edge_functions` untuk `mcp-blog` supaya endpoint lama benar-benar hilang dari runtime Supabase.
- Hapus entri `[functions.mcp-blog]` di `supabase/config.toml` jika ada, dan tambahkan `[functions.mcp-rapatin]` dengan `verify_jwt = false`.

### 3. Update UI admin `src/pages/admin/McpServerInfo.tsx`
- Ganti semua URL `.../functions/v1/mcp-blog` → `.../functions/v1/mcp-rapatin`.
- Ganti label/heading yang menyebut "Blog" → tanpa kata "blog" (mis. "MCP Server Rapatin").
- Snippet konfigurasi Claude/Cursor/ClickUp memakai endpoint & server name baru.

### 4. Grep sisa referensi
- Cari string `mcp-blog` dan `rapatin-blog-mcp` di seluruh repo (sidebar, komentar user-facing, page lain, dsb). Ganti setiap kemunculan.
- Komentar internal / dokumentasi teknis yang mengandung kata "blog" dalam konteks fitur artikel (misal deskripsi tool `list_articles`) tetap boleh — batasannya adalah kata "blog" sebagai bagian dari nama server/URL/path MCP. Nama tools artikel (`list_articles`, dll.) tidak mengandung kata "blog" dan tetap seperti sekarang.

### 5. Deploy & uji
- Deploy `mcp-rapatin`.
- Test `tools/list` di endpoint baru → 9 tools.
- Test satu tool artikel dan `mysql_list_tables`.

## Konsekuensi untuk user

Semua klien MCP (ClickUp, Claude Desktop, Cursor) yang sudah tersambung ke endpoint lama harus diarahkan ulang ke URL baru:

```
https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/mcp-rapatin
```

API key (`MCP_ADMIN_API_KEY`) tidak berubah.

## Yang tidak berubah

- `MCP_ADMIN_API_KEY`, nama & signature tools, function `get-mcp-admin-key`.
- Tidak ada perubahan database.
