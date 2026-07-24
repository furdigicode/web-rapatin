
# MCP Server: Blog Articles

Membangun MCP server (Streamable HTTP) sebagai Supabase Edge Function `mcp-blog`, diamankan dengan **API key admin** yang disimpan di secret `MCP_ADMIN_API_KEY`. Agen AI (Claude Desktop, ChatGPT, Cursor, dll) bisa terhubung ke endpoint ini dengan menyertakan header `Authorization: Bearer <API_KEY>`.

## Endpoint & Auth

- URL: `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/mcp-blog`
- Config: `verify_jwt = false` di `supabase/config.toml` (autentikasi ditangani di dalam function).
- Setiap request diverifikasi: `Authorization: Bearer <MCP_ADMIN_API_KEY>` — kalau salah → 401.
- Fungsi bicara ke Supabase pakai `SUPABASE_SERVICE_ROLE_KEY` (server-side saja, tidak pernah keluar dari edge function) sehingga bisa read+write `blog_posts` tanpa terhalang RLS.

## Secrets

- `MCP_ADMIN_API_KEY` (baru) — di-generate otomatis 48 char via `generate_secret`. Nilainya akan saya tampilkan di dashboard Supabase Secrets untuk Anda salin ke konfigurasi MCP client.
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` — sudah ada.

## Protocol

Implementasi manual MCP Streamable HTTP (JSON-RPC 2.0) tanpa dependency berat, karena project pakai Deno edge function. Method yang di-handle:

- `initialize` — return server info + capabilities `{ tools: {} }`.
- `tools/list` — return daftar tool di bawah.
- `tools/call` — dispatch ke handler tool.
- `notifications/initialized`, `ping` — no-op / pong.

Response mendukung `Accept: application/json, text/event-stream` sesuai spec (single JSON response cukup untuk tool call sederhana).

## Tools yang di-expose

1. **`list_articles`** — read
   - Input: `{ status?: 'draft'|'published'|'scheduled', category?: string, limit?: number (default 20, max 100), search?: string }`
   - Return ringkasan: `id, title, slug, status, category, published_at, focus_keyword, word_count`.

2. **`get_article`** — read
   - Input: `{ id?: string, slug?: string }` (salah satu wajib)
   - Return full row `blog_posts`.

3. **`create_article`** — write
   - Input: `{ title, content, excerpt?, cover_image?, category, author_id?, focus_keyword?, seo_title?, meta_description?, slug?, status?: 'draft'|'published'|'scheduled', published_at?, send_notification? }`
   - Default `status='draft'`, `author_id` fallback ke default admin (`da51c3a0-...`) jika kosong.
   - Slug auto-generate dari title kalau tidak diisi; word_count dihitung dari content (strip HTML) memakai logika sama seperti `src/utils/wordCount.ts`.

4. **`update_article`** — write
   - Input: `{ id: string, ...fields sama dengan create (semua opsional) }`
   - Partial update; recompute `word_count` jika `content` berubah.

5. **`delete_article`** — write
   - Input: `{ id: string, confirm: true }`
   - Guard `confirm=true` supaya agen tidak menghapus tak sengaja.

6. **`publish_article`** — write shortcut
   - Input: `{ id: string, send_notification?: boolean }`
   - Set `status='published'`, `published_at=now()`; trigger `handle_new_article_notification` akan membuat notifikasi (mekanisme existing).

Semua tool return `{ content: [{ type: 'text', text: JSON.stringify(result) }] }` sesuai MCP spec, dan `isError: true` bila validasi gagal.

## Validasi

Zod (via `npm:zod`) untuk input tiap tool. Field enum `status` dibatasi ke tiga nilai valid. `slug` di-normalisasi (lowercase, dash) dan dicek unik sebelum insert/update.

## Admin UI (opsional, ringan)

Menambahkan halaman info `/admin/mcp-server` di sidebar bagian "Pengaturan" berisi:
- URL endpoint MCP.
- Instruksi konfigurasi di Claude Desktop / Cursor (`mcpServers` JSON snippet dengan `Authorization` header).
- Tombol link ke Supabase Secrets untuk melihat/rotate `MCP_ADMIN_API_KEY`.

Tidak menyimpan API key di database — hanya di Supabase Secrets.

## File changes

- `supabase/functions/mcp-blog/index.ts` (baru) — server MCP + tool handlers.
- `supabase/config.toml` — tambah `[functions.mcp-blog] verify_jwt = false`.
- `src/pages/admin/McpServerInfo.tsx` (baru) — halaman panduan konek.
- `src/components/admin/AdminLayout.tsx` — tambah menu "MCP Server" di grup Pengaturan.
- `src/App.tsx` — daftarkan route `/admin/mcp-server`.

## Verifikasi

Setelah deploy:
1. `curl` ke endpoint dengan `Authorization: Bearer <key>` dan payload `tools/list` → harus balas 6 tools.
2. Panggil `list_articles` dengan `limit: 3` → memastikan read jalan.
3. Panggil `create_article` (status draft) → cek row muncul di `blog_posts` via `supabase--read_query`, lalu `delete_article` untuk cleanup.
4. Salah API key → 401.

## Catatan

- Karena project pakai custom admin auth (bukan Supabase Auth), OAuth 2.1 dari `@lovable.dev/mcp-js` tidak dipakai. Pendekatan bearer API key ini setara dengan model "static access token" yang didukung MCP clients populer.
- Jika nanti ingin per-agen token / rotasi granular, bisa ditambah tabel `mcp_api_keys` dengan hashing — di luar scope sekarang.
