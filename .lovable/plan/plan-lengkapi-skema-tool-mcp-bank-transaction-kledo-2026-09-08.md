# Plan: Lengkapi skema tool MCP bank transaction Kledo

Skema resmi Kledo `/finance/bankTrans` punya field yang belum ada di tool `kledo_create_bank_transaction` dan `kledo_update_bank_transaction` (`supabase/functions/_shared/kledo-mcp-tools.ts`).

## Field yang akan ditambahkan (create & update)

- `include_tax` (integer, optional) — 1 jika amount sudah termasuk pajak
- `ref_number` (string, optional) — nomor referensi terpisah dari `memo`
- `attachment` (array of string, optional) — lampiran
- `tags` (array of integer, optional) — tag ID Kledo
- `witholdings` (array of object, optional):
  - `witholding_account_id` (integer)
  - `witholding_amount` (number)
  - `witholding_percent` (number)
- `tax_id` (integer, optional) di dalam setiap `items` — saat ini hanya ada di expense, belum di bank transaction

Semua field baru bersifat optional agar panggilan yang sudah ada tidak rusak.

## Teknis

1. Edit `inputSchema` `kledo_create_bank_transaction` dan `kledo_update_bank_transaction` di `kledo-mcp-tools.ts` — tambah properti di atas dengan deskripsi singkat.
2. Handler create (`POST /finance/bankTrans`) dan update (`PUT /finance/bankTrans/{id}`) sudah meneruskan seluruh `args` apa adanya, jadi tidak perlu diubah — field baru otomatis ikut terkirim.
3. Deploy ulang `mcp-rapatin` agar agen AI melihat skema baru.
