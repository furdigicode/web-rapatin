# Perbaiki MCP Server agar kompatibel dengan ClickUp (contek FurqanSIM)

## Root cause
FurqanSIM lolos di ClickUp karena pakai `mcp-tanstack-start` yang di dalamnya membungkus **@modelcontextprotocol/sdk** resmi dengan **Streamable HTTP** transport — mendukung `Accept: application/json, text/event-stream`, respons **SSE**, header `Mcp-Session-Id`, `WWW-Authenticate`, dan CORS `Expose-Headers` yang benar.

`mcp-blog` kita saat ini adalah JSON-RPC hand-rolled: selalu balas `application/json`, tidak ada SSE, tidak ada session id. ClickUp menolak koneksinya sebelum sempat probe `tools/list` — itulah kenapa log function hanya berisi `booted/shutdown` tanpa satu pun request masuk.

## Perubahan

### 1. Refactor `supabase/functions/mcp-blog/index.ts` pakai SDK resmi
Import SDK via Deno `npm:` specifier — pola yang sama dengan yang dipakai FurqanSIM di balik `mcp-tanstack-start`:

```ts
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "npm:@modelcontextprotocol/sdk/server/streamableHttp.js";
```

Struktur handler baru (stateless, mengikuti pola FurqanSIM):
- **Auth**: verifikasi `Authorization: Bearer <MCP_ADMIN_API_KEY>` atau `X-API-Key`. Jika gagal → 401 dengan header `WWW-Authenticate: Bearer realm="Rapatin Blog MCP"` + CORS.
- **OPTIONS**: 204 dengan CORS lengkap.
- **POST**: buat instance transport `new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })` (stateless), hubungkan ke `McpServer`, panggil `transport.handleRequest(req, res, body)` — SDK sendiri yang memilih respons JSON vs SSE berdasarkan `Accept`, dan mengeluarkan header `Mcp-Session-Id`.
- **GET & DELETE**: 405 dengan payload JSON-RPC error (identik dengan FurqanSIM).
- **CORS headers** — persis seperti FurqanSIM:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, Mcp-Session-Id
  Access-Control-Expose-Headers: Mcp-Session-Id
  Access-Control-Max-Age: 86400
  ```

Karena `StreamableHTTPServerTransport` SDK menulis ke objek `res` ala Node, di Deno Edge Function kita adaptasi memakai helper singkat (in-memory response collector → `Response` Fetch API) — pola standar yang dipakai contoh MCP SDK untuk runtime non-Node. Jika ternyata SDK butuh polyfill Node stream yang tidak kompatibel di Deno, fallback-nya adalah menulis handler Streamable HTTP setara sendiri (SSE + session id + Accept negotiation) tanpa SDK. Keputusannya dibuat saat coding — target akhir kompatibilitas sama.

Tools 6 buah tetap: `list_articles`, `get_article`, `create_article`, `update_article`, `delete_article`, `publish_article` — logika handler dipindah ke bentuk `server.tool(name, schema, handler)` SDK, memakai Zod untuk skema input (SDK butuh Zod).

### 2. Update UI `/admin/mcp-server`
- Tampilkan URL: `https://<project-ref>.supabase.co/functions/v1/mcp-blog`.
- Konfigurasi Claude/Cursor tetap ada.
- Perbarui contoh cURL agar menyertakan `Accept: application/json, text/event-stream` (spec MCP).
- Tambah petunjuk singkat untuk ClickUp: pilih "Add MCP Server" → URL di atas → Auth "Bearer token" → paste API key.

### 3. Dependencies
Tambah `zod` ke `deno.lock` implicitly via `npm:zod`. Tidak ada perubahan `supabase/config.toml` (function sudah `verify_jwt = false`).

## Verifikasi
1. Deploy `mcp-blog`.
2. cURL dengan `Accept: application/json, text/event-stream` + Bearer → pastikan `initialize` mengembalikan header `Mcp-Session-Id` dan body SSE-framed.
3. cURL biasa (`Accept: application/json`) → JSON polos tetap jalan.
4. User coba ulang setup di ClickUp → cek log `mcp-blog` sudah ada baris POST masuk & tools ter-load.
