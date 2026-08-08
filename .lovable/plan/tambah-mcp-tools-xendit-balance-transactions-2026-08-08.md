# Tambah MCP Tools Xendit (Balance & Transactions)

Tambahkan 5 tool Xendit ke MCP server `mcp-rapatin` mengikuti pola yang sama seperti Kledo dan BirdSend, sehingga agen AI bisa membaca saldo, transaksi, dan laporan Xendit lewat gateway Rapatin.

## Kredensial

Tidak perlu secret baru. Memakai `XENDIT_SECRET_KEY` yang sudah ada, dikirim sebagai Basic Auth (secret key sebagai username, password kosong) ke `https://api.xendit.co`.

## Tools

| Tool | Fungsi | Endpoint |
| --- | --- | --- |
| `xendit_get_balance` | Saldo CASH/HOLDING, filter currency, historical `at_timestamp` | `GET /balance` |
| `xendit_list_transactions` | Daftar transaksi dengan filter tipe, status, channel, tanggal, amount, reference; paginasi `limit`/`after_id`/`before_id` | `GET /transactions` |
| `xendit_get_transaction` | Detail satu transaksi | `GET /transactions/{id}` |
| `xendit_generate_report` | Buat report (BALANCE_HISTORY / TRANSACTIONS, CSV/JSON) | `POST /reports` |
| `xendit_get_report` | Cek status & unduh URL report | `GET /reports/{id}` |

Nama tool diberi prefiks `xendit_` (definisi aslinya `get_balance`, dll.) supaya tidak bentrok dengan tool lain di server yang sama; deskripsi dan skema input mengikuti file definisi. Semua tool bersifat read-only kecuali `generate_report` yang hanya membuat report (tidak memindahkan dana) — tidak ada tool disbursement/payout, jadi tidak ada aksi destruktif.

## Pengaman

- Tetap di balik `Authorization: Bearer MCP_ADMIN_API_KEY` seperti tool MCP lainnya.
- Tidak ada tool yang bisa membuat/mengubah pembayaran atau disbursement.
- Parameter `for_user_id` dikirim sebagai header `for-user-id` bila diberikan (xenPlatform sub-account).

## Detail teknis

- File baru `supabase/functions/_shared/xendit.ts`: `xenditFetch(method, path, { query, body, forUserId })` — Basic Auth dari `Deno.env.get("XENDIT_SECRET_KEY")`, serialisasi query termasuk array (`types[]`, `statuses[]`) dan bracket param (`created[gte]`, `updated[lte]`), plus error handling yang mengembalikan status + body Xendit.
- File baru `supabase/functions/_shared/xendit-mcp-tools.ts`: `XENDIT_TOOLS` (5 definisi `inputSchema`) dan `handleXenditTool(name, args)` yang memetakan tool → endpoint.
- `supabase/functions/mcp-rapatin/index.ts`: import dan spread `XENDIT_TOOLS` ke daftar `tools`, tambah blok handler `name.startsWith("xendit_")`.
- `src/pages/admin/McpServerInfo.tsx`: tambah section "Xendit (Pembayaran)" berisi 5 tool dengan badge read/write.
- Deploy ulang `mcp-rapatin`, lalu verifikasi lewat `tools/list` (total menjadi 58 tool) dan satu panggilan baca (`xendit_get_balance`) via cURL.

Tidak ada perubahan database, secret, atau fungsi lain.
