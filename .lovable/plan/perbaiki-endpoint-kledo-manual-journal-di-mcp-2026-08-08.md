# Perbaiki Endpoint Kledo Manual Journal di MCP

## Temuan (sudah diverifikasi ke API Kledo)

Tool `kledo_*_manual_journal*` di MCP memakai path `/finance/journals`. Path itu tidak ada:

```text
GET /api/v1/finance/journals        -> 404 {"message":"Not Found"}
GET /api/v1/finance/manualJournals  -> 200 (list jurnal manual, mis. id 19198)
GET /api/v1/finance/manualJournals/19198 -> 200 (detail + items)
```

Jadi setiap panggilan agen ke tool jurnal manual selalu gagal 404, bukan masalah token atau permission.

## Perubahan

Di `supabase/functions/_shared/kledo-mcp-tools.ts`, ganti path pada 5 case handler jurnal:

| Tool | Sebelum | Sesudah |
| --- | --- | --- |
| `kledo_get_manual_journals` | `GET /finance/journals` | `GET /finance/manualJournals` |
| `kledo_get_manual_journal` | `GET /finance/journals/{id}` | `GET /finance/manualJournals/{id}` |
| `kledo_create_manual_journal` | `POST /finance/journals` | `POST /finance/manualJournals` |
| `kledo_update_manual_journal` | `PUT /finance/journals/{id}` | `PUT /finance/manualJournals/{id}` |
| `kledo_delete_manual_journal` | `DELETE /finance/journals/{id}` | `DELETE /finance/manualJournals/{id}` |

Selain itu, perjelas deskripsi tool agar agen tidak salah bentuk payload — berdasarkan struktur data nyata dari Kledo:

- `trans_date` (YYYY-MM-DD), `memo`, dan `items` adalah field wajib.
- Setiap item: `finance_account_id`, `desc`, `amount` (positif = debit, negatif = kredit) dan total `amount` semua item harus 0.
- Respons sukses berisi `data.id`, `data.ref_number` (mis. `JURNAL/2026/08/07/177`), dan `data.items`.
- Untuk list, parameter yang didukung: `page`, `per_page`, `search`, `start_date`, `end_date`.

## Verifikasi

1. Deploy ulang function `mcp-rapatin`.
2. Panggil `kledo_get_manual_journals` (read) lewat MCP dan pastikan HTTP 200 dengan daftar jurnal.
3. Panggil `kledo_get_manual_journal` untuk satu ID dari hasil list.
4. Pembuatan jurnal baru (write) diuji oleh Anda dari agen AI, agar tidak menambah data uji di pembukuan.

## Catatan

Tidak ada perubahan pada `kledo-sync`, tools lain (invoice, expense, bankTrans, accounts) sudah memakai path yang benar dan tetap dibiarkan apa adanya.
