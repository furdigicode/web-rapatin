
# Rencana: Halaman Admin Order Management

## Ringkasan
Membuat halaman admin baru untuk menampilkan dan mengelola data orderan dari Quick Order (tabel `guest_orders`).

## Fitur Halaman

### 1. Statistik Overview (Cards)
Menampilkan ringkasan cepat:
- **Total Order**: Jumlah seluruh order
- **Pending**: Order menunggu pembayaran
- **Paid**: Order sudah dibayar
- **Expired**: Order kadaluarsa

### 2. Filter & Search
- **Search**: Cari berdasarkan nama, email, atau WhatsApp
- **Status Filter**: Semua / Pending / Paid / Expired
- **Date Filter**: Filter berdasarkan tanggal meeting

### 3. Tabel Data Order
Kolom yang ditampilkan:

| Kolom | Deskripsi |
|-------|-----------|
| Tanggal Order | created_at |
| Nama | name |
| Email / WhatsApp | email, whatsapp |
| Meeting | meeting_date, meeting_time, meeting_topic |
| Peserta | participant_count |
| Harga | price (format Rupiah) |
| Status | payment_status (badge berwarna) |
| Zoom Info | zoom_link, meeting_id (jika sudah paid) |
| Aksi | Tombol lihat detail |

### 4. Dialog Detail Order
Menampilkan informasi lengkap:
- Informasi pelanggan (nama, email, WhatsApp)
- Detail meeting (topik, tanggal, jam, passcode)
- Pengaturan meeting (5 toggle options)
- Info Zoom (jika sudah paid)
- Timeline (created_at, paid_at, expired_at)

### 5. Export CSV
Tombol untuk mengekspor data order ke file CSV.

## File yang Dibuat/Diubah

### File Baru
1. **`src/pages/admin/OrderManagement.tsx`**
   - Halaman utama manajemen order
   - Mengikuti pola dari `FeedbackManagement.tsx`

2. **`src/components/admin/OrderDetailDialog.tsx`**
   - Dialog untuk menampilkan detail order lengkap

3. **`src/types/OrderTypes.ts`**
   - Type definitions untuk order

### File yang Diubah
4. **`src/App.tsx`**
   - Tambah route baru `/admin/orders`

5. **`src/components/admin/AdminLayout.tsx`**
   - Tambah menu "Orders" di sidebar dengan icon ShoppingCart

## Struktur Komponen

```text
OrderManagement.tsx
├── Stats Cards (4 cards: Total, Pending, Paid, Expired)
├── Filter Section
│   ├── Search Input
│   ├── Status Select
│   └── Date Picker (optional)
├── Actions (Export CSV button)
├── Orders Table
│   ├── TableHeader
│   └── TableBody (map orders)
└── OrderDetailDialog (modal)
```

## Detail Implementasi

### Types (`src/types/OrderTypes.ts`)
```typescript
export interface GuestOrder {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  meeting_date: string;
  meeting_time: string;
  meeting_topic: string | null;
  custom_passcode: string | null;
  participant_count: number;
  price: number;
  payment_status: 'pending' | 'paid' | 'expired';
  payment_method: string | null;
  xendit_invoice_id: string | null;
  xendit_invoice_url: string | null;
  zoom_link: string | null;
  zoom_passcode: string | null;
  meeting_id: string | null;
  is_meeting_registration: boolean;
  is_meeting_qna: boolean;
  is_language_interpretation: boolean;
  is_mute_upon_entry: boolean;
  is_req_unmute_permission: boolean;
  created_at: string;
  paid_at: string | null;
  expired_at: string | null;
  updated_at: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  paid: number;
  expired: number;
}
```

### Badge Colors by Status
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return { variant: 'default', label: 'Lunas', color: 'bg-green-500' };
    case 'pending':
      return { variant: 'secondary', label: 'Menunggu', color: 'bg-yellow-500' };
    case 'expired':
      return { variant: 'destructive', label: 'Kadaluarsa', color: 'bg-red-500' };
    default:
      return { variant: 'outline', label: status };
  }
};
```

### Sidebar Menu Addition
```tsx
// Di AdminLayout.tsx, tambahkan sebelum Feedback menu
<SidebarMenuItem>
  <SidebarMenuButton 
    asChild 
    isActive={location.pathname === '/admin/orders'}
  >
    <Link to="/admin/orders">
      <ShoppingCart />
      <span>Orders</span>
    </Link>
  </SidebarMenuButton>
</SidebarMenuItem>
```

### Route Addition
```tsx
// Di App.tsx
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));

// Dalam Routes
<Route path="/admin/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
```

## UI Preview

```text
┌─────────────────────────────────────────────────────────────────┐
│ Orders                                                           │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │ Total   │ │ Pending │ │ Paid    │ │ Expired │                │
│ │   45    │ │   12    │ │   28    │ │    5    │                │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Search...        ] [Status ▼] [Export CSV]                  │
├─────────────────────────────────────────────────────────────────┤
│ Tanggal   │ Customer      │ Meeting       │ Harga  │ Status │ ▶│
├───────────┼───────────────┼───────────────┼────────┼────────┼──┤
│ 27 Jan 26 │ John Doe      │ Team Meeting  │ Rp 25k │ ✓ Lunas│ 👁│
│           │ john@mail.com │ 28 Jan, 10:00 │        │        │   │
├───────────┼───────────────┼───────────────┼────────┼────────┼──┤
│ 26 Jan 26 │ Jane Smith    │ Workshop UX   │ Rp 55k │ Pending│ 👁│
│           │ jane@mail.com │ 30 Jan, 14:00 │        │        │   │
└───────────┴───────────────┴───────────────┴────────┴────────┴──┘
```

## Detail Dialog Preview

```text
┌─────────────────────────────────────────────┐
│ Detail Order                            [X] │
├─────────────────────────────────────────────┤
│ INFORMASI PELANGGAN                         │
│ Nama     : John Doe                         │
│ Email    : john@example.com                 │
│ WhatsApp : +6281234567890                   │
├─────────────────────────────────────────────┤
│ DETAIL MEETING                              │
│ Topik    : Team Meeting Weekly              │
│ Tanggal  : Senin, 28 Januari 2026           │
│ Jam      : 10:00 WIB                        │
│ Peserta  : 300 orang                        │
│ Passcode : 123456 (custom)                  │
├─────────────────────────────────────────────┤
│ PENGATURAN MEETING                          │
│ ✓ Registrasi Peserta                        │
│ ✓ Fitur Q&A                                 │
│ ✗ Interpretasi Bahasa                       │
│ ✓ Mute Saat Masuk                           │
│ ✗ Minta Izin Unmute                         │
├─────────────────────────────────────────────┤
│ INFO ZOOM (jika paid)                       │
│ Meeting ID : 123 456 7890                   │
│ Passcode   : abc123                         │
│ Link       : [Salin Link]                   │
├─────────────────────────────────────────────┤
│ PEMBAYARAN                                  │
│ Harga    : Rp 25.000                        │
│ Status   : ✓ Lunas                          │
│ Dibayar  : 27 Jan 2026, 10:15               │
│ Invoice  : [Lihat Invoice ↗]                │
└─────────────────────────────────────────────┘
```

## Urutan Implementasi

1. Buat `src/types/OrderTypes.ts` - Type definitions
2. Buat `src/components/admin/OrderDetailDialog.tsx` - Dialog detail
3. Buat `src/pages/admin/OrderManagement.tsx` - Halaman utama
4. Update `src/components/admin/AdminLayout.tsx` - Tambah menu sidebar
5. Update `src/App.tsx` - Tambah route baru
