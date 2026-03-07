

# Aktifkan Template `order_paid` untuk Payment Success

## Perubahan: `supabase/functions/notify-admin-order/index.ts`

Saat ini `payment_success` di-skip karena template belum tersedia. Sekarang template `order_paid` sudah dibuat di KirimChat dengan format body dan button yang sama persis dengan `order_new`.

### Yang berubah

Baris 77-83: Ganti block skip menjadi:
```typescript
} else if (event_type === "payment_success") {
  templateName = "order_paid";
}
```

Hanya 1 perubahan kecil — menghapus skip logic dan mengisi `templateName = "order_paid"`.

