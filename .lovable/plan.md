## Penyebab

Payload yang kita kirim untuk `INV-260727-0005`:

```json
{
  "template": "order_new",
  "language": "id",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "INV-260727-0005" },   // {{1}} No. Order
        { "type": "text", "text": "Test" },              // {{2}} Pembeli
        { "type": "text", "text": "Rp 25.000" },         // {{3}} Jumlah  ❌
        { "type": "text", "text": "Topik" },             // {{4}} Topik
        { "type": "text", "text": "27 Juli 2026, 19:00 WIB" }, // {{5}} Waktu
        { "type": "text", "text": "100" }                // {{6}} Kapasitas
      ]
    },
    {
      "type": "button", "sub_type": "url", "index": "0",
      "parameters": [{ "type": "text", "text": "Cel44UoArig4NYFqF8maWw62" }]
    }
  ]
}
```

Dari screenshot template Meta:
- Body `{{3}}` sudah punya prefix `Rp` di dalam template (`Jumlah: Rp *{{3}}*`), dan **Jenis variabel = Angka**. Kita duplikasi "Rp" dan kirim string non-numerik → `invalid_field_value`.
- Button URL `{{1}}` menggunakan base `https://rapatin.id/quick-order/{{1}}` (dinamis). Slug polos `Cel44UoArig4NYFqF8maWw62` sudah benar untuk kolom ini — tidak perlu diubah.

## Perubahan (satu file)

`supabase/functions/notify-admin-order/index.ts`:

1. Ganti param `{{3}}` (Jumlah) menjadi hanya angka terformat tanpa "Rp":
   ```
   order.price.toLocaleString("id-ID")   // "25.000"
   ```
   Hapus/hentikan pemakaian `formatRupiah` untuk parameter ini.
2. Pastikan `{{6}}` Kapasitas dikirim sebagai string angka murni: `String(order.participant_count)` tanpa sanitasi yang bisa menyisipkan spasi.
3. Biarkan `{{1}}, {{2}}, {{4}}, {{5}}` apa adanya (`sanitizeParam` cukup) — semua tipe teks.
4. Button URL parameter tetap `access_slug` (base URL sudah di template).

Kalau setelah deploy Kirimdev masih tolak, langkah berikutnya adalah verifikasi tipe variabel `{{2}}` di preview (kemungkinan sebenarnya Teks, tapi dropdown di screenshot menunjukkan "Angka" di posisi teratas — perlu konfirmasi user). Log payload sudah aktif jadi akan langsung terlihat.

## Verifikasi
- Deploy, klik "Kirim Notif Admin" pada order `INV-260727-0005`.
- Cek log `notify-admin-order`: baris "Kirimdev request payload" & "Kirimdev response" — target: 200 OK, WA masuk ke admin.