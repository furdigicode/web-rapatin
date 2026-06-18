## Tambah Aksi "Lihat Log" di KirimChat Rules

Tambahkan tombol ikon log (di kolom Aksi, sebelum Edit/Hapus) yang membuka dialog berisi riwayat webhook events yang matched ke rule tersebut.

### Perubahan

**`src/pages/admin/KirimchatRules.tsx`**
- Tambah ikon `ScrollText` (atau `FileText`) di kolom Aksi tiap baris, dengan tooltip "Lihat Log".
- State baru: `logRule: Rule | null`, `logs: WebhookEvent[]`, `logsLoading`.
- Saat diklik: query `kirimchat_webhook_events` `where matched_rule_id = rule.id` order `received_at desc` limit 50.
- Dialog (`max-w-3xl`, scrollable):
  - Header: "Log: {rule.name}"
  - Tabel kolom: Waktu (format lokal id-ID), Event, Phone, Status (`rule_action` badge: `sent` hijau / `failed` merah / `skipped` abu), Pesan Error (truncate).
  - Tiap baris bisa di-expand (accordion/collapsible) untuk menampilkan `payload` JSON ter-pretty.
  - Empty state: "Belum ada log untuk rule ini."
  - Tombol "Refresh" + "Tutup".

### Verifikasi
- Klik ikon log pada rule "Testing" → dialog tampil dengan event `message.received` dari `123#` beserta status `sent`.
- Klik baris untuk expand payload → JSON terlihat rapi.
