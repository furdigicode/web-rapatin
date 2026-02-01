

# Rencana: Sinkronisasi Harga Quick Order di Edge Function

## Masalah

Harga di edge function `create-guest-order` masih menggunakan harga lama (harga Via Aplikasi), padahal seharusnya menggunakan **harga Quick Order** yang sudah +Rp 5.000.

### Perbandingan Harga

| Peserta | Harga Via Aplikasi | Harga Quick Order (Benar) | Harga di Edge Function (Salah) |
|---------|-------------------|--------------------------|-------------------------------|
| 100     | Rp 20.000         | **Rp 25.000**            | Rp 10.000                     |
| 300     | Rp 40.000         | **Rp 45.000**            | Rp 25.000                     |
| 500     | Rp 70.000         | **Rp 75.000**            | Rp 55.000                     |
| 1000    | Rp 130.000        | **Rp 135.000**           | Rp 100.000                    |

---

## Perubahan yang Diperlukan

### File: `supabase/functions/create-guest-order/index.ts`

**Lokasi**: Baris 17-23

**Sebelum (SALAH)**:
```typescript
const PRICING: Record<number, { promo: number; normal: number }> = {
  100: { promo: 10000, normal: 20000 },
  300: { promo: 25000, normal: 40000 },
  500: { promo: 55000, normal: 70000 },
  1000: { promo: 100000, normal: 130000 },
};
```

**Sesudah (BENAR)**:
```typescript
const PRICING: Record<number, { promo: number; normal: number }> = {
  100: { promo: 25000, normal: 40000 },
  300: { promo: 45000, normal: 80000 },
  500: { promo: 75000, normal: 140000 },
  1000: { promo: 135000, normal: 260000 },
};
```

---

## Ringkasan Perubahan

| File | Perubahan |
|------|-----------|
| `supabase/functions/create-guest-order/index.ts` | Update harga Quick Order sesuai pricing baru |

---

## Hasil yang Diharapkan

Setelah update:
1. Harga yang dikirim ke Xendit akan sesuai dengan harga yang ditampilkan di frontend
2. User yang order 100 peserta akan dicharge Rp 25.000 (bukan Rp 10.000)
3. Tidak ada lagi perbedaan antara harga tampilan dan harga pembayaran

