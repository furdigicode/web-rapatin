
# Rencana: Gabung Halaman Quick Order Status dengan Slug

## Ringkasan
Menggabungkan dua halaman terpisah (`QuickOrderSuccess.tsx` dan `QuickOrderPending.tsx`) menjadi satu halaman dinamis menggunakan route parameter (slug) berdasarkan Order ID dari Supabase.

## Perubahan URL

| Sebelum | Sesudah |
|---------|---------|
| `/quick-order/success?order_id=abc123` | `/quick-order/abc123` |
| `/quick-order/pending?order_id=abc123` | `/quick-order/abc123` |

Halaman baru akan menampilkan konten berbeda berdasarkan `payment_status`:
- **pending**: Menampilkan countdown timer dan tombol cek status
- **paid**: Menampilkan detail order lengkap + info Zoom
- **expired**: Menampilkan pesan kadaluarsa

## File yang Diubah/Dibuat

### 1. File Baru: `src/pages/QuickOrderDetail.tsx`
Halaman utama yang menggabungkan logika dari kedua halaman lama.

### 2. File yang Diubah: `src/App.tsx`
- Hapus route `/quick-order/success` dan `/quick-order/pending`
- Tambah route baru `/quick-order/:orderId`

### 3. File yang Diubah: `supabase/functions/check-order-status/index.ts`
- Tambahkan field tambahan: `whatsapp`, `meeting_time`, `meeting_topic`, `custom_passcode`, `xendit_invoice_url`

### 4. File yang Dihapus (Opsional)
- `src/pages/QuickOrderSuccess.tsx`
- `src/pages/QuickOrderPending.tsx`

## Detail Implementasi

### Route Baru
```tsx
// App.tsx
<Route path="/quick-order/:orderId" element={<QuickOrderDetail />} />
```

### Struktur Komponen Baru

```text
QuickOrderDetail.tsx
├── useParams() untuk ambil orderId dari URL
├── State Management
│   ├── order: GuestOrder | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── timeLeft: string (untuk countdown)
├── Auto-polling setiap 5-10 detik jika pending
├── Countdown timer jika pending
└── Render berdasarkan status:
    ├── pending → Countdown + Cek Status + Link ke Invoice
    ├── paid → Detail Order + Zoom Info
    └── expired → Pesan Kadaluarsa + Buat Order Baru
```

### Interface Order (Diperluas)
```typescript
interface OrderDetails {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  meeting_date: string;
  meeting_time: string | null;
  meeting_topic: string | null;
  custom_passcode: string | null;
  participant_count: number;
  price: number;
  payment_status: 'pending' | 'paid' | 'expired';
  zoom_link: string | null;
  zoom_passcode: string | null;
  meeting_id: string | null;
  xendit_invoice_url: string | null;
  expired_at: string | null;
  paid_at: string | null;
  created_at: string;
}
```

### UI Layout

```text
┌─────────────────────────────────────────────────┐
│               STATUS HEADER                      │
│  ┌─────────────────────────────────────────┐    │
│  │ [Icon berdasarkan status]               │    │
│  │ Judul: Pembayaran Berhasil/Menunggu/... │    │
│  │ Subtitle                                │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│ (Jika PENDING)                                   │
│ ┌─────────────────────────────────────────┐     │
│ │ Sisa Waktu: 23:45:12                    │     │
│ │ [Lanjutkan Pembayaran ↗]                │     │
│ │ [Cek Status Pembayaran]                 │     │
│ └─────────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│ DETAIL ORDER                                     │
│ ├─ Nama        : John Doe                       │
│ ├─ Email       : john@example.com               │
│ ├─ WhatsApp    : 081234567890                   │
│ ├─ Topik       : Team Meeting Weekly            │
│ ├─ Tanggal     : Senin, 27 Januari 2026         │
│ ├─ Jam         : 10:00 WIB                      │
│ ├─ Peserta     : 100 orang                      │
│ └─ Total Bayar : Rp 25.000                      │
├─────────────────────────────────────────────────┤
│ (Jika PAID + Zoom Ready)                         │
│ DETAIL ZOOM MEETING                              │
│ ├─ Meeting ID  : 123 456 7890 [Copy]            │
│ ├─ Passcode    : abc123 [Copy]                  │
│ ├─ Link        : zoom.us/j/... [Copy]           │
│ └─ [Buka Zoom Meeting ↗]                        │
├─────────────────────────────────────────────────┤
│ (Jika PAID tapi Zoom belum ready)               │
│ ┌─────────────────────────────────────────┐     │
│ │ [Spinner] Link Zoom sedang diproses...  │     │
│ └─────────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│ [Buat Order Baru] [Kembali ke Beranda]          │
└─────────────────────────────────────────────────┘
```

### Update Edge Function
Tambahkan field yang diperlukan:
```typescript
// check-order-status/index.ts
.select('id, name, email, whatsapp, meeting_date, meeting_time, meeting_topic, custom_passcode, participant_count, price, payment_status, zoom_link, zoom_passcode, meeting_id, xendit_invoice_url, expired_at, paid_at, created_at')
```

### Fitur Halaman Gabungan

1. **Status Pending**
   - Countdown timer sampai expired
   - Tombol "Lanjutkan Pembayaran" (link ke Xendit invoice)
   - Tombol "Cek Status" manual
   - Auto-polling setiap 10 detik

2. **Status Paid**
   - Badge sukses hijau
   - Detail order lengkap (termasuk topik, jam, dll)
   - Info Zoom dengan tombol copy
   - Link buka Zoom meeting
   - Jika Zoom belum ready: tampilkan loader

3. **Status Expired**
   - Badge error merah
   - Pesan pembayaran kadaluarsa
   - Tombol buat order baru

## Urutan Implementasi

1. **Update Edge Function** - Tambahkan field yang diperlukan ke response
2. **Buat `QuickOrderDetail.tsx`** - Halaman baru yang menggabungkan kedua logika
3. **Update `App.tsx`** - Ganti routing lama dengan yang baru
4. **Hapus file lama** - `QuickOrderSuccess.tsx` dan `QuickOrderPending.tsx`

## Backward Compatibility

Untuk menjaga link lama tetap berfungsi (jika ada user yang sudah menyimpan link), bisa ditambahkan redirect:
```tsx
// Redirect dari format lama ke format baru
<Route path="/quick-order/success" element={<Navigate to={`/quick-order/${searchParams.get('order_id')}`} replace />} />
<Route path="/quick-order/pending" element={<Navigate to={`/quick-order/${searchParams.get('order_id')}`} replace />} />
```

Atau bisa dibuat komponen redirect sederhana yang membaca query param dan redirect ke slug.
