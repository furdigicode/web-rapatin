# Sinkronkan Schema Jurnal Manual MCP yang Aktif

## Temuan terverifikasi

- Source `kledo_update_manual_journal` sudah memiliki `ref_number`, `include_tax`, `attachment`, `tags`, serta `tax_id` dan `amount_after_tax` pada item.
- Handler update juga sudah meneruskan seluruh field tersebut ke `PUT /finance/manualJournals/{id}`.
- `mcp-rapatin` mendaftarkan tools langsung dari `KLEDO_TOOLS`, sehingga respons pada screenshot menunjukkan deployment aktif atau cache schema di klien masih memakai versi lama.

## Perubahan

1. Deploy ulang Edge Function `mcp-rapatin` dari source terbaru.
2. Panggil `tools/list` langsung ke endpoint MCP dan pastikan schema `kledo_update_manual_journal` memuat `ref_number` beserta field tambahan lainnya.
3. Uji panggilan update jurnal dengan `ref_number` yang diambil terlebih dahulu dari `kledo_get_manual_journal`, tanpa membuat data jurnal baru.
4. Jika endpoint sudah benar tetapi agen masih menampilkan schema lama, lakukan reconnect/refresh koneksi MCP pada klien agar cache `tools/list` diperbarui.

## Kriteria selesai

- Schema live untuk `kledo_update_manual_journal` menampilkan `id`, `trans_date`, `ref_number`, `include_tax`, `memo`, `attachment`, `items`, dan `tags`.
- Request update tidak lagi gagal dengan pesan `Ref number diperlukan`.
- Nomor referensi jurnal tetap sama setelah update.