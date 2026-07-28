## Kondisi saat ini

Tools MySQL sudah terdaftar di `supabase/functions/mcp-blog/index.ts`:
- `mysql_list_tables`
- `mysql_describe_table`
- `mysql_run_query` (read-only, auto LIMIT 1000, guard dari `_shared/mysql.ts`)

Endpoint MCP tidak berubah — client (ClickUp, Claude, Cursor) yang sudah tersambung otomatis melihat 3 tools baru ini tanpa konfigurasi ulang.

## Bug yang harus diperbaiki

Baris 215 `supabase/functions/mcp-blog/index.ts` membuka `switch (name) {` **kedua** di dalam `handleTool` — masih di dalam `switch` pertama, tepat setelah `case "mysql_run_query"` tanpa `return`/`break` dari luar. Akibatnya semua tool blog (`list_articles`, `get_article`, `create_article`, `update_article`, `delete_article`, `publish_article`) tidak pernah tereksekusi karena jatuh ke inner switch yang tidak pernah match. Ini kemungkinan sudah menyebabkan tools blog gagal senyap saat dipanggil agen.

Perbaikan: hapus baris `switch (name) {` kedua di sekitar baris 215 dan kurung tutup pasangannya di akhir handler, sehingga semua `case` menjadi satu switch tunggal.

## Perubahan

**File tunggal:** `supabase/functions/mcp-blog/index.ts`
1. Hapus inner `switch (name) {` di sekitar baris 215.
2. Hapus `}` penutup inner switch di akhir fungsi (biarkan `}` penutup outer switch dan `default` case yang mengembalikan "Unknown tool").
3. Pastikan struktur akhir: satu switch dengan seluruh case (mysql_* + article tools) + `default`.

Tidak menambah tool baru — permintaan user "MCP untuk akses MySQL" sudah terpenuhi struktural; yang tersisa hanya perbaikan bug agar tools benar-benar dapat dipanggil bersamaan.

## Deploy & uji

- Deploy `mcp-blog`.
- Test dari agen: minta list tables lalu describe salah satu tabel, dan jalankan `SELECT` sederhana.
- Sekaligus test satu tool blog (mis. `list_articles`) untuk memastikan bug switch bersarang beres.

## Yang tidak dilakukan

- Tidak memisahkan MCP MySQL ke edge function baru — tetap satu server MCP untuk mengurangi jumlah endpoint yang harus dikonfigurasi di klien.
- Tidak menambah tool tulis MySQL — hanya read-only sesuai desain gateway.
