# Tambah 5 Tool Update Kledo ke MCP

Definisi terbaru berisi 25 tool: 20 yang sudah aktif, ditambah 5 tool baru bertipe **update** (edit entri yang sudah ada di Kledo).

## Tool baru

| Tool | Fungsi | Endpoint Kledo |
| --- | --- | --- |
| `kledo_update_contact` | Ubah data kontak (nama, telepon, email, alamat) | `PUT /finance/contacts/{id}` |
| `kledo_update_bank_transaction` | Ubah tanggal/memo/items transaksi Kas & Bank | `PUT /finance/bankTrans/{id}` |
| `kledo_update_expense` | Ubah biaya (mis. koreksi fee Xendit) | `PUT /finance/expenses/{id}` |
| `kledo_update_invoice` | Ubah invoice: items, diskon, withholding | `PUT /finance/invoices/{id}` |
| `kledo_update_manual_journal` | Ubah jurnal manual (items harus balance ke 0) | `PUT /finance/journals/{id}` |

Semua tool update bersifat **replace**: array `items` yang dikirim mengganti seluruh item lama, sesuai deskripsi di definisi.

## Perubahan teknis

- `supabase/functions/_shared/kledo-mcp-tools.ts`
  - Tambah 5 definisi tool ke `KLEDO_TOOLS` dengan `inputSchema` persis seperti file definisi (semua wajib `id`).
  - Tambah 5 `case` di `handleKledoTool` memakai `kledoFetch("PUT", ...)` dan `pick()` untuk body (tanpa `id`, karena `id` masuk ke path).
- `supabase/functions/mcp-rapatin/index.ts`
  - Tidak perlu diubah: routing sudah otomatis untuk semua nama berawalan `kledo_`.
  - Guard `confirm: true` tetap hanya untuk `kledo_delete_*` (update tidak destruktif permanen).
- `src/pages/admin/McpServerInfo.tsx`
  - Tambah 5 entri di daftar tool Kledo dengan label tipe `write`.
- Deploy ulang `mcp-rapatin`, lalu verifikasi lewat `tools/list` (total menjadi 53 tool) dan satu pemanggilan baca untuk memastikan tidak ada regresi.

Tidak ada perubahan database, secret, atau fungsi `kledo-sync`.
