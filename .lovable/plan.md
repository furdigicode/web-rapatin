## Diagnosis

Template `order_new` di Kirimdev (dari DB `kirimchat_templates`):

```
No. Order: *{{1}}*
Pembeli:   *{{2}}*
Jumlah: Rp *{{3}}*        ← template SUDAH punya prefix "Rp "
Topik:     *{{4}}*
Waktu:     *{{5}}*
Kapasitas: *{{6}}* peserta

Button URL: https://rapatin.id/quick-order/{{1}}   ← param button = slug saja
```

Nilai yang dikirim saat ini untuk `INV-260727-0005`:

| Var | Nilai |
|---|---|
| {{1}} | `INV-260727-0005` |
| {{2}} | `Test` |
| {{3}} | `25.000` (sudah tanpa "Rp") |
| {{4}} | `Topik` (fallback dari `meeting_topic`) |
| {{5}} | `27 Juli 2026, 19:00 WIB` |
| {{6}} | `100` |
| Button {{1}} | `Cel44UoArig4NYFqF8maWw62` |

Log `notify-admin-order` kosong → kemungkinan deploy terakhir belum tereksekusi saat user retest, atau retensi log habis. Kita perlu bukti payload persis dari attempt berikutnya sebelum menebak lagi.

## Rencana

1. **Deploy ulang** `notify-admin-order` untuk memastikan versi terbaru (dengan log payload) yang aktif.
2. **Tingkatkan logging** di `notify-admin-order`:
   - Log HTTP status Kirimdev + full response body (bukan hanya `console.error`).
   - Log tiap parameter body/button beserta panjang karakternya, agar terlihat kalau ada karakter tak terlihat.
   - Ekspos ringkasan error Kirimdev ke response 500 (bukan hanya "Failed to send") supaya toast di admin menampilkan pesan asli — memudahkan debugging tanpa perlu membuka log.
3. **User retest** klik "Kirim Notif Admin" untuk `INV-260727-0005`, lalu kita baca log payload/response dan tentukan fix berikutnya berdasarkan pesan Kirimdev yang sebenarnya (misal: variabel bertipe angka, panjang parameter, dll).

Tidak mengubah logika mapping variabel sebelum melihat error asli — perubahan buta lagi hanya akan menambah putaran.

## File yang disentuh

- `supabase/functions/notify-admin-order/index.ts` — tambah logging detail per-parameter + kembalikan pesan error Kirimdev ke client.