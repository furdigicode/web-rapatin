

# Rencana: Fallback Ketika Pembuatan Zoom Meeting Gagal

## Ringkasan

Menambahkan logika fallback di halaman detail order untuk mendeteksi kapan pembuatan Zoom meeting kemungkinan gagal, lalu menampilkan pesan error dengan tombol WhatsApp untuk menghubungi admin.

## Analisis Masalah

Saat ini ketika `order.zoom_link` kosong, UI hanya menampilkan spinner loading tanpa batas waktu. Jika Rapatin API gagal, user akan terjebak di loading state selamanya.

## Strategi Fallback

**Kriteria Fallback**: Jika pembayaran sudah sukses (`paid_at` ada) tetapi `zoom_link` masih kosong setelah **5 menit**, maka anggap pembuatan meeting gagal.

## File yang Diubah

`src/pages/QuickOrderDetail.tsx`

## Detail Perubahan

### 1. Tambah Logika Deteksi Timeout

Menambahkan fungsi untuk mengecek apakah sudah lebih dari 5 menit sejak pembayaran:

```typescript
// Helper untuk cek apakah pembuatan meeting kemungkinan gagal
const isZoomCreationLikelyFailed = (paidAt: string): boolean => {
  const paidTime = new Date(paidAt).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 menit dalam ms
  return (now - paidTime) > fiveMinutes;
};
```

### 2. Tambah Konstanta WhatsApp Admin

```typescript
const ADMIN_WHATSAPP = "6287788980084"; // Format internasional tanpa +
```

### 3. Generate Pesan WhatsApp dengan Detail Order

```typescript
const generateWhatsAppMessage = (order: OrderDetails): string => {
  return encodeURIComponent(
    `Halo Admin Rapatin, saya sudah melakukan pembayaran untuk order berikut:\n\n` +
    `Nama: ${order.name}\n` +
    `Email: ${order.email}\n` +
    `Tanggal Meeting: ${order.meeting_date}\n` +
    `Jumlah Peserta: ${order.participant_count}\n` +
    `Total Bayar: Rp${order.price.toLocaleString('id-ID')}\n\n` +
    `Namun link Zoom belum saya terima. Mohon bantuannya. Terima kasih.`
  );
};
```

### 4. Update UI Fallback

Mengganti loading state dengan kondisional:

```tsx
{order.zoom_link ? (
  // ... existing zoom details UI
) : order.paid_at && isZoomCreationLikelyFailed(order.paid_at) ? (
  // Fallback: Gagal membuat meeting
  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-6 text-center space-y-4">
    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto">
      <AlertTriangle className="w-6 h-6 text-orange-600" />
    </div>
    <div>
      <p className="font-medium text-orange-800 dark:text-orange-200">
        Terjadi kendala saat membuat Zoom meeting
      </p>
      <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
        Silakan hubungi admin kami untuk bantuan
      </p>
    </div>
    <Button asChild className="bg-green-600 hover:bg-green-700">
      <a 
        href={`https://wa.me/${ADMIN_WHATSAPP}?text=${generateWhatsAppMessage(order)}`}
        target="_blank" 
        rel="noopener noreferrer"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Hubungi Admin via WhatsApp
      </a>
    </Button>
  </div>
) : (
  // Loading state (masih dalam 5 menit)
  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 text-center">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
    <p className="font-medium text-blue-800 dark:text-blue-200">
      Link Zoom sedang diproses...
    </p>
    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
      Link akan muncul dalam beberapa saat
    </p>
  </div>
)}
```

### 5. Import Icon yang Dibutuhkan

Menambahkan import `AlertTriangle` dan `MessageCircle` dari lucide-react:

```typescript
import { 
  // ... existing imports
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
```

## Preview UI

### Loading State (dalam 5 menit pertama)
```text
┌─────────────────────────────────────────┐
│ Detail Zoom Meeting                     │
├─────────────────────────────────────────┤
│         🔄 (spinner)                    │
│    Link Zoom sedang diproses...         │
│    Link akan muncul dalam beberapa saat │
└─────────────────────────────────────────┘
```

### Fallback State (setelah 5 menit)
```text
┌─────────────────────────────────────────┐
│ Detail Zoom Meeting                     │
├─────────────────────────────────────────┤
│           ⚠️                            │
│    Terjadi kendala saat membuat         │
│    Zoom meeting                         │
│                                         │
│    Silakan hubungi admin kami           │
│    untuk bantuan                        │
│                                         │
│  [🟢 Hubungi Admin via WhatsApp]        │
└─────────────────────────────────────────┘
```

## Format Pesan WhatsApp

Ketika user klik tombol, akan membuka WhatsApp dengan pesan:

```
Halo Admin Rapatin, saya sudah melakukan pembayaran untuk order berikut:

Nama: John Doe
Email: john@example.com
Tanggal Meeting: 2026-01-28
Jumlah Peserta: 100
Total Bayar: Rp100.000

Namun link Zoom belum saya terima. Mohon bantuannya. Terima kasih.
```

## Timeline Update

Perlu juga update timeline item ke-3 untuk menampilkan status gagal:

```tsx
{/* Timeline Item 3: Zoom Meeting */}
<div className="flex gap-4">
  <div className="flex flex-col items-center">
    <div className={`w-3 h-3 rounded-full ${
      order.zoom_link 
        ? 'bg-green-500' 
        : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
          ? 'bg-orange-500'
          : 'bg-yellow-500 animate-pulse'
    }`} />
  </div>
  <div>
    <p className={`font-medium text-sm ${
      order.zoom_link 
        ? 'text-green-600' 
        : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
          ? 'text-orange-600'
          : 'text-yellow-600'
    }`}>
      {order.zoom_link 
        ? 'Zoom meeting dibuat' 
        : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
          ? 'Gagal membuat meeting'
          : 'Membuat Zoom meeting...'}
    </p>
    {order.zoom_link && (
      <p className="text-sm text-muted-foreground">
        Meeting siap digunakan
      </p>
    )}
    {!order.zoom_link && order.paid_at && isZoomCreationLikelyFailed(order.paid_at) && (
      <p className="text-sm text-muted-foreground">
        Hubungi admin untuk bantuan
      </p>
    )}
  </div>
</div>
```

## Ringkasan Perubahan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Loading tanpa timeout | Spinner selamanya | Timeout setelah 5 menit |
| Fallback UI | Tidak ada | Pesan error + tombol WhatsApp |
| Pesan WhatsApp | Tidak ada | Auto-generate dengan detail order |
| Timeline status | Hanya 2 state | 3 state (proses, sukses, gagal) |

