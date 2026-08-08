# Lengkapi Field Jurnal Manual Kledo di MCP

Agen gagal update jurnal manual karena tool `kledo_update_manual_journal` tidak punya parameter `ref_number` (dan beberapa field lain yang diterima API Kledo). Skema payload resmi Kledo untuk jurnal manual adalah:

```text
trans_date, include_tax, ref_number, memo, attachment[],
items[{ finance_account_id, tax_id, desc, amount, amount_after_tax }],
tags[]
```

Saat ini tool create/update hanya meneruskan `trans_date`, `memo`, `items` (dan item hanya `finance_account_id`, `desc`, `amount`), sehingga `ref_number` yang dikirim agen selalu dibuang sebelum request.

## Perubahan

Di `supabase/functions/_shared/kledo-mcp-tools.ts`:

1. `kledo_update_manual_journal` — tambah properti ke `inputSchema`:
   - `ref_number` (string, opsional) — nomor referensi jurnal, mis. `JURNAL/2026/01/01/1`. Wajib disertakan saat update kalau ingin nomor referensi lama dipertahankan.
   - `include_tax` (integer 0/1, default 1)
   - `attachment` (array of string URL, opsional)
   - `tags` (array of integer, opsional)
   - Item: tambah `tax_id` (integer, opsional) dan `amount_after_tax` (number, opsional).
2. `kledo_create_manual_journal` — tambah properti yang sama (`ref_number`, `include_tax`, `attachment`, `tags`, `tax_id`, `amount_after_tax`) supaya create dan update konsisten. Field wajib tetap `trans_date`, `memo`, `items`.
3. Handler `case "kledo_create_manual_journal"` dan `case "kledo_update_manual_journal"` — perluas `pick()` menjadi `["trans_date", "include_tax", "ref_number", "memo", "attachment", "items", "tags"]` agar field baru benar-benar ikut terkirim ke API.
4. Perjelas deskripsi tool: aturan jumlah `amount` harus 0 tetap, plus catatan bahwa update bersifat replace dan `ref_number` sebaiknya diambil dulu dari `kledo_get_manual_journal`.

Tidak ada perubahan pada `_shared/kledo.ts`, tabel database, atau secret.

## Verifikasi

1. Deploy ulang `mcp-rapatin`.
2. `tools/list` — pastikan `kledo_update_manual_journal` sudah memuat `ref_number` di schema.
3. `kledo_get_manual_journal` untuk satu ID, lalu update jurnal yang sama dengan `ref_number` hasil read dan pastikan HTTP 200 serta `ref_number` tidak berubah.
