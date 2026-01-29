
# Rencana: Tambah Indikator Status Zoom di Tabel Order

## Ringkasan

Menambahkan indikator visual di kolom "Meeting" pada tabel order untuk menunjukkan apakah data Zoom Meeting sudah ready atau belum. Ini membantu admin dengan cepat mengidentifikasi order mana yang perlu perhatian (Zoom gagal dibuat).

---

## Opsi Desain

### Opsi A: Icon Kecil di Samping Topik Meeting (Rekomendasi)
Menambahkan icon kecil di samping judul topik meeting:
- ✅ Icon hijau jika `zoom_link` ada
- ⚠️ Icon kuning/oranye jika `payment_status = 'paid'` tapi `zoom_link` kosong
- Tidak tampilkan icon jika masih pending/expired

### Opsi B: Badge Terpisah di Baris Bawah
Menampilkan badge kecil di bawah tanggal/waktu:
- Badge "Zoom Ready" hijau
- Badge "Perlu Tindakan" oranye

### Opsi C: Kolom Baru "Zoom Status"
Menambah kolom terpisah khusus untuk status Zoom.

---

## Rekomendasi: Opsi A

Opsi A paling efisien karena:
- Tidak menambah lebar tabel
- Informasi terintegrasi dengan kolom Meeting yang sudah ada
- Mudah dipindai secara visual

---

## Implementasi (Opsi A)

### Tampilan di Tabel

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Tanggal Order │ Customer       │ Meeting                    │ Peserta │ Harga     │...
├────────────────────────────────────────────────────────────────────────────────────┤
│ 29 Jan 2026   │ Ahmad Rapi     │ ✅ Webinar Marketing       │   300   │ Rp125.000 │...
│ 10:30         │ ahmad@mail.com │ 30 Jan, 14:00              │         │           │...
├────────────────────────────────────────────────────────────────────────────────────┤
│ 28 Jan 2026   │ Budi Santoso   │ ⚠️ Training Internal       │   100   │ Rp 65.000 │...
│ 15:45         │ budi@mail.com  │ 29 Jan, 09:00              │         │           │...
├────────────────────────────────────────────────────────────────────────────────────┤
│ 27 Jan 2026   │ Citra Dewi     │ Rapat Bulanan              │   500   │ Rp250.000 │...
│ 08:20         │ citra@mail.com │ 28 Jan, 10:00              │         │           │... (pending/expired, no icon)
└────────────────────────────────────────────────────────────────────────────────────┘
```

Legenda:
- ✅ = Zoom Ready (ada `zoom_link`)
- ⚠️ = Perlu Tindakan (paid tapi `zoom_link` kosong)
- Tanpa icon = Pending/Expired

---

## Perubahan Kode

### File: `src/pages/admin/OrderManagement.tsx`

#### 1. Import Icon Baru

```tsx
import { 
  Search, 
  Download, 
  Eye, 
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Video,           // NEW - untuk Zoom ready
  AlertTriangle    // NEW - untuk perlu tindakan
} from 'lucide-react';
```

#### 2. Tambah Helper Function

```tsx
const getZoomStatusIcon = (order: GuestOrder) => {
  // Hanya tampilkan untuk order yang sudah lunas
  if (order.payment_status !== 'paid') {
    return null;
  }
  
  // Zoom sudah ready
  if (order.zoom_link) {
    return (
      <Video className="h-4 w-4 text-green-500 inline-block mr-1" />
    );
  }
  
  // Paid tapi Zoom belum ada - perlu tindakan
  return (
    <AlertTriangle className="h-4 w-4 text-orange-500 inline-block mr-1" />
  );
};
```

#### 3. Update Tampilan Kolom Meeting (Line 290-297)

```tsx
<TableCell>
  <div className="font-medium truncate max-w-[200px] flex items-center">
    {getZoomStatusIcon(order)}
    <span>{order.meeting_topic || '-'}</span>
  </div>
  <div className="text-sm text-muted-foreground">
    {format(new Date(order.meeting_date), 'd MMM', { locale: id })}
    {order.meeting_time && `, ${order.meeting_time}`}
  </div>
</TableCell>
```

---

## Tooltip (Opsional, untuk Clarity)

Untuk memberikan penjelasan lebih lanjut saat hover, bisa ditambahkan Tooltip:

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Dalam getZoomStatusIcon:
if (order.zoom_link) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Video className="h-4 w-4 text-green-500 inline-block mr-1" />
      </TooltipTrigger>
      <TooltipContent>Zoom Meeting Ready</TooltipContent>
    </Tooltip>
  );
}

return (
  <Tooltip>
    <TooltipTrigger>
      <AlertTriangle className="h-4 w-4 text-orange-500 inline-block mr-1" />
    </TooltipTrigger>
    <TooltipContent>Zoom belum tersedia - perlu input manual</TooltipContent>
  </Tooltip>
);
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/admin/OrderManagement.tsx` | Tambah icon status Zoom di kolom Meeting |

---

## Catatan

- Icon hanya muncul untuk order dengan `payment_status = 'paid'`
- Order pending/expired tidak perlu indicator karena memang belum waktunya punya Zoom
- Icon orange (⚠️) membantu admin cepat identifikasi order yang butuh tindakan manual
