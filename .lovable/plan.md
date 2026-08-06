# Kledo MCP Tools

Tambahkan 20 tool Kledo ke MCP server yang sudah ada (`mcp-rapatin`), sehingga agen AI (ClickUp, Claude, Cursor) bisa membaca dan mencatat data keuangan Kledo lewat gateway Rapatin — pola yang sama seperti tools BirdSend dan MySQL.

## Kredensial

Tidak perlu secret baru. Login Kledo sudah ada di `kledo-sync` dan token-nya di-cache di tabel `kledo_auth_tokens` (berlaku 29 hari). Logika itu dipindah ke helper bersama supaya MCP dan `kledo-sync` memakai token yang sama, termasuk auto re-login saat token ditolak (401).

## Tools yang ditambahkan

Kontak
- `kledo_get_contacts`, `kledo_get_contact`, `kledo_create_contact`

Kas & Bank
- `kledo_get_bank_transactions`, `kledo_get_bank_transaction`, `kledo_create_bank_transaction` (Terima Dana / Kirim Dana)

Beban
- `kledo_get_expenses`, `kledo_get_expense`, `kledo_create_expense`

Faktur
- `kledo_get_invoices`, `kledo_get_invoice`, `kledo_create_invoice`

Jurnal manual
- `kledo_get_manual_journals`, `kledo_get_manual_journal`, `kledo_create_manual_journal`

Chart of Accounts
- `kledo_get_finance_accounts`, `kledo_get_finance_account`

Destruktif (wajib `confirm: true`)
- `kledo_delete_invoice`, `kledo_delete_expense`, `kledo_delete_manual_journal`

Nama tool, deskripsi, dan skema input mengikuti file definisi JSON yang diberikan, jadi agen langsung paham konvensi Rapatin (type_id 3 untuk user, bank_account_id 1 = Xendit, trans_type_id 11/12, akun 1460 Saldo Pelanggan, 156 Payment Fee, dll).

## Pengaman

- Semua tool tetap di balik `Authorization: Bearer MCP_ADMIN_API_KEY` yang sudah dipakai MCP saat ini.
- Tool `delete_*` menolak jalan tanpa `confirm: true`.
- Tidak ada endpoint SQL/arbitrer — hanya endpoint Kledo resmi.

## Detail teknis

- File baru `supabase/functions/_shared/kledo.ts`: `getKledoToken()` (baca cache → login → simpan), `kledoFetch(method, path, { query, body })` terhadap `https://rapatin.api.kledo.com/api/v1` dengan header `app-client: web`, `X-App: finance`, plus retry sekali setelah invalidasi token pada respons 401.
- `supabase/functions/mcp-rapatin/index.ts`: tambah 20 definisi tool ke daftar `tools` dan satu blok handler `name.startsWith("kledo_")` yang memetakan tool → endpoint (`/finance/contacts`, `/finance/bankTrans`, `/finance/expenses`, `/finance/invoices`, `/finance/journals`, `/finance/accounts`).
- `supabase/functions/kledo-sync/index.ts`: dipakai ulang helper baru agar logika token tidak dobel (perilaku sync tetap sama).
- `src/pages/admin/McpServerInfo.tsx`: tambah section "Kledo (Keuangan)" berisi daftar tool dengan badge read/write.
- Deploy ulang `mcp-rapatin` dan `kledo-sync`, lalu verifikasi `tools/list` dan satu panggilan read (`kledo_get_finance_accounts`) via cURL.
