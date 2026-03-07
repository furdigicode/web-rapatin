

# Fix Template KirimChat di `notify-admin-order`

## Perubahan yang Diperlukan

Berdasarkan format request body yang user berikan, ada beberapa perbedaan dengan kode saat ini:

| Aspek | Saat Ini (Salah) | Seharusnya |
|-------|-----------------|------------|
| Template name | `"notifikasi"` | `"order_new"` (untuk new_order) — nanti akan ada template terpisah untuk payment_success |
| Language code | `"en"` | `"id"` |
| Header component | Ada (dengan parameter) | Tidak ada — header statis di template |
| Button `sub_type` | Tidak ada | `"url"` |
| Button `index` | `0` (number) | `"0"` (string) |
| Button slug | `access_slug` saja | `"/" + access_slug` (dengan garis miring di depan) |

## Perubahan: `supabase/functions/notify-admin-order/index.ts`

1. Hapus header component dari payload
2. Ganti template name: `"order_new"` untuk `new_order` event (nanti bisa ditambah template kedua untuk `payment_success`)
3. Language code → `"id"`
4. Button: tambah `sub_type: "url"`, index jadi string `"0"`, slug diawali `/`
5. Hapus variabel `headerText` yang tidak lagi dipakai
6. Untuk `event_type === "payment_success"`, sementara pakai template yang sama (`order_new`) sampai template baru dibuat — atau skip pengiriman dan log saja

Karena user bilang akan membuat template terpisah untuk pembayaran berhasil, saya akan:
- Gunakan `order_new` untuk `new_order`
- Untuk `payment_success`, log bahwa template belum tersedia dan return success (tidak block flow)

