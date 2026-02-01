
# Rencana: Fix Redirect Flow Setelah Order Dibuat

## Masalah

Setelah user submit form Quick Order dan berhasil membuat order, frontend langsung redirect ke halaman Xendit. Ketika user kembali (dengan tombol Back browser), mereka masuk ke halaman `/quick-order` (form) - bukan ke halaman detail order `/quick-order/{slug}`.

## Analisis

1. Edge function sudah mengembalikan `access_slug` dalam response
2. Edge function sudah set `success_return_url` dan `cancel_return_url` ke `/quick-order/${accessSlug}`
3. **Masalah**: Frontend tidak memanfaatkan `access_slug` untuk navigasi yang lebih baik

## Solusi

Ubah flow setelah order dibuat:
1. **Simpan slug ke sessionStorage** sebelum redirect ke Xendit
2. **Atau lebih baik**: Navigasi ke halaman detail order terlebih dahulu, lalu buka Xendit di tab baru

Pendekatan yang lebih baik adalah **langsung navigasi ke halaman detail** dengan status pending, lalu dari sana user bisa klik tombol bayar. Ini memberikan pengalaman yang lebih baik karena:
- User bisa lihat ringkasan order sebelum bayar
- Jika kembali dari Xendit, mereka sudah di halaman yang benar
- Halaman detail sudah memiliki polling untuk update status

## Perubahan File

### `src/components/quick-order/QuickOrderForm.tsx`

**Lokasi**: Fungsi `onSubmit` baris 167-225

**Sebelum**:
```typescript
if (data?.invoice_url) {
  // Redirect to Xendit payment page
  window.location.href = data.invoice_url;
} else {
  toast.error("Gagal mendapatkan link pembayaran");
}
```

**Sesudah**:
```typescript
if (data?.access_slug) {
  // Store invoice URL for detail page
  if (data?.invoice_url) {
    sessionStorage.setItem(`xendit_url_${data.access_slug}`, data.invoice_url);
  }
  
  // Navigate to order detail page with pending status
  // User can see summary and click pay button from there
  window.location.href = `/quick-order/${data.access_slug}`;
} else if (data?.invoice_url) {
  // Fallback: direct redirect to Xendit (legacy flow)
  window.location.href = data.invoice_url;
} else {
  toast.error("Gagal mendapatkan link pembayaran");
}
```

### `src/pages/QuickOrderDetail.tsx`

Tambahkan logika untuk auto-redirect ke Xendit jika baru saja dibuat order:

**Lokasi**: Di dalam useEffect setelah order pertama kali dimuat

**Tambahan**:
```typescript
// Auto-redirect to Xendit if coming from form submission
useEffect(() => {
  if (order && order.payment_status === 'pending' && slug) {
    const xenditUrl = sessionStorage.getItem(`xendit_url_${slug}`);
    if (xenditUrl) {
      // Clear the stored URL
      sessionStorage.removeItem(`xendit_url_${slug}`);
      // Auto-redirect to payment page
      window.location.href = xenditUrl;
    }
  }
}, [order, slug]);
```

## Flow Baru

```text
1. User submit form Quick Order
            ↓
2. Edge function buat order & Xendit session
            ↓
3. Frontend terima response dengan access_slug & invoice_url
            ↓
4. Simpan invoice_url ke sessionStorage
            ↓
5. Navigate ke /quick-order/{slug} (halaman detail)
            ↓
6. Halaman detail load, deteksi ada URL di sessionStorage
            ↓
7. Auto-redirect ke Xendit untuk pembayaran
            ↓
8. Setelah bayar, Xendit redirect kembali ke /quick-order/{slug}
            ↓
9. User melihat halaman detail dengan status terupdate
```

## Keuntungan Flow Baru

1. **History browser benar**: Jika user tekan Back, mereka kembali ke halaman detail order - bukan form
2. **UX lebih baik**: User bisa lihat ringkasan order dengan status pending
3. **Konsisten**: Semua navigation menuju halaman yang sama
4. **Fallback aman**: Jika sessionStorage tidak tersedia, flow tetap berjalan dengan tombol bayar manual

## Alternatif: Buka Xendit di Tab Baru

Opsi lain adalah membuka Xendit di tab baru:
```typescript
if (data?.access_slug && data?.invoice_url) {
  // Navigate to detail page first
  window.location.href = `/quick-order/${data.access_slug}`;
  // Then open Xendit in new tab
  window.open(data.invoice_url, '_blank');
}
```

Namun ini bisa diblokir oleh popup blocker, jadi pendekatan sessionStorage lebih reliable.
