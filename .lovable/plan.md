# BirdSend MCP

Tujuan: agen AI (Claude/Cursor/ClickUp) bisa membaca & mengelola akun BirdSend Anda lewat MCP server yang sudah ada (`mcp-rapatin`), bukan server baru — jadi satu endpoint & satu API key saja.

## Yang sudah ada (terverifikasi)
- `supabase/functions/mcp-rapatin/index.ts` — MCP Streamable HTTP, auth `MCP_ADMIN_API_KEY`, tools artikel blog + MySQL.
- Tools didaftarkan di array `TOOLS` dan dieksekusi di `handleTool()`.
- Halaman admin `/admin/mcp-server` menampilkan daftar tools per kategori.

## API BirdSend
- Base URL: `https://api.birdsend.co/v1`
- Auth: header `Authorization: Bearer <access_token>` (token dibuat di developer area BirdSend).
- Endpoint relevan: `/account`, `/broadcasts` (list/get/create/update/delete), `/contacts` (+tags, subscribe/unsubscribe), `/fields`, `/forms`, `/tags`, `/sequences`.

## Rencana implementasi

1. **Secret**: minta `BIRDSEND_API_TOKEN` lewat form secret aman (setelah Anda konfirmasi). Token diambil dari BirdSend Developer area (buat aplikasi → access token).

2. **`supabase/functions/_shared/birdsend.ts`** — helper `birdsendFetch(method, path, {query, body})`: pasang base URL + Bearer token, kembalikan status + body apa adanya bila error (biar agen lihat pesan asli BirdSend).

3. **Tools baru di `mcp-rapatin`** (prefix `birdsend_`):
   - Read: `birdsend_account`, `birdsend_list_broadcasts`, `birdsend_get_broadcast`, `birdsend_list_contacts`, `birdsend_get_contact`, `birdsend_list_tags`, `birdsend_list_fields`, `birdsend_list_forms`, `birdsend_list_sequences`
   - Write: `birdsend_create_broadcast`, `birdsend_update_broadcast`, `birdsend_create_contact`, `birdsend_update_contact`, `birdsend_add_contact_tags`, `birdsend_remove_contact_tag`, `birdsend_subscribe_contact`, `birdsend_unsubscribe_contact`
   - Destruktif (`birdsend_delete_broadcast`, `birdsend_delete_contact`) wajib `confirm: true`, mengikuti pola `delete_article`.
   - Setiap tool punya `inputSchema` sesuai parameter dokumentasi (pagination `page`/`per_page`, `keyword`, `sort`, dll).

4. **Halaman admin**: tambah section "BirdSend" di `src/pages/admin/McpServerInfo.tsx` dengan badge read/write, plus catatan bila `BIRDSEND_API_TOKEN` belum diset (tool akan balas error jelas).

5. **Deploy & uji**: deploy `mcp-rapatin`, cek `tools/list` dan panggil `birdsend_account` + `birdsend_list_broadcasts` untuk memastikan token valid.

## Catatan
- Tidak ada perubahan database; semua data diambil langsung dari API BirdSend saat dipanggil.
- Endpoint MCP tetap `.../functions/v1/mcp-rapatin` dengan API key yang sama.
