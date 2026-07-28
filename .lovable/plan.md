## Masalah
Halaman `/admin/mcp-server` (`src/pages/admin/McpServerInfo.tsx`) hanya mendaftarkan 6 tools artikel. 3 tools MySQL yang sudah ada di `supabase/functions/mcp-rapatin/index.ts` belum tampil.

## Perubahan
Tambahkan entri di array `TOOLS` pada `src/pages/admin/McpServerInfo.tsx`, dikelompokkan agar rapi:

- `mysql_list_tables` — type `read` — "Daftar semua tabel MySQL Rapatin (read-only)."
- `mysql_describe_table` — type `read` — "Tampilkan kolom sebuah tabel MySQL Rapatin."
- `mysql_run_query` — type `read` — "Jalankan SELECT/SHOW/DESCRIBE/EXPLAIN/WITH read-only (auto-cap 1000 baris)."

Opsional untuk kejelasan: pisahkan section jadi dua sub-heading di dalam Card "Tools yang tersedia" — **Artikel Blog** dan **MySQL Rapatin** — dengan me-render dua daftar terpisah. Tidak ada perubahan lain di file/logic.
